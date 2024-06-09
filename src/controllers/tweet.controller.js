import mongoose, { isValidObjectId } from "mongoose"
import { Tweets } from "../models/tweets.model.js"
import { User } from "../models/user.models.js"
import APIerror from "../utils/APIerrors.js"
import APIresponse from "../utils/APIresponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    if (!content) {
        throw new APIerror(400, "Content is required")
    }
    const tweet = await Tweets.create({
        owner: req.user._conditions._id,
        tweetContent: content,
    })
    if (!tweet) {
        throw new APIerror(500, "error creating tweet")
    }
    return res
        .status(200)
        .json(new APIresponse(200, tweet, "Tweet posted sucessfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!isValidObjectId(userId)) {
        throw new APIerror(400, "Invalid user id")
    }
    const user = await Tweets.findOne({
        owner: userId,
    })
    if (!user) {
        throw new APIerror(404, "User not found")
    }
    const userTweets = await Tweets.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(`${userId}`),
            },
        },
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
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "likedTweets",
                as: "likedBy",
                pipeline: [
                    {
                        $project: {
                            likedBy: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                likes: {
                    $size: "$likedBy",
                },
                owner: {
                    $first: "$ownerDetails",
                },
                isLiked: {
                    $cond: {
                        if: {
                            $in: [req.user._conditions._id, "$likedBy.likedBy"],
                        },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $sort: {
                createdBy: -1,
            },
        },
        {
            $project: {
                tweetContent: 1,
                ownerDetails: 1,
                likes: 1,
                isliked: 1,
            },
        },
    ])
    return res
        .status(200)
        .json(new APIresponse(200, userTweets, "Tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body
    if (!content) {
        throw new APIerror(400, "Content required")
    }
    if (!isValidObjectId(tweetId)) {
        throw new APIerror(400, "Invalid tweet id")
    }
    const tweet = await Tweets.findById(tweetId)
    if (!tweet) {
        throw new APIerror(400, "Tweet not found")
    }
    if (tweet?.owner.toString() !== req.user._conditions._id.toString()) {
        throw new APIerror(400, "only owner can edit thier tweet")
    }
    const updatedTweet = await Tweets.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                tweetContent: content,
            },
        },
        { new: true }
    )
    if (!updatedTweet) {
        throw new APIerror(500, "Failed to update tweet")
    }
    return res
        .status(200)
        .json(new APIresponse(200, updatedTweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId)) {
        throw new APIerror(400, "Invalid tweet id")
    }
    const tweet = await Tweets.findById(tweetId)
    if (!tweet) {
        throw new APIerror(400, "Tweet not found")
    }
    if (tweet?.owner.toString() !== req.user._conditions._id.toString()) {
        throw new APIerror(400, "only owner can edit thier tweet")
    }
    await Tweets.findByIdAndDelete(tweetId)
    return res
        .status(200)
        .json(new APIresponse(200, { tweetId }, "Tweet deleted successfully"))
})

export { createTweet, getUserTweets, updateTweet, deleteTweet }
