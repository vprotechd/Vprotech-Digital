// // controllers/blogController.js
// import asyncHandler from "express-async-handler";
// import Blog from "../models/Blog.js";
// import cloudinary from "../config/cloudinary.js";

// // ============ GET ALL PUBLISHED BLOGS ============
// const getBlogs = asyncHandler(async (req, res) => {
//   const blogs = await Blog.find({ isPublished: true })
//     .sort({ createdAt: -1 })
//     .select("-__v");

//   res.json({
//     success: true,
//     count: blogs.length,
//     blogs,
//   });
// });

// // ============ GET ALL BLOGS (ADMIN) ============
// const getAllBlogsAdmin = asyncHandler(async (req, res) => {
//   const blogs = await Blog.find({})
//     .sort({ createdAt: -1 })
//     .populate("authorId", "name email")
//     .select("-__v");

//   res.json({
//     success: true,
//     count: blogs.length,
//     blogs,
//   });
// });

// // ============ GET BLOG BY ID ============
// const getBlogById = asyncHandler(async (req, res) => {
//   const blog = await Blog.findById(req.params.id).select("-__v");

//   if (!blog) {
//     res.status(404);
//     throw new Error("Blog not found");
//   }

//   // Increment views
//   blog.views += 1;
//   await blog.save();

//   res.json({
//     success: true,
//     blog,
//   });
// });

// // ============ CREATE BLOG ============
// const createBlog = asyncHandler(async (req, res) => {
//   const { title, category, description, content, image, readTime, author, tags } = req.body;

//   if (!title || !category || !description || !content) {
//     res.status(400);
//     throw new Error("Please provide all required fields");
//   }

//   const blog = await Blog.create({
//     title,
//     category,
//     description,
//     content,
//     image: image || "",
//     readTime: readTime || "5 min read",
//     author: author || "VProTech Digital",
//     authorId: req.user.id,
//     tags: tags || [],
//   });

//   res.status(201).json({
//     success: true,
//     message: "Blog created successfully",
//     blog,
//   });
// });

// // ============ UPDATE BLOG ============
// const updateBlog = asyncHandler(async (req, res) => {
//   const blog = await Blog.findById(req.params.id);

//   if (!blog) {
//     res.status(404);
//     throw new Error("Blog not found");
//   }

//   const { title, category, description, content, image, readTime, author, tags, isPublished } = req.body;

//   if (title) blog.title = title;
//   if (category) blog.category = category;
//   if (description) blog.description = description;
//   if (content) blog.content = content;
//   if (image !== undefined) blog.image = image;
//   if (readTime) blog.readTime = readTime;
//   if (author) blog.author = author;
//   if (tags) blog.tags = tags;
//   if (isPublished !== undefined) blog.isPublished = isPublished;

//   const updatedBlog = await blog.save();

//   res.json({
//     success: true,
//     message: "Blog updated successfully",
//     blog: updatedBlog,
//   });
// });

// // ============ DELETE BLOG ============
// const deleteBlog = asyncHandler(async (req, res) => {
//   const blog = await Blog.findById(req.params.id);

//   if (!blog) {
//     res.status(404);
//     throw new Error("Blog not found");
//   }

//   await blog.deleteOne();

//   res.json({
//     success: true,
//     message: "Blog deleted successfully",
//   });
// });

// // ============ TOGGLE PUBLISH STATUS ============
// const togglePublish = asyncHandler(async (req, res) => {
//   const blog = await Blog.findById(req.params.id);

//   if (!blog) {
//     res.status(404);
//     throw new Error("Blog not found");
//   }

//   blog.isPublished = !blog.isPublished;
//   await blog.save();

//   res.json({
//     success: true,
//     message: `Blog ${blog.isPublished ? "published" : "unpublished"} successfully`,
//     blog,
//   });
// });

// // ============ LIKE BLOG ============
// const likeBlog = asyncHandler(async (req, res) => {
//   const blog = await Blog.findById(req.params.id);

//   if (!blog) {
//     res.status(404);
//     throw new Error("Blog not found");
//   }

//   blog.likes += 1;
//   await blog.save();

//   res.json({
//     success: true,
//     message: "Blog liked successfully",
//     likes: blog.likes,
//   });
// });

// // ============ GET BLOG STATS ============
// const getBlogStats = asyncHandler(async (req, res) => {
//   const totalBlogs = await Blog.countDocuments();
//   const totalPublished = await Blog.countDocuments({ isPublished: true });
//   const totalViews = await Blog.aggregate([
//     { $group: { _id: null, total: { $sum: "$views" } } },
//   ]);
  
//   const categoryStats = await Blog.aggregate([
//     { $group: { _id: "$category", count: { $sum: 1 } } },
//     { $sort: { count: -1 } },
//   ]);

//   const mostViewed = await Blog.find({})
//     .sort({ views: -1 })
//     .limit(5)
//     .select("title views");

//   res.json({
//     success: true,
//     stats: {
//       totalBlogs,
//       totalPublished,
//       totalViews: totalViews[0]?.total || 0,
//       categoryStats,
//       mostViewed,
//     },
//   });
// });

// export {
//   getBlogs,
//   getAllBlogsAdmin,
//   getBlogById,
//   createBlog,
//   updateBlog,
//   deleteBlog,
//   togglePublish,
//   likeBlog,
//   getBlogStats,
// };






