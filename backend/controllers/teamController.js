// // controllers/teamController.js
// import asyncHandler from "express-async-handler";
// import Team from "../models/Team.js";
// import cloudinary from "../config/cloudinary.js";




// // ============ GET ALL TEAM MEMBERS (PUBLIC) ============
// const getTeamMembers = asyncHandler(async (req, res) => {
//   const { department } = req.query;
  
//   // Build filter
//   const filter = { isActive: true };
//   if (department) {
//     filter.department = department;
//   }

//   const members = await Team.find(filter)
//     .sort({ order: 1, createdAt: -1 })
//     .select("-__v");

//   // Group by department
//   const grouped = members.reduce((acc, member) => {
//     const dept = member.department;
//     if (!acc[dept]) {
//       acc[dept] = [];
//     }
//     acc[dept].push(member);
//     return acc;
//   }, {});

//   res.json({
//     success: true,
//     count: members.length,
//     members,
//     grouped,
//   });
// });

// // ============ GET ALL TEAM MEMBERS (ADMIN) ============
// const getAllTeamMembersAdmin = asyncHandler(async (req, res) => {
//   const members = await Team.find({})
//     .sort({ department: 1, order: 1, createdAt: -1 })
//     .select("-__v");

//   // Group by department
//   const grouped = members.reduce((acc, member) => {
//     const dept = member.department;
//     if (!acc[dept]) {
//       acc[dept] = [];
//     }
//     acc[dept].push(member);
//     return acc;
//   }, {});

//   res.json({
//     success: true,
//     count: members.length,
//     members,
//     grouped,
//   });
// });

// // ============ GET SINGLE TEAM MEMBER ============
// const getTeamMemberById = asyncHandler(async (req, res) => {
//   const member = await Team.findById(req.params.id).select("-__v");

//   if (!member) {
//     res.status(404);
//     throw new Error("Team member not found");
//   }

//   res.json({
//     success: true,
//     member,
//   });
// });

// // ============ CREATE TEAM MEMBER ============
// const createTeamMember = asyncHandler(async (req, res) => {
//   const {
//     name,
//     designation,
//     department,
//     email,
//     phone,
//     image,
//     bio,
//     experience,
//     skills,
//     socialLinks,
//     isActive,
//     order,
//     featured,
//     joinedDate,
//   } = req.body;

//   if (!name || !designation || !department || !email) {
//     res.status(400);
//     throw new Error("Please provide all required fields");
//   }

//   // Check if member with same email exists
//   const memberExists = await Team.findOne({ email });
//   if (memberExists) {
//     res.status(400);
//     throw new Error("Team member with this email already exists");
//   }

//   // If image is uploaded via Cloudinary (multer)
//   let imageUrl = image || "";
//   if (req.file) {
//     imageUrl = req.file.path;
//   }

//   const member = await Team.create({
//     name,
//     designation,
//     department,
//     email,
//     phone: phone || "",
//     image: imageUrl,
//     bio: bio || "",
//     experience: experience || "",
//     skills: skills || [],
//     socialLinks: socialLinks || {},
//     isActive: isActive !== undefined ? isActive : true,
//     order: order || 0,
//     featured: featured || false,
//     joinedDate: joinedDate || Date.now(),
//   });

//   res.status(201).json({
//     success: true,
//     message: "Team member created successfully",
//     member,
//   });
// });

// // ============ UPDATE TEAM MEMBER ============
// const updateTeamMember = asyncHandler(async (req, res) => {
//   const member = await Team.findById(req.params.id);

//   if (!member) {
//     res.status(404);
//     throw new Error("Team member not found");
//   }

//   const {
//     name,
//     designation,
//     department,
//     email,
//     phone,
//     image,
//     bio,
//     experience,
//     skills,
//     socialLinks,
//     isActive,
//     order,
//     featured,
//     joinedDate,
//   } = req.body;

//   // Check if email is taken by another member
//   if (email && email !== member.email) {
//     const emailExists = await Team.findOne({ email, _id: { $ne: req.params.id } });
//     if (emailExists) {
//       res.status(400);
//       throw new Error("Email already in use by another team member");
//     }
//   }

