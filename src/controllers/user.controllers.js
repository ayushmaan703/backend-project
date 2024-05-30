import asyncHandler from "../utils/asyncHandler.js";
import APIerror from "../utils/APIerrors.js";
import { User } from "../models/user.models.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import APIresponse from "../utils/APIresponse.js";
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend  -
    // validation - not empty  -
    // check if user already exists: username, email -
    // check for images, check for avatar -
    // upload them to cloudinary, avatar -
    // create user object - create entry in db -
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullName, email, userName, password } = req.body;
    if (userName === " ") {
        throw new APIerror(400, "UserName is required !!");
    }
    if (email === " ") {
        throw new APIerror(400, "Email is required !!");
    }
    if (fullName === " ") {
        throw new APIerror(400, "FullName is required !!");
    }
    if (password === " ") {
        throw new APIerror(400, "Password is required !!");
    }
    /*you also use this format rather then if confitions
 if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
*/
    const uniqueUser = await User.findOne({
        $or: [{ userName }, { email }],
    });
    if (uniqueUser) {
        throw new APIerror(409, "User already exists ");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new APIerror(400, "Avatar image is required");
    }
    const avatarUpload = await uploadToCloudinary(avatarLocalPath);
    const coverImageUpload = await uploadToCloudinary(coverImageLocalPath);
    if (!avatarUpload) {
        throw new APIerror(400, " Avatar is required");
    }
    const user = await User.create({
        fullName,
        userName,
        avatar: avatarUpload.url,
        coverImage: coverImageUpload?.url || "",
        password,
        email,
    });
    const isUserCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!isUserCreated) {
        throw new APIerror(500, "Something went wrong while registration");
    }
    return res
        .status(201)
        .json(new APIresponse(200, isUserCreated, "User created successfully"));
});

export default registerUser;