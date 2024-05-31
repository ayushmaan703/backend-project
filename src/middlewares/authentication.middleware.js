import APIerror from "../utils/APIerrors"
import { asyncHandler } from "../utils/asyncHandler"
import { User } from "../models/user.models"
import jwt from "jsonwebtoken"
const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new APIerror(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
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