//   // If new image uploaded, delete old from Cloudinary
//   if (req.file) {
//     // Delete old image from Cloudinary if it exists
//     if (member.image) {
//       try {
//         const publicId = member.image.split('/').pop().split('.')[0];
//         await cloudinary.uploader.destroy(`vprotech/team/${publicId}`);
//       } catch (error) {
//         console.error('Error deleting old image:', error);
//       }
//     }
//     member.image = req.file.path;
//   } else if (image !== undefined) {
//     member.image = image;
//   }

//   // Update fields
//   if (name) member.name = name;
//   if (designation) member.designation = designation;
//   if (department) member.department = department;
//   if (email) member.email = email;
//   if (phone !== undefined) member.phone = phone;
//   if (bio !== undefined) member.bio = bio;
//   if (experience !== undefined) member.experience = experience;
//   if (skills) member.skills = skills;
//   if (socialLinks) member.socialLinks = socialLinks;
//   if (isActive !== undefined) member.isActive = isActive;
//   if (order !== undefined) member.order = order;
//   if (featured !== undefined) member.featured = featured;
//   if (joinedDate) member.joinedDate = joinedDate;

//   const updatedMember = await member.save();

//   res.json({
//     success: true,
//     message: "Team member updated successfully",
//     member: updatedMember,
//   });
// });

// // ============ DELETE TEAM MEMBER ============
// const deleteTeamMember = asyncHandler(async (req, res) => {
//   const member = await Team.findById(req.params.id);

//   if (!member) {
//     res.status(404);
//     throw new Error("Team member not found");
//   }

//   // Delete image from Cloudinary if exists
//   if (member.image) {
//     try {
//       const publicId = member.image.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(`vprotech/team/${publicId}`);
//     } catch (error) {
//       console.error('Error deleting image from Cloudinary:', error);
//     }
//   }

//   await member.deleteOne();

//   res.json({
//     success: true,
//     message: "Team member deleted successfully",
//   });
// });

// // ============ TOGGLE TEAM MEMBER STATUS ============
// const toggleTeamMemberStatus = asyncHandler(async (req, res) => {
//   const member = await Team.findById(req.params.id);

//   if (!member) {
//     res.status(404);
//     throw new Error("Team member not found");
//   }

//   member.isActive = !member.isActive;
//   await member.save();

//   res.json({
//     success: true,
//     message: `Team member ${member.isActive ? "activated" : "deactivated"} successfully`,
//     member,
//   });
// });

// // ============ GET TEAM STATS ============
// const getTeamStats = asyncHandler(async (req, res) => {
//   const totalMembers = await Team.countDocuments();
//   const activeMembers = await Team.countDocuments({ isActive: true });
//   const inactiveMembers = await Team.countDocuments({ isActive: false });

//   const departmentStats = await Team.aggregate([
//     { $group: { _id: "$department", count: { $sum: 1 } } },
//     { $sort: { count: -1 } },
//   ]);

//   const designationStats = await Team.aggregate([
//     { $group: { _id: "$designation", count: { $sum: 1 } } },
//     { $sort: { count: -1 } },
//   ]);

//   const featuredMembers = await Team.find({ featured: true, isActive: true })
//     .limit(6)
//     .select("name designation department image");

//   res.json({
//     success: true,
//     stats: {
//       totalMembers,
//       activeMembers,
//       inactiveMembers,
//       departmentStats,
//       designationStats,
//       featuredMembers,
//     },
//   });
// });

// // ============ UPLOAD IMAGE ============
// const uploadTeamImage = asyncHandler(async (req, res) => {
//   if (!req.file) {
//     res.status(400);
//     throw new Error("No image uploaded");
//   }

//   res.json({
//     success: true,
//     message: "Image uploaded successfully",
//     url: req.file.path,
//     publicId: req.file.filename,
//   });
// });

// // ============ DELETE IMAGE ============
// const deleteTeamImage = asyncHandler(async (req, res) => {
//   const { publicId } = req.body;

//   if (!publicId) {
//     res.status(400);
//     throw new Error("Public ID is required");
//   }

//   try {
//     await cloudinary.uploader.destroy(`vprotech/team/${publicId}`);
//     res.json({
//       success: true,
//       message: "Image deleted successfully",
//     });
//   } catch (error) {
//     res.status(500);
//     throw new Error("Failed to delete image");
//   }
// });

