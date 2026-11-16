

// src/pages/AddBlog.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import RichTextEditor from "../components/RichTextEditor";
import { 
  ArrowLeft, 
  Save, 
  X, 
  Image, 
  Tag, 
  Clock, 
  User,
  Plus,
  Trash2,
  Upload,
  FileImage,
  Edit,
  Eye,
  EyeOff,
  Search,
  Calendar,
  RefreshCw,
  Filter,
  ChevronDown,
  Star
} from "lucide-react";
import { blogService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AddBlog.css";

const categories = [
  "Artificial Intelligence",
  "Web Development",
  "Mobile Apps",
  "Cloud Computing",
  "Cyber Security",
  "Digital Marketing",
  "Career Tips",
  "Internships",
  "Other",
];

export default function AddBlog() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditing = !!id;

  // ============ STATES ============
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    content: "",
    image: "",
    readTime: "",
    author: "",
    tags: [],
    isPublished: true,
    featured: false,
  });
  const [customCategory, setCustomCategory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // ============ FETCH BLOGS ============
  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      const blogToEdit = blogs.find(b => b._id === id);
      if (blogToEdit) {
        handleEditBlog(blogToEdit);
      }
    }
  }, [isEditing, id, blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAdminBlogs();
      setBlogs(response.blogs || []);
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  // ============ BLOG LIST FUNCTIONS ============
  const handleCreateNew = () => {
    resetForm();
    setEditingBlog(null);
    setShowForm(true);
  };


  

  const handleEditBlog = (blog) => {
    const hasPredefinedCategory =
      categories.includes(blog.category) && blog.category !== "Other";
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      category: hasPredefinedCategory ? blog.category : "Other",
      description: blog.description || "",
      content: blog.content || "",
      image: blog.image || "",
      readTime: blog.readTime || "",
      author: blog.author || user?.name || "",
      tags: blog.tags || [],
      isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
      featured: blog.featured || false,
    });
    setCustomCategory(hasPredefinedCategory ? "" : blog.category || "");
    setImagePreview(blog.image || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelForm = () => {
    resetForm();
    setShowForm(false);
    setEditingBlog(null);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      content: "",
      image: "",
      readTime: "",
      author: "",
      tags: [],
      isPublished: true,
      featured: false,
    });
    setCustomCategory("");
    setTagInput("");
    setImagePreview("");
    setImageFile(null);
  };

  // ============ FORM HANDLERS ============
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ============ IMAGE UPLOAD - BASE64 (No Cloudinary) ============
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({
        ...prev,
        image: reader.result
      }));
      setImageFile(file);
      toast.success('Image added successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageFile(null);
    setFormData(prev => ({
      ...prev,
      image: ""
    }));
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // ============ SUBMIT BLOG ============
  const handleSubmit = async (e) => {
    e.preventDefault();

    const category =
      formData.category === "Other" ? customCategory.trim() : formData.category;

    if (!formData.title || !category || !formData.description || !formData.content) {
      toast.error("Please fill all required fields");
      return;
    }

    setFormLoading(true);
    try {
      const submitData = {
        ...formData,
        imageFile,
        category,
        author: formData.author || user?.name || "VProTech Digital",
        readTime: formData.readTime || "5 min read",
      };

      let response;
      if (editingBlog) {
        response = await blogService.updateBlog(editingBlog._id, submitData);
        toast.success("Blog updated successfully!");
      } else {
        response = await blogService.createBlog(submitData);
        toast.success("Blog created successfully!");
      }

      await fetchBlogs();
      
      setTimeout(() => {
        handleCancelForm();
        navigate("/admin/add-blog");
      }, 1500);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save blog");
    } finally {
      setFormLoading(false);
    }
  };

  // ============ DELETE BLOG ============
  const handleDelete = async () => {
    if (!editingBlog) return;
    
    setDeleteLoading(true);
    try {
      await blogService.deleteBlog(editingBlog._id);
      toast.success("Blog deleted successfully!");
      setShowDeleteModal(false);
      await fetchBlogs();
      handleCancelForm();
      setTimeout(() => {
        navigate("/admin/add-blog");
      }, 1000);
    } catch (error) {
      toast.error("Failed to delete blog");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ============ TOGGLE PUBLISH ============
  const handleTogglePublish = async (blogId, currentStatus) => {
    try {
      await blogService.togglePublish(blogId);
      const newStatus = !currentStatus;
      toast.success(`Blog ${newStatus ? "published" : "unpublished"} successfully!`);
      await fetchBlogs();
    } catch (error) {
      toast.error("Failed to toggle publish status");
    }
  };

  // ============ VIEW BLOG ============
  const handleViewBlog = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  // ============ FILTER FUNCTIONS ============
  const getStatusCount = (status) => {
    if (status === "all") return blogs.length;
    if (status === "published") return blogs.filter(b => b.isPublished).length;
    if (status === "draft") return blogs.filter(b => !b.isPublished).length;
    return 0;
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = 
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "published" && blog.isPublished) ||
      (filterStatus === "draft" && !blog.isPublished);
    
    const matchesCategory = 
      filterCategory === "all" || blog.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  const blogCategories = [
    ...new Set([...categories, ...blogs.map((blog) => blog.category).filter(Boolean)]),
  ];

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="addblog-container">
      <Toaster position="top-right" />

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="delete-modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <motion.div 
              className="delete-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="delete-modal-header">
                <h3>Delete Blog</h3>
                <button className="close-modal-btn" onClick={() => setShowDeleteModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="delete-modal-body">
                <p>Are you sure you want to delete <strong>"{editingBlog?.title}"</strong>?</p>
                <p className="delete-warning">This action cannot be undone.</p>
              </div>
              <div className="delete-modal-footer">
                <button 
                  className="cancel-delete-btn" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-delete-btn" 
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="addblog-header">
        <div className="header-left">
          <h1>Manage Blogs</h1>
          <p className="subtitle">Create, edit, and manage your blog posts</p>
        </div>
        <div className="header-actions">
          {!showForm ? (
            <button className="create-btn" onClick={handleCreateNew}>
              <Plus size={18} />
              Create New Blog
            </button>
          ) : (
            <button className="create-btn cancel-btn" onClick={handleCancelForm}>
              <X size={18} />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Blog List View */}
      {!showForm ? (
        <>
          {/* Stats */}
          <div className="bloglist-stats">
            <div className="stat-item">
              <span className="stat-number">{blogs.length}</span>
              <span className="stat-label">Total Blogs</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{getStatusCount("published")}</span>
              <span className="stat-label">Published</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{getStatusCount("draft")}</span>
              <span className="stat-label">Drafts</span>
            </div>
          </div>

          {/* Filters */}
          <div className="bloglist-filters">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search blogs by title, category, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
              <ChevronDown size={16} className={showFilters ? "rotated" : ""} />
            </button>
            <button className="refresh-btn" onClick={fetchBlogs} title="Refresh">
              <RefreshCw size={18} />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div 
              className="filter-expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="filter-group">
                <label>Status:</label>
                <div className="filter-tabs">
                  <button
                    className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
                    onClick={() => setFilterStatus("all")}
                  >
                    All ({getStatusCount("all")})
                  </button>
                  <button
                    className={`filter-tab ${filterStatus === "published" ? "active" : ""}`}
                    onClick={() => setFilterStatus("published")}
                  >
                    Published ({getStatusCount("published")})
                  </button>
                  <button
                    className={`filter-tab ${filterStatus === "draft" ? "active" : ""}`}
                    onClick={() => setFilterStatus("draft")}
                  >
                    Drafts ({getStatusCount("draft")})
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <label>Category:</label>
                <div className="category-tabs">
                  <button
                    className={`category-tab ${filterCategory === "all" ? "active" : ""}`}
                    onClick={() => setFilterCategory("all")}
                  >
                    All
                  </button>
                  {blogCategories.map((cat) => (
                    <button
                      key={cat}
                      className={`category-tab ${filterCategory === cat ? "active" : ""}`}
                      onClick={() => setFilterCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <div className="results-count">
            Showing {filteredBlogs.length} of {blogs.length} blogs
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading blogs...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="no-blogs">
              <div className="no-blogs-icon">📝</div>
              <h3>No blogs found</h3>
              <p>
                {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first blog post by clicking the 'Create New Blog' button"}
              </p>
              <button className="create-btn" onClick={handleCreateNew}>
                <Plus size={18} />
                Create New Blog
              </button>
            </div>
          ) : (
            <div className="bloglist-grid">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  className="blog-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="blog-card-image">
                    <img
                      src={blog.image || "https://via.placeholder.com/400x200/1e293b/4F46E5?text=VProTech"}
                      alt={blog.title}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x200/1e293b/4F46E5?text=VProTech";
                      }}
                    />
                    {blog.featured && (
                      <span className="featured-badge">
                        <Star size={12} />
                        Featured
                      </span>
                    )}
                    <span className={`blog-status ${blog.isPublished ? "published" : "draft"}`}>
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                    <span className="blog-category">{blog.category}</span>
                  </div>

                  <div className="blog-card-content">
                    <h3>{blog.title}</h3>
                    <p>{blog.description?.substring(0, 100)}...</p>

                    <div className="blog-card-meta">
                      <span>
                        <Calendar size={14} />
                        {formatDate(blog.createdAt)}
                      </span>
                      <span>
                        <Clock size={14} />
                        {blog.readTime || "5 min read"}
                      </span>
                      <span>👁️ {blog.views || 0}</span>
                      <span>❤️ {blog.likes || 0}</span>
                    </div>

                    <div className="blog-card-author">
                      By {blog.author || "VProTech Digital"}
                    </div>
                  </div>

                  <div className="blog-card-actions">
                    <button
                      className="action-btn view"
                      onClick={() => handleViewBlog(blog._id)}
                      title="View"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditBlog(blog)}
                      title="Edit"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      className={`action-btn ${blog.isPublished ? "unpublish" : "publish"}`}
                      onClick={() => handleTogglePublish(blog._id, blog.isPublished)}
                      title={blog.isPublished ? "Unpublish" : "Publish"}
                    >
                      {blog.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                      {blog.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => {
                        setEditingBlog(blog);
                        setShowDeleteModal(true);
                      }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* ============ BLOG FORM ============ */
        <motion.div
          className="addblog-form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-header">
            <h2>{editingBlog ? "Edit Blog" : "Create New Blog"}</h2>
            <span className="form-status">
              {editingBlog ? `Editing: ${editingBlog.title}` : "New Blog"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="addblog-form">
            <div className="form-row">
              <div className="form-group full-width">
                <label>
                  <Tag size={16} />
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter blog title"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formData.category === "Other" && (
                  <>
                    <label htmlFor="customCategory">Custom Category *</label>
                    <input
                      id="customCategory"
                      type="text"
                      name="customCategory"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter a custom category"
                      maxLength={80}
                      required
                    />
                  </>
                )}
              </div>

              <div className="form-group">
                <label>
                  <Clock size={16} />
                  Read Time
                </label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="e.g., 5 min read"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the blog"
                  rows="3"
                  required
                />
              </div>
            </div>

          <div className="form-row">
  <div className="form-group full-width">
    <label>Content *</label>

    <RichTextEditor
      value={formData.content}
      onChange={(content) =>
        setFormData((prev) => ({
          ...prev,
          content,
        }))
      }
      placeholder="Write your blog content here..."
    />
  </div>
</div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Image size={16} />
                  Upload Image
                </label>
                
                {!imagePreview ? (
                  <div className="image-upload-area">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="image-upload-input"
                    />
                    <label htmlFor="image-upload" className="image-upload-label">
                      <Upload size={32} />
                      <span>Click to upload image</span>
                      <span className="upload-hint">PNG, JPG, JPEG (Max 5MB)</span>
                    </label>
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <div className="image-preview-overlay">
                      <button
                        type="button"
                        className="change-image-btn"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <FileImage size={16} />
                        Change
                      </button>
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={handleRemoveImage}
                      >
                        <X size={16} />
                        Remove
                      </button>
                    </div>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="image-upload-input-hidden"
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>
                  <User size={16} />
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tags</label>
                <div className="tags-input-container">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag and press Enter"
                  />
                  <button type="button" onClick={handleAddTag} className="add-tag-btn">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="tags-container">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="tag-item">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="remove-tag-btn"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                    />
                    Publish Immediately
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    <Star size={16} />
                    Feature this blog
                  </label>
                </div>
                {editingBlog && (
                  <button
                    type="button"
                    className="delete-blog-btn-form"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 size={16} />
                    Delete Blog
                  </button>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelForm}
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={formLoading}>
                <Save size={18} />
                {formLoading ? "Saving..." : editingBlog ? "Update Blog" : "Create Blog"}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}