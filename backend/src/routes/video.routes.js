import { Router } from "express"
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/authentication.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()
router.use(verifyJWT) // Apply verifyJWT middleware to all routes in this file

router.route("/").get(getAllVideos)
router.route("/publish-video").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    publishAVideo
)

router.route("/get-video/:videoId").get(getVideoById)
router.route("/delete-video/:videoId").delete(deleteVideo)
router.route("/update/:videoId").patch(upload.single("thumbnail"), updateVideo)

router.route("/toggle/publish/:videoId").patch(togglePublishStatus)

export default router