// export {
//   getTeamMembers,
//   getAllTeamMembersAdmin,
//   getTeamMemberById,
//   createTeamMember,
//   updateTeamMember,
//   deleteTeamMember,
//   toggleTeamMemberStatus,
//   getTeamStats,
//   uploadTeamImage,
//   deleteTeamImage,
// };



// controllers/teamController.js
// import asyncHandler from "express-async-handler";
// import Team from "../models/Team.js";
// import cloudinary from "../config/cloudinary.js";



// // Add this helper function at the top of your controller
// const parseSocialLinks = (socialLinks) => {
//   // If it's a string, parse it
//   if (typeof socialLinks === 'string') {
//     try {
//       socialLinks = JSON.parse(socialLinks);
//     } catch (e) {
//       socialLinks = {};
//     }
//   }
  
//   // Ensure it's an object
//   if (!socialLinks || typeof socialLinks !== 'object') {
//     socialLinks = {};
//   }
  
//   // Return with all fields
//   return {
//     linkedin: socialLinks.linkedin || '',
//     github: socialLinks.github || '',
//     twitter: socialLinks.twitter || '',
//     portfolio: socialLinks.portfolio || '',
//   };
// };



// // ============ GET ALL TEAM MEMBERS (PUBLIC) ============
// const getTeamMembers = asyncHandler(async (req, res) => {
//   try {
//     const { department } = req.query;
    
//     const filter = { isActive: true };
//     if (department) {
//       filter.department = department;
//     }

//     const members = await Team.find(filter)
//       .sort({ order: 1, createdAt: -1 })
//       .select("-__v");

//     const grouped = members.reduce((acc, member) => {
//       const dept = member.department;
//       if (!acc[dept]) {
//         acc[dept] = [];
//       }
//       acc[dept].push(member);
//       return acc;
//     }, {});

//     res.json({
//       success: true,
//       count: members.length,
//       members,
//       grouped,
//     });
//   } catch (error) {
//     console.error('❌ Error in getTeamMembers:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch team members"
//     });
//   }
// });

// // ============ GET ALL TEAM MEMBERS (ADMIN) ============
// const getAllTeamMembersAdmin = asyncHandler(async (req, res) => {
//   try {
//     const members = await Team.find({})
//       .sort({ department: 1, order: 1, createdAt: -1 })
//       .select("-__v");

//     const grouped = members.reduce((acc, member) => {
//       const dept = member.department;
//       if (!acc[dept]) {
//         acc[dept] = [];
//       }
//       acc[dept].push(member);
//       return acc;
//     }, {});

//     res.json({
//       success: true,
//       count: members.length,
//       members,
//       grouped,
//     });
//   } catch (error) {
//     console.error('❌ Error in getAllTeamMembersAdmin:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch team members"
//     });
//   }
// });

// // ============ GET SINGLE TEAM MEMBER ============
// const getTeamMemberById = asyncHandler(async (req, res) => {
//   try {
//     const member = await Team.findById(req.params.id).select("-__v");

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Team member not found"
//       });
//     }

//     res.json({
//       success: true,
//       member,
//     });
//   } catch (error) {
//     console.error('❌ Error in getTeamMemberById:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch team member"
//     });
//   }
// });



// // ============ CREATE TEAM MEMBER ============
// const createTeamMember = asyncHandler(async (req, res) => {
//   console.log('📥 CREATE - Request body:', req.body);
//   console.log('📥 CREATE - Request file:', req.file);
  
//   try {
//     // Parse skills
//     let skills = safeParseJSON(req.body.skills, []);
//     if (!Array.isArray(skills)) {
//       skills = [];
//     }

//     // Parse socialLinks
//     let socialLinks = safeParseJSON(req.body.socialLinks, {});
//     if (typeof socialLinks !== 'object' || socialLinks === null) {
//       socialLinks = {};
//     }
//     socialLinks = {
//       linkedin: socialLinks.linkedin || '',
//       github: socialLinks.github || '',
//       twitter: socialLinks.twitter || '',
//       portfolio: socialLinks.portfolio || '',
//     };

//     console.log('✅ Parsed skills:', skills);
//     console.log('✅ Parsed socialLinks:', socialLinks);

//     const {
//       name,
//       designation,
//       department,
//       email,
//       phone,
//       image,
//       bio,
//       experience,
//       isActive,
//       order,
//       featured,
//       joinedDate,
//     } = req.body;

