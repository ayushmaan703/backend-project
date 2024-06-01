import APIerror from "../utils/APIerrors.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"
const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new APIerror(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )
        if (!user) {
            throw new APIerror(401, "Invalid access token")
        }
        req.user = user
        next()
    } catch (error) {
        throw new APIerror(400, error.message || "Invalid access token")
    }
})
export { verifyJWT }
