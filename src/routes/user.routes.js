import { Router } from "express"
import { registerUser } from "../controllers/user.controllers.js"
import {
    upload,
    loginUser,
    logoutUser,
} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/authentication.middleware.js"
const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route(verifyJWT, "/logout").post(logoutUser)
export default router