//     const isActiveBool = isActive === 'true' || isActive === true || isActive === '1';
//     const featuredBool = featured === 'true' || featured === true || featured === '1';

//     if (!name || !designation || !department || !email) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields: name, designation, department, email"
//       });
//     }

//     const memberExists = await Team.findOne({ email });
//     if (memberExists) {
//       return res.status(400).json({
//         success: false,
//         message: "Team member with this email already exists"
//       });
//     }

//     let imageUrl = image || "";
//     if (req.file) {
//       imageUrl = req.file.path;
//     }

//     const member = await Team.create({
//       name,
//       designation,
//       department,
//       email,
//       phone: phone || "",
//       image: imageUrl,
//       bio: bio || "",
//       experience: experience || "",
//       skills: skills,
//       socialLinks: socialLinks,
//       isActive: isActiveBool,
//       order: order || 0,
//       featured: featuredBool,
//       joinedDate: joinedDate || Date.now(),
//     });

//     console.log('✅ Member created successfully:', member._id);

//     res.status(201).json({
//       success: true,
//       message: "Team member created successfully",
//       member,
//     });
//   } catch (error) {
//     console.error('❌ Error creating team member:', error);
//     console.error('❌ Error stack:', error.stack);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: errors.join(', ')
//       });
//     }
    
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create team member",
//     });
//   }
// });


// // ============ UPDATE TEAM MEMBER - COMPLETELY FIXED ============
// const updateTeamMember = asyncHandler(async (req, res) => {
//   console.log('=== UPDATE TEAM MEMBER ===');
//   console.log('📥 UPDATE - ID:', req.params.id);
//   console.log('📥 UPDATE - Request body:', req.body);
//   console.log('📥 UPDATE - Request file:', req.file);
  
//   try {
//     // Find the member
//     const member = await Team.findById(req.params.id);
//     if (!member) {
//       console.log('❌ Member not found');
//       return res.status(404).json({
//         success: false,
//         message: "Team member not found"
//       });
//     }

//     console.log('✅ Found member:', member.name);

//     // Get the raw values from request
//     const {
//       name,
//       designation,
//       department,
//       email,
//       phone,
//       image,
//       bio,
//       experience,
//       isActive,
//       order,
//       featured,
//       joinedDate,
//     } = req.body;

//     // Parse skills and socialLinks BEFORE any assignment
//     const skills = parseSkills(req.body.skills);
//     const socialLinks = parseSocialLinks(req.body.socialLinks);

//     console.log('✅ Parsed skills:', skills);
//     console.log('✅ Parsed socialLinks:', socialLinks);

//     // Update fields
//     if (name) member.name = name;
//     if (designation) member.designation = designation;
//     if (department) member.department = department;
//     if (email) member.email = email;
//     if (phone !== undefined) member.phone = phone;
//     if (bio !== undefined) member.bio = bio;
//     if (experience !== undefined) member.experience = experience;
    
//     // ✅ Directly assign parsed values (NOT using spread or merge)
//     member.skills = skills;
//     member.socialLinks = socialLinks;
    
//     console.log('✅ After assignment - socialLinks:', member.socialLinks);
//     console.log('✅ After assignment - socialLinks type:', typeof member.socialLinks);
    
//     // Convert booleans
//     if (isActive !== undefined) {
//       member.isActive = isActive === 'true' || isActive === true || isActive === 1;
//     }
//     if (featured !== undefined) {
//       member.featured = featured === 'true' || featured === true || featured === 1;
//     }
//     if (order !== undefined) {
//       member.order = parseInt(order) || 0;
//     }
//     if (joinedDate) {
//       member.joinedDate = joinedDate;
//     }

//     // Handle image
//     if (req.file) {
//       member.image = req.file.path;
//       console.log('📸 Image updated:', req.file.path);
//     } else if (image !== undefined) {
//       member.image = image;
//     }

//     // Log final state before save
//     console.log('📝 Final member.socialLinks before save:', member.socialLinks);
//     console.log('📝 Final member.socialLinks type:', typeof member.socialLinks);

//     // Save the updated member
//     const updatedMember = await member.save();
//     console.log('✅ Member updated successfully:', updatedMember._id);

