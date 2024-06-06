import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.models.js"
import { User } from "../models/user.models.js"
import APIerror from "../utils/APIerrors.js"
import APIresponse from "../utils/APIresponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import { application } from "express"
import { Comments } from "../models/comments.model.js"
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, discription } = req.body
    if (!title) {
        throw new APIerror(404, "Title of video is not there")
    }
    if (!discription) {
        throw new APIerror(404, "Description of video is not there")
    }
    const videoLocalPath = req.files.videoFile[0].path
    const thumbnailLocalPath = req.files.thumbnail[0].path
    if (!(videoLocalPath && thumbnailLocalPath)) {
        throw new APIerror(400, "Video and thumbnail required for upload")
    }
    const videoUpload = await uploadToCloudinary(videoLocalPath)
    const thumbnailUpload = await uploadToCloudinary(thumbnailLocalPath)
    if (!(videoUpload && thumbnailUpload)) {
        throw new APIerror(500, "Error uploading")
    }
    const video = await Video.create({
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        title,
        discription,
        isPublished: false,
        owner: req.user._conditions._id,
        duration: videoUpload.duration,
    })
    const isVideoUploaded = await Video.findById(video._id)
    if (!isVideoUploaded) {
        throw new APIerror(500, "videoUpload failed please try again")
    }

    return res
        .status(200)
        .json(new APIresponse(200, video, "Video uploaded successfully"))
})
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const addingPipelines = []
    if (query) {
        addingPipelines.push({
            $search: {
                index: "searchVideos",
                text: {
                    query: query,
                    path: ["title", "discription"],
                },
            },
        })
    }
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new APIerror(400, "Invalid user")
        }
    }
    addingPipelines.push({
        $match: {
            owner: new mongoose.Types.ObjectId(`${userId}`),
        },
    })
    if (sortBy && sortType) {
        addingPipelines.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1,
            },
        })
    } else {
        addingPipelines.push({
            $sort: {
                createdAt: -1,
            },
        })
    }
    addingPipelines.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                    {
                        $project: {
                            userName: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$ownerDetails",
        }
    )
 const videoAggregate =  Video.aggregate(addingPipelines)
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    }
    const video =  await Video.aggregatePaginate(videoAggregate, options)
    return res
        .status(200)
        .json(new APIresponse(200, video, "All videos fetched sucessfully"))
})
//comments are not showing in getVideoById
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user._conditions._id
    if (!isValidObjectId(videoId)) {
        throw new APIerror(400, "Invalid video id")
    }
    if (!isValidObjectId(userId)) {
        throw new APIerror(400, "Invalid user id")
    }
    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(`${videoId}`),
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "likedVideos",
                as: "likes",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                addingPipelines: [
                    {
                        $lookup: {
                            from: "subsciptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers",
                        },
                    },
                    {
                        $addFields: {
                            subscriberCount: {
                                $size: "$subscribers",
                            },
                            isSubscribed: {
                                $cond: {
                                    if: {
                                        $in: [
                                            req.user._conditions._id,
                                            "$subscribers.subsciber",
                                        ],
                                    },
                                    then: true,
                                    else: false,
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            userName: 1,
                            isSubscribed: 1,
                            subscriberCount: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },
                isLiked: {
                    $cond: {
                        if: {
                            $in: [req.user._conditions._id, "$likes.likedBy"],
                        },
                        then: true,
                        else: false,
                    },
                },
                owner: {
                    $first: "$ownerDetails",
                },
            },
        },
        {
            $project: {
                videoFile: 1,
                title: 1,
                discription: 1,
                views: 1,
                createdAt: 1,
                duration: 1,
                comments: 1,
                owner: 1,
                likesCount: 1,
                isLiked: 1,
            },
        },
    ])
    if (!video) {
        throw new APIerror(500, "failed to fetch video")
    }
    await Video.findByIdAndUpdate(videoId, {
        $inc: {
            views: 1,
        },
    })

    await User.findByIdAndUpdate(req.user._conditions._id, {
        $addToSet: {
            watchHistory: videoId,
        },
    })
    return res
        .status(200)
        .json(
            new APIresponse(200, video[0], "video details fetched successfully")
        )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
}
