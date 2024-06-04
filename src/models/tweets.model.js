import mongoose, { Schema } from "mongoose"

const tweetSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        tweetContent: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)
export const Tweets = mongoose.model("Tweets", tweetSchema)