//     res.json({
//       success: true,
//       message: "Team member updated successfully",
//       member: updatedMember,
//     });
//   } catch (error) {
//     console.error('❌ Error updating team member:', error);
//     console.error('❌ Error stack:', error.stack);
//     console.error('❌ Error name:', error.name);
//     console.error('❌ Error message:', error.message);
    
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update team member",
//     });
//   }
// });


// // ============ DELETE TEAM MEMBER ============
// const deleteTeamMember = asyncHandler(async (req, res) => {
//   try {
//     const member = await Team.findById(req.params.id);

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Team member not found"
//       });
//     }

//     // Delete image from Cloudinary if exists
//     if (member.image) {
//       try {
//         const publicId = member.image.split('/').pop().split('.')[0];
//         await cloudinary.uploader.destroy(`vprotech/team/${publicId}`);
//         console.log('🗑️ Image deleted from Cloudinary');
//       } catch (error) {
//         console.error('Error deleting image from Cloudinary:', error);
//       }
//     }

//     await member.deleteOne();
//     console.log('✅ Member deleted successfully:', req.params.id);

//     res.json({
//       success: true,
//       message: "Team member deleted successfully",
//     });
//   } catch (error) {
//     console.error('❌ Error deleting team member:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to delete team member"
//     });
//   }
// });

// // ============ TOGGLE TEAM MEMBER STATUS ============
// const toggleTeamMemberStatus = asyncHandler(async (req, res) => {
//   try {
//     const member = await Team.findById(req.params.id);

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Team member not found"
//       });
//     }

//     member.isActive = !member.isActive;
//     await member.save();

//     console.log(`✅ Member ${member.isActive ? 'activated' : 'deactivated'}:`, req.params.id);

//     res.json({
//       success: true,
//       message: `Team member ${member.isActive ? "activated" : "deactivated"} successfully`,
//       member,
//     });
//   } catch (error) {
//     console.error('❌ Error toggling team member status:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to toggle team member status"
//     });
//   }
// });

// // ============ GET TEAM STATS ============
// const getTeamStats = asyncHandler(async (req, res) => {
//   try {
//     const totalMembers = await Team.countDocuments();
//     const activeMembers = await Team.countDocuments({ isActive: true });
//     const inactiveMembers = await Team.countDocuments({ isActive: false });

//     const departmentStats = await Team.aggregate([
//       { $group: { _id: "$department", count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//     ]);

//     const designationStats = await Team.aggregate([
//       { $group: { _id: "$designation", count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//     ]);

//     const featuredMembers = await Team.find({ featured: true, isActive: true })
//       .limit(6)
//       .select("name designation department image");

//     res.json({
//       success: true,
//       stats: {
//         totalMembers,
//         activeMembers,
//         inactiveMembers,
//         departmentStats,
//         designationStats,
//         featuredMembers,
//       },
//     });
//   } catch (error) {
//     console.error('❌ Error getting team stats:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to get team stats"
//     });
//   }
// });

// // ============ UPLOAD IMAGE ============
// const uploadTeamImage = asyncHandler(async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No image uploaded"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Image uploaded successfully",
//       url: req.file.path,
//       publicId: req.file.filename,
//     });
//   } catch (error) {
//     console.error('❌ Error uploading image:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to upload image"
//     });
//   }
// });

// // ============ DELETE IMAGE ============
// const deleteTeamImage = asyncHandler(async (req, res) => {
//   try {
//     const { publicId } = req.body;

//     if (!publicId) {
//       return res.status(400).json({
//         success: false,
//         message: "Public ID is required"
//       });
//     }

//     await cloudinary.uploader.destroy(`vprotech/team/${publicId}`);
//     console.log('🗑️ Image deleted from Cloudinary:', publicId);

//     res.json({
//       success: true,
//       message: "Image deleted successfully",
//     });
//   } catch (error) {
//     console.error('❌ Error deleting image:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to delete image"
//     });
//   }
// });

// export {
//   getTeamMembers,
//   getAllTeamMembersAdmin,
//   getTeamMemberById,
//   createTeamMember,
//   updateTeamMember,
//   deleteTeamMember,
//   toggleTeamMemberStatus,
//   getTeamStats,
//   uploadTeamImage,
//   deleteTeamImage,
// };




// controllers/teamController.js
import asyncHandler from "express-async-handler";
import Team from "../models/Team.js";

