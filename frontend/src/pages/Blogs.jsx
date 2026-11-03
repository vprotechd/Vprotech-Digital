// src/pages/Blogs.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import blogsBg from "../assets/blogs.jpg";

import {
  Calendar,
  Clock,
  User,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { blogService } from "../services/api";
import "./Blogs.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Artificial Intelligence",
    "Web Development",
    "Mobile Apps",
    "Cloud Computing",
    "Cyber Security",
    "Digital Marketing",
    "Career Tips",
    "Internships",
  ];

  /* =========================================================
     FETCH BLOGS
     ========================================================= */

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogs();
      setBlogs(response.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FILTER BLOGS
     ========================================================= */

  const filteredBlogs = blogs.filter((blog) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      blog.title?.toLowerCase().includes(search) ||
      blog.description?.toLowerCase().includes(search) ||
      blog.category?.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  /* =========================================================
     FORMAT DATE
     ========================================================= */

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /* =========================================================
     FEATURED BLOG
     ========================================================= */

  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const remainingBlogs = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <div className="blogs-loading">
        <div className="spinner"></div>
        <p>Loading blogs...</p>
      </div>
    );
  }

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <div className="blogs-container">
      <Toaster position="top-right" />

      {/* =====================================================
          HERO SECTION
          ===================================================== */}

      <section
        className="blog-dream-section"
        style={{ backgroundImage: `url(${blogsBg})` }}
      >
        {/* Soft background orbs */}
        <div className="dream-bg">
          <motion.div
            className="dream-orb orb-1"
            animate={{
              x: ["0%", "10%", "-5%", "0%"],
              y: ["0%", "-10%", "5%", "0%"],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="dream-orb orb-2"
            animate={{
              x: ["0%", "-8%", "12%", "0%"],
              y: ["0%", "15%", "-5%", "0%"],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          <motion.div
            className="dream-orb orb-3"
            animate={{
              x: ["0%", "15%", "-10%", "0%"],
              y: ["0%", "-5%", "15%", "0%"],
              scale: [1, 0.8, 1.2, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />

          <motion.div
            className="dream-orb orb-4"
            animate={{
              x: ["0%", "-12%", "8%", "0%"],
              y: ["0%", "10%", "-10%", "0%"],
              scale: [1, 1.15, 0.85, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Hero content */}
        <div className="dream-content">
          <motion.div
            className="dream-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
          

            <h1 className="dream-heading">
              Our <span className="dream-highlight">Blogs</span>
            </h1>

            <div className="dream-divider" />

            <p className="dream-description">
              Explore expert insights, latest technology trends, and in-depth
              articles curated by our team of industry professionals.
            </p>

            <p className="dream-description-2">
              From AI and Web Development to Digital Marketing and Career
              Growth — content that inspires, educates, and transforms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          CATEGORY FILTER
          ===================================================== */}

      <section className="blogs-filters">
        <div className="container">
          <div className="filter-row">
            <div className="category-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${
                    selectedCategory === cat ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BLOGS GRID
          ===================================================== */}

      <section className="blogs-grid-section">
        <div className="container">
          {filteredBlogs.length === 0 ? (
            <div className="no-blogs">
              <div className="no-blogs-icon">📝</div>

              <h3>No blogs found</h3>

              <p>
                {searchTerm || selectedCategory !== "All"
                  ? "Try adjusting your search or filter"
                  : "Check back later for new articles"}
              </p>
            </div>
          ) : (
            <>
              {/* FEATURED BLOG */}

              {featuredBlog && (
                <motion.div
                  className="featured-blog"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="featured-blog-image">
                    <img
                      src={
                        featuredBlog.image ||
                        "https://via.placeholder.com/800x400/1e293b/4F46E5?text=VProTech"
                      }
                      alt={featuredBlog.title}
                    />

                    <span className="featured-badge">Featured</span>
                  </div>

                  <div className="featured-blog-content">
                    <span className="blog-category">
                      {featuredBlog.category}
                    </span>

                    <h1>{featuredBlog.title}</h1>

                    <p>{featuredBlog.description}</p>

                    <div className="blog-meta">
                      <span>
                        <Calendar size={16} />
                        {formatDate(featuredBlog.createdAt)}
                      </span>

                      <span>
                        <Clock size={16} />
                        {featuredBlog.readTime || "5 min read"}
                      </span>

                      <span>
                        <User size={16} />
                        {featuredBlog.author || "VProTech Digital"}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${featuredBlog._id}`}
                      className="read-more-btn"
                    >
                      Read Full Article
                      <ChevronRight size={22} />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* BLOG GRID */}

              <div className="blog-grid">
                {remainingBlogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    className="blog-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="blog-card-image">
                      <img
                        src={
                          blog.image ||
                          "https://via.placeholder.com/400x250/1e293b/4F46E5?text=VProTech"
                        }
                        alt={blog.title}
                      />

                      <span className="blog-card-category">
                        {blog.category}
                      </span>
                    </div>

                    <div className="blog-card-body">
                      <h3>{blog.title}</h3>

                      <p>{blog.description?.substring(0, 120)}...</p>

                      <div className="blog-card-meta">
                        <span>
                          <Calendar size={14} />
                          {formatDate(blog.createdAt)}
                        </span>

                        <span>
                          <Clock size={14} />
                          {blog.readTime || "5 min read"}
                        </span>
                      </div>

                      <Link
                        to={`/blog/${blog._id}`}
                        className="blog-card-link"
                      >
                        Read More
                        <ChevronRight size={20} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}