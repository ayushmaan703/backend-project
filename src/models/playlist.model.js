import mongoose, { Schema } from "mongoose"
const playlistSchema = new Schema(
    {
        videoName: {
            type: String,
            required: true,
        },
        videoDiscription: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
    },
    { timestamps: true }
)
export const Playlist = mongoose.model("Playlist", playlistSchema)