const parseJsonField = (value, fallback) => {
  if (typeof value !== "string") return value ?? fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// ============ GET ALL TEAM MEMBERS (PUBLIC) ============
const getTeamMembers = asyncHandler(async (req, res) => {
  try {
    const { department } = req.query;
    
    const filter = { isActive: true };
    if (department) {
      filter.department = department;
    }

    const members = await Team.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .select("-__v");

    const grouped = members.reduce((acc, member) => {
      const dept = member.department;
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(member);
      return acc;
    }, {});

    res.json({
      success: true,
      count: members.length,
      members,
      grouped,
    });
  } catch (error) {
    console.error('❌ Error in getTeamMembers:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch team members"
    });
  }
});

// ============ GET ALL TEAM MEMBERS (ADMIN) ============
const getAllTeamMembersAdmin = asyncHandler(async (req, res) => {
  try {
    const members = await Team.find({})
      .sort({ department: 1, order: 1, createdAt: -1 })
      .select("-__v");

    const grouped = members.reduce((acc, member) => {
      const dept = member.department;
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(member);
      return acc;
    }, {});

    res.json({
      success: true,
      count: members.length,
      members,
      grouped,
    });
  } catch (error) {
    console.error('❌ Error in getAllTeamMembersAdmin:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch team members"
    });
  }
});

// ============ GET SINGLE TEAM MEMBER ============
const getTeamMemberById = asyncHandler(async (req, res) => {
  try {
    const member = await Team.findById(req.params.id).select("-__v");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found"
      });
    }

    res.json({
      success: true,
      member,
    });
  } catch (error) {
    console.error('❌ Error in getTeamMemberById:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch team member"
    });
  }
});

// ============ CREATE TEAM MEMBER ============
const createTeamMember = asyncHandler(async (req, res) => {
  console.log('📥 CREATE - Request body:', req.body);
  console.log('📥 CREATE - Request file:', req.file);
  
  try {
    const {
      name,
      designation,
      department,
      email,
      phone,
      image,
      bio,
      experience,
      skills,
      socialLinks,
      isActive,
      order,
      featured,
      joinedDate,
    } = req.body;

    const isActiveBool = isActive === 'true' || isActive === true || isActive === '1';
    const featuredBool = featured === 'true' || featured === true || featured === '1';
    const parsedSkills = parseJsonField(skills, []);
    const parsedSocialLinks = parseJsonField(socialLinks, {});

    if (!name || !designation || !department || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, designation, department, email"
      });
    }

    const memberExists = await Team.findOne({ email });
    if (memberExists) {
      return res.status(400).json({
        success: false,
        message: "Team member with this email already exists"
      });
    }

    let imageUrl = image || "";
    if (req.file) {
      imageUrl = req.file.path;
    }

    const member = await Team.create({
      name,
      designation,
      department,
      email,
      phone: phone || "",
      image: imageUrl,
      bio: bio || "",
      experience: experience || "",
      skills: Array.isArray(parsedSkills) ? parsedSkills : [],
      socialLinks:
        parsedSocialLinks && typeof parsedSocialLinks === "object"
          ? parsedSocialLinks
          : {},
      isActive: isActiveBool,
      order: order || 0,
      featured: featuredBool,
      joinedDate: joinedDate || Date.now(),
    });

    console.log('✅ Member created successfully:', member._id);

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      member,
    });
  } catch (error) {
    console.error('❌ Error creating team member:', error);
    console.error('❌ Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create team member",
    });
  }
});

// controllers/teamController.js - Update updateTeamMember