// controllers/blogController.js
import asyncHandler from "express-async-handler";
import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";

const parseTags = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags !== "string" || !tags.trim()) return [];

  try {
    const parsedTags = JSON.parse(tags);
    return Array.isArray(parsedTags) ? parsedTags : [tags];
  } catch {
    return [tags];
  }
};

// ============ GET ALL PUBLISHED BLOGS ============
const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .select("-__v");

  res.json({
    success: true,
    count: blogs.length,
    blogs,
  });
});

// ============ GET ALL BLOGS (ADMIN) ============
const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({})
    .sort({ createdAt: -1 })
    .populate("authorId", "name email")
    .select("-__v");

  res.json({
    success: true,
    count: blogs.length,
    blogs,
  });
});

// ============ GET BLOG BY ID ============
const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).select("-__v");

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Increment views
  blog.views += 1;
  await blog.save();

  res.json({
    success: true,
    blog,
  });
});

// ============ CREATE BLOG WITH CLOUDINARY IMAGE ============
const createBlog = asyncHandler(async (req, res) => {
  const { title, category, description, content, readTime, author, tags } = req.body;

  if (!title || !category || !description || !content) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  let imageUrl = "";

  // If image is uploaded via Cloudinary (multer)
  if (req.file) {
    imageUrl = req.file.path; // Cloudinary URL
  } else if (req.body.image) {
    // If image is sent as base64 or URL (fallback)
    imageUrl = req.body.image;
  }

  const blog = await Blog.create({
    title,
    category,
    description,
    content,
    image: imageUrl,
    readTime: readTime || "5 min read",
    author: author || "VProTech Digital",
    authorId: req.user.id,
    tags: parseTags(tags),
  });

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    blog,
  });
});

// ============ UPDATE BLOG WITH CLOUDINARY IMAGE ============
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const { title, category, description, content, readTime, author, tags, isPublished } = req.body;

  // If new image uploaded, delete old from Cloudinary
  if (req.file) {
    // Delete old image from Cloudinary if it exists
    if (blog.image) {
      try {
        // Extract public ID from Cloudinary URL
        const urlParts = blog.image.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `vprotech/blogs/${filename.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
        console.log('✅ Old image deleted from Cloudinary');
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }
    blog.image = req.file.path; // New Cloudinary URL
  } else if (req.body.image !== undefined) {
    blog.image = req.body.image;
  }

  if (title) blog.title = title;
  if (category) blog.category = category;
  if (description) blog.description = description;
  if (content) blog.content = content;
  if (readTime) blog.readTime = readTime;
  if (author) blog.author = author;
  if (tags !== undefined) blog.tags = parseTags(tags);
  if (isPublished !== undefined) blog.isPublished = isPublished;

  const updatedBlog = await blog.save();

  res.json({
    success: true,
    message: "Blog updated successfully",
    blog: updatedBlog,
  });
});

// ============ DELETE BLOG (Remove from Cloudinary) ============
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Delete image from Cloudinary if it exists
  if (blog.image) {
    try {
      // Extract public ID from Cloudinary URL
      const urlParts = blog.image.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = `vprotech/blogs/${filename.split('.')[0]}`;
      await cloudinary.uploader.destroy(publicId);
      console.log('✅ Image deleted from Cloudinary');
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  }

  await blog.deleteOne();

  res.json({
    success: true,
    message: "Blog deleted successfully",
  });
});

// ============ TOGGLE PUBLISH STATUS ============
const togglePublish = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  blog.isPublished = !blog.isPublished;
  await blog.save();

  res.json({
    success: true,
    message: `Blog ${blog.isPublished ? "published" : "unpublished"} successfully`,
    blog,
  });
});

// ============ LIKE BLOG ============
const likeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  blog.likes += 1;
  await blog.save();

  res.json({
    success: true,
    message: "Blog liked successfully",
    likes: blog.likes,
  });
});

// ============ GET BLOG STATS ============
const getBlogStats = asyncHandler(async (req, res) => {
  const totalBlogs = await Blog.countDocuments();
  const totalPublished = await Blog.countDocuments({ isPublished: true });
  const totalViews = await Blog.aggregate([
    { $group: { _id: null, total: { $sum: "$views" } } },
  ]);
  
  const categoryStats = await Blog.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const mostViewed = await Blog.find({})
    .sort({ views: -1 })
    .limit(5)
    .select("title views");

  res.json({
    success: true,
    stats: {
      totalBlogs,
      totalPublished,
      totalViews: totalViews[0]?.total || 0,
      categoryStats,
      mostViewed,
    },
  });
});

// ============ UPLOAD IMAGE ONLY ============
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image uploaded");
  }

  res.json({
    success: true,
    message: "Image uploaded successfully",
    url: req.file.path,
    publicId: req.file.filename,
  });
});

// ============ DELETE IMAGE ONLY ============
const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    res.status(400);
    throw new Error("Public ID is required");
  }

  try {
    const fullPublicId = `vprotech/blogs/${publicId}`;
    await cloudinary.uploader.destroy(fullPublicId);
    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to delete image");
  }
});

export {
  getBlogs,
  getAllBlogsAdmin,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish,
  likeBlog,
  getBlogStats,
  uploadImage,
  deleteImage,
};