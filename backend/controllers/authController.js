
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import generateToken from "../utils/generateToken.js";

import {
  sendVerificationEmail,
  sendVerificationSuccessEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmation,
} from "../services/emailService.js";


// ============ REGISTER WITH AUTO-VERIFICATION ============
// ============ REGISTER WITH EMAIL VERIFICATION ============
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, domain, password } = req.body;

  console.log("📝 Register:", email);

  // Validate required fields
  if (!name || !email || !phone || !domain || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if email already exists
  const userExists = await User.findOne({ email: normalizedEmail });

  if (userExists) {
    // If existing account is unverified, allow a new registration
    // by removing the old account first.
    if (!userExists.isVerified) {
      await User.deleteOne({ _id: userExists._id });
      console.log("🗑️ Removed previous unverified account:", normalizedEmail);
    } else {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }
  }

  // Check phone number
  const phoneExists = await User.findOne({ phone });

  if (phoneExists) {
    return res.status(400).json({
      success: false,
      message: "Phone number already registered",
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // Store only the hashed token in database
  const verificationTokenHash = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // Create user as UNVERIFIED and INACTIVE
  const user = await User.create({
    name,
    email: normalizedEmail,
    phone,
    domain,
    password: hashedPassword,

    // IMPORTANT:
    // User cannot login until email is verified.
    isActive: false,
    isVerified: false,

    verificationToken: verificationTokenHash,
    verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
  });

  // Create verification URL
  const verificationUrl =
    `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  console.log("📧 Sending verification email to:", user.email);

  // Send verification email
  const emailResult = await sendVerificationEmail(
    user.email,
    verificationUrl,
    user.name
  );

  // If email could not be sent, remove the newly created account
  if (!emailResult || !emailResult.success) {
    await User.deleteOne({ _id: user._id });

    console.error(
      "❌ Verification email could not be sent:",
      emailResult?.error || "Unknown email error"
    );

    return res.status(500).json({
      success: false,
      message:
        "Registration failed because the verification email could not be sent. Please try again.",
    });
  }

  console.log(
    "✅ User registered. Verification email sent to:",
    user.email
  );

  // IMPORTANT:
  // Do NOT return a JWT here.
  // The user must verify the email first.
  return res.status(201).json({
    success: true,
    message:
      "Registration successful! Please check your email and click the verification link to activate your account.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      domain: user.domain,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
});

// controllers/authController.js - Fix verifyEmail
// ============ VERIFY EMAIL ============

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Check token
  if (!token) {
    res.status(400);
    throw new Error("No verification token provided");
  }

  console.log("🔍 Verifying email with token:", token);
  console.log("🔍 Token length:", token.length);

  // Hash the token to compare with the stored hash
  const verificationTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  console.log("🔍 Hashed token:", verificationTokenHash);

  // Find user with matching token and valid expiry
  const user = await User.findOne({
    verificationToken: verificationTokenHash,
    verificationTokenExpires: { $gt: Date.now() },
  });

  // Token not found or expired
  if (!user) {
    console.log("❌ No valid user found with this token");

    // Check whether the token exists but has expired
    const expiredUser = await User.findOne({
      verificationToken: verificationTokenHash,
    });

    if (expiredUser) {
      console.log(
        "⚠️ Verification token expired:",
        expiredUser.email
      );

      res.status(400);
      throw new Error(
        "Verification link has expired. Please request a new one."
      );
    }

    res.status(400);
    throw new Error("Invalid verification token");
  }

  console.log("✅ User found:", user.email);

  // Mark account as verified and active
  user.isVerified = true;
  user.isActive = true;

  // Remove verification token after successful verification
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  // Store verification date
  user.verifiedAt = new Date();

  await user.save();

  console.log("✅ Email verified successfully:", user.email);

  // Send confirmation email
  // IMPORTANT:
  // If this email fails, the account remains verified.
  const successEmailResult = await sendVerificationSuccessEmail(
    user.email,
    user.name
  );

  if (!successEmailResult?.success) {
    console.warn(
      "⚠️ Account verified, but confirmation email failed:",
      successEmailResult?.error || "Unknown email error"
    );
  } else {
    console.log(
      "📧 Verification success email sent to:",
      user.email
    );
  }

  return res.status(200).json({
    success: true,
    message: "Email verified successfully! You can now login.",
  });
});
// ============ RESEND VERIFICATION EMAIL ============
// ============ RESEND VERIFICATION EMAIL ============
// ============ RESEND VERIFICATION EMAIL ============

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide your email address",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  console.log(
    "📧 Resend verification requested:",
    normalizedEmail
  );

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No user found with this email address",
    });
  }

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "Email is already verified",
    });
  }

  // Generate a new verification token
  const verificationToken = crypto
    .randomBytes(32)
    .toString("hex");

  // Store only hashed token
  const verificationTokenHash = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  user.verificationToken = verificationTokenHash;

  user.verificationTokenExpires =
    Date.now() + 24 * 60 * 60 * 1000;

  await user.save();

  // Create verification URL
  const verificationUrl =
    `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  console.log(
    "🔗 New verification URL generated for:",
    normalizedEmail
  );

  // Send verification email
  const emailResult = await sendVerificationEmail(
    normalizedEmail,
    verificationUrl,
    user.name
  );

  if (!emailResult?.success) {
    console.error(
      "❌ Resend verification email failed:",
      emailResult?.error || "Unknown email error"
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to send verification email. Please try again later.",
    });
  }

  console.log(
    "✅ Verification email resent successfully:",
    normalizedEmail
  );

  return res.status(200).json({
    success: true,
    message:
      "Verification email sent successfully. Please check your inbox.",
  });
});

// ============ LOGIN (Check if verified) ============
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("🔐 Login:", email);

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password"
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.log("❌ User not found:", email);
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  // Check if email is verified
  if (!user.isVerified) {
    console.log("❌ User not verified:", email);
    return res.status(401).json({
      success: false,
      message: "Please verify your email first. Check your inbox for the verification link."
    });
  }

  if (!user.isActive) {
    console.log("❌ User inactive:", email);
    return res.status(401).json({
      success: false,
      message: "Your account has been deactivated"
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  console.log("✅ Password match:", isPasswordMatch);

  if (!isPasswordMatch) {
    console.log("❌ Password mismatch:", email);
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

await User.updateOne(
  { _id: user._id },
  { $set: { lastLogin: new Date() } }
);

  console.log("✅ Login successful:", email);

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      domain: user.domain,
      role: user.role,
      isVerified: user.isVerified,
    },
    token: generateToken(user._id),
  });
});




// ============ FORGOT PASSWORD ============
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide your email address");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("No user found with this email address");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Create reset URL
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  // Send email
  const emailResult = await sendPasswordResetEmail(email, resetUrl, user.name);

  if (!emailResult.success) {
    // If email fails, clear the token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.status(500);
    throw new Error("Failed to send reset email. Please try again.");
  }

  res.json({
    success: true,
    message: "Password reset link sent to your email",
  });
});

// ============ RESET PASSWORD ============
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("Please provide a new password");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

  // Hash the token to compare with stored hash
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Find user with valid token
  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Update password
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Send confirmation email
  await sendPasswordResetConfirmation(user.email, user.name);

  res.json({
    success: true,
    message: "Password reset successfully",
  });
});

// ============ VALIDATE RESET TOKEN ============
const validateResetToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const resetTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  res.json({
    success: true,
    message: "Valid token",
    email: user.email,
  });
});



// // ============ REGISTER ============
// const register = asyncHandler(async (req, res) => {
//   const { name, email, phone, domain, password } = req.body;

//   console.log("📝 Register:", email);

//   if (!name || !email || !phone || !domain || !password) {
//     res.status(400);
//     throw new Error("Please fill all required fields");
//   }

//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     res.status(400);
//     throw new Error("User already exists with this email");
//   }

//   const phoneExists = await User.findOne({ phone });
//   if (phoneExists) {
//     res.status(400);
//     throw new Error("Phone number already registered");
//   }

//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   const user = await User.create({
//     name,
//     email,
//     phone,
//     domain,
//     password: hashedPassword,
//   });

//   console.log("✅ User created:", user.email);

//   res.status(201).json({
//     success: true,
//     message: "User registered successfully",
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       domain: user.domain,
//       role: user.role,
//     },
//     token: generateToken(user._id),
//   });
// });

// ============ LOGIN ============
// const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   console.log("🔐 Login:", email);

//   if (!email || !password) {
//     res.status(400);
//     throw new Error("Please provide email and password");
//   }

//   const user = await User.findOne({ email });
//   if (!user) {
//     res.status(401);
//     throw new Error("Invalid email or password");
//   }

//   if (!user.isActive) {
//     res.status(401);
//     throw new Error("Your account has been deactivated");
//   }

//   const isPasswordMatch = await bcrypt.compare(password, user.password);
//   console.log("✅ Password match:", isPasswordMatch);

//   if (!isPasswordMatch) {
//     res.status(401);
//     throw new Error("Invalid email or password");
//   }

//   user.lastLogin = new Date();
//   await user.save();

//   res.status(200).json({
//     success: true,
//     message: "Login successful",
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       domain: user.domain,
//       role: user.role,
//     },
//     token: generateToken(user._id),
//   });
// });




// ============ GET PROFILE ============
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -__v");
  
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    user,
  });
});

// ============ UPDATE PROFILE ============
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, email, phone, domain, password, bio, profileImage } = req.body;

  if (name) user.name = name;
  if (email) {
    const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (emailExists) {
      res.status(400);
      throw new Error("Email already in use");
    }
    user.email = email;
  }
  if (phone) {
    const phoneExists = await User.findOne({ phone, _id: { $ne: req.user.id } });
    if (phoneExists) {
      res.status(400);
      throw new Error("Phone number already in use");
    }
    user.phone = phone;
  }
  if (domain) user.domain = domain;
  if (bio) user.bio = bio;
  if (profileImage) user.profileImage = profileImage;
  if (password) {
    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters long");
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      domain: updatedUser.domain,
      role: updatedUser.role,
      bio: updatedUser.bio,
      profileImage: updatedUser.profileImage,
    },
  });
});

// ============ GET ALL USERS (ADMIN) ============
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password -__v").sort({ createdAt: -1 });
  res.json({
    success: true,
    count: users.length,
    users,
  });
});

// ============ GET USER BY ID (ADMIN) ============
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -__v");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    user,
  });
});

// ============ UPDATE USER BY ADMIN ============
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, email, phone, domain, role, isActive, isVerified } = req.body;

  if (name) user.name = name;
  if (email) {
    const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
    if (emailExists) {
      res.status(400);
      throw new Error("Email already in use");
    }
    user.email = email;
  }
  if (phone) {
    const phoneExists = await User.findOne({ phone, _id: { $ne: req.params.id } });
    if (phoneExists) {
      res.status(400);
      throw new Error("Phone number already in use");
    }
    user.phone = phone;
  }
  if (domain) user.domain = domain;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  if (isVerified !== undefined) user.isVerified = isVerified;

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: "User updated successfully",
    user: updatedUser,
  });
});

// ============ DELETE USER (ADMIN) ============
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: "User deleted successfully",
  });
});

// ============ TOGGLE USER STATUS (ADMIN) ============
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    },
  });
});

// ============ GET USER STATS (ADMIN) ============
const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalActive = await User.countDocuments({ isActive: true });
  const totalAdmins = await User.countDocuments({ role: "admin" });
  const totalStudents = await User.countDocuments({ role: "user" });
  const totalVerified = await User.countDocuments({ isVerified: true });

  const domainStats = await User.aggregate([
    { $group: { _id: "$domain", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalActive,
      totalAdmins,
      totalStudents,
      totalVerified,
      domainStats,
    },
  });
});

// ============ EXPORT ALL ============
export {
  register,
  login,
 verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  validateResetToken,
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUser,
  toggleUserStatus,
  getUserStats,
};