const updateTeamMember = asyncHandler(async (req, res) => {
  console.log('=== UPDATE TEAM MEMBER ===');
  console.log('📥 UPDATE - ID:', req.params.id);
  console.log('📥 UPDATE - Request body:', req.body);
  
  try {
    const {
      name,
      designation,
      department,
      email,
      phone,
      image,
      bio,
      experience,
      skills,
      socialLinks,
      isActive,
      order,
      featured,
      joinedDate,
    } = req.body;

    // ✅ FIX: Clean skills array
    let cleanSkills = skills;
    if (Array.isArray(skills)) {
      cleanSkills = skills
        .filter(skill => skill && typeof skill === 'string' && skill.trim() !== '')
        .map(skill => skill.trim());
    } else if (typeof skills === 'string') {
      try {
        const parsed = JSON.parse(skills);
        if (Array.isArray(parsed)) {
          cleanSkills = parsed
            .filter(skill => skill && typeof skill === 'string' && skill.trim() !== '')
            .map(skill => skill.trim());
        } else {
          cleanSkills = [];
        }
      } catch (e) {
        cleanSkills = [];
      }
    } else {
      cleanSkills = [];
    }

    // ✅ FIX: Ensure socialLinks is an object
    let cleanSocialLinks = socialLinks;
    if (typeof socialLinks === 'string') {
      try {
        cleanSocialLinks = JSON.parse(socialLinks);
      } catch (e) {
        cleanSocialLinks = {};
      }
    }
    if (!cleanSocialLinks || typeof cleanSocialLinks !== 'object') {
      cleanSocialLinks = {};
    }
    cleanSocialLinks = {
      linkedin: cleanSocialLinks.linkedin || '',
      github: cleanSocialLinks.github || '',
      twitter: cleanSocialLinks.twitter || '',
      portfolio: cleanSocialLinks.portfolio || '',
    };

    // Build update object
    const updateData = {};
    
    if (name) updateData.name = name;
    if (designation) updateData.designation = designation;
    if (department) updateData.department = department;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (experience !== undefined) updateData.experience = experience;
    
    // ✅ Use cleaned skills
    updateData.skills = cleanSkills;
    updateData.socialLinks = cleanSocialLinks;
    
    if (isActive !== undefined) updateData.isActive = isActive;
    if (featured !== undefined) updateData.featured = featured;
    if (order !== undefined) updateData.order = parseInt(order) || 0;
    if (joinedDate) updateData.joinedDate = joinedDate;

    // Handle image
    if (req.file) {
      updateData.image = req.file.path;
    } else if (image !== undefined) {
      updateData.image = image;
    }

    console.log('📝 Clean skills:', cleanSkills);
    console.log('📝 Clean socialLinks:', cleanSocialLinks);
    console.log('📝 Update data:', updateData);

    const updatedMember = await Team.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found"
      });
    }

    console.log('✅ Member updated successfully:', updatedMember._id);

    res.json({
      success: true,
      message: "Team member updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    console.error('❌ Error updating team member:', error);
    console.error('❌ Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update team member",
    });
  }
});

// ============ DELETE TEAM MEMBER ============
const deleteTeamMember = asyncHandler(async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found"
      });
    }

    await member.deleteOne();
    console.log('✅ Member deleted successfully:', req.params.id);

    res.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error('❌ Error deleting team member:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete team member"
    });
  }
});

// ============ TOGGLE TEAM MEMBER STATUS ============
const toggleTeamMemberStatus = asyncHandler(async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found"
      });
    }

    member.isActive = !member.isActive;
    await member.save();

    res.json({
      success: true,
      message: `Team member ${member.isActive ? "activated" : "deactivated"} successfully`,
      member,
    });
  } catch (error) {
    console.error('❌ Error toggling team member status:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle team member status"
    });
  }
});

// ============ GET TEAM STATS ============
const getTeamStats = asyncHandler(async (req, res) => {
  try {
    const totalMembers = await Team.countDocuments();
    const activeMembers = await Team.countDocuments({ isActive: true });
    const inactiveMembers = await Team.countDocuments({ isActive: false });

    const departmentStats = await Team.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const designationStats = await Team.aggregate([
      { $group: { _id: "$designation", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const featuredMembers = await Team.find({ featured: true, isActive: true })
      .limit(6)
      .select("name designation department image");

    res.json({
      success: true,
      stats: {
        totalMembers,
        activeMembers,
        inactiveMembers,
        departmentStats,
        designationStats,
        featuredMembers,
      },
    });
  } catch (error) {
    console.error('❌ Error getting team stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get team stats"
    });
  }
});

// ============ UPLOAD IMAGE ============
const uploadTeamImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded"
      });
    }

    res.json({
      success: true,
      message: "Image uploaded successfully",
      url: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image"
    });
  }
});

// ============ DELETE IMAGE ============
const deleteTeamImage = asyncHandler(async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required"
      });
    }

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete image"
    });
  }
});

export {
  getTeamMembers,
  getAllTeamMembersAdmin,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
  getTeamStats,
  uploadTeamImage,
  deleteTeamImage,
};