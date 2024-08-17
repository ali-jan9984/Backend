import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, userName, password } = req.body;
    // Validation for required fields
    if ([fullName, email, userName, password].some((field) => field === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Email validation
    if (!email.includes("@")) {
        throw new ApiError(400, "Invalid email");
    }

    // Password validation
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /\d/;
    const lowercaseLetterRegex = /[a-z]/;
    const uppercaseLetterRegex = /[A-Z]/;

    if (
        !specialCharacterRegex.test(password) ||
        !numberRegex.test(password) ||
        !lowercaseLetterRegex.test(password) ||
        !uppercaseLetterRegex.test(password)
    ) {
        throw new ApiError(400, "Password must include at least one special character, one number, one lowercase letter, and one uppercase letter.");
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (existedUser) {
        throw new ApiError(400, "User already exists");
    }

    // Handling avatar and cover image files
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    console.log(req.files)

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImageLocalPath) && req.files.coverImage.length> 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Uploading files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar || !avatar.url) {
        throw new ApiError(400, "Avatar upload failed");
    }

    // Create user in the database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        userName:userName.toLowerCase(),
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user');
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

export { registerUser };
