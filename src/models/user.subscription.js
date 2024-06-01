import mongoose, { Schema } from "mongoose"

const subsciptionSchema = new Schema(
    {
        subsciber: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        channel: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
)
export const Subsciption = mongoose.model("Subsciption", subsciptionSchema)
