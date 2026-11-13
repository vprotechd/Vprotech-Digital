
import React, { useEffect, useState } from "react";
import { mediaService } from "../../services/api";
import toast from "react-hot-toast";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
} from "lucide-react";
import "./MediaManager.css";

export default function MediaManager() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [key, setKey] = useState("");
  const [section, setSection] = useState("home-hero");
  const [alt, setAlt] = useState("");
  const [order, setOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await mediaService.getMedia();
      setMedia(response.media || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!key.trim() || !section.trim() || !imageFile) {
      toast.error("Please enter an image key, section and select an image.");
      return;
    }

    try {
      setUploading(true);

      const response = await mediaService.uploadMedia({
        key: key.trim(),
        section: section.trim(),
        alt: alt.trim(),
        order,
        imageFile,
      });

      toast.success(response.message || "Image uploaded successfully");

      setKey("");
      setAlt("");
      setOrder(0);
      setImageFile(null);

      const fileInput = document.getElementById("media-image-file");
      if (fileInput) fileInput.value = "";

      await fetchMedia();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Image upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageKey) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${imageKey}"?`
    );

    if (!confirmed) return;

    try {
      await mediaService.deleteMedia(imageKey);
      toast.success("Image deleted successfully");
      await fetchMedia();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete image"
      );
    }
  };

  return (
    <div className="media-manager">
      <div className="media-manager-header">
        <div>
          <h2>Media Manager</h2>
          <p>Upload and manage images used across your website.</p>
        </div>

        <button
          type="button"
          className="media-refresh-btn"
          onClick={fetchMedia}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <form className="media-upload-form" onSubmit={handleUpload}>
        <h3>
          <Upload size={20} />
          Upload or Replace Image
        </h3>

        <div className="media-form-grid">
          <div className="media-form-field">
            <label>Image Key</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Example: home_hero_1"
              required
            />
            <small>Use the same key to replace an existing image.</small>
          </div>

          <div className="media-form-field">
            <label>Section</label>
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="Example: home-hero"
              required
            />
          </div>

          <div className="media-form-field">
            <label>Alt Text</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image"
            />
          </div>

          <div className="media-form-field">
            <label>Display Order</label>
            <input
              type="number"
              min="0"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="media-form-field media-file-field">
          <label>Select Image (JPG, PNG, WEBP or GIF — max 5 MB)</label>
          <input
            id="media-image-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <button
          type="submit"
          className="media-upload-btn"
          disabled={uploading}
        >
          <Upload size={18} />
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      <div className="media-library-header">
        <div>
          <h3>Website Image Library</h3>
          <p>{media.length} image(s) stored</p>
        </div>
      </div>

      {loading ? (
        <div className="media-empty-state">Loading images...</div>
      ) : media.length === 0 ? (
        <div className="media-empty-state">
          <ImageIcon size={42} />
          <h3>No images uploaded yet</h3>
          <p>Upload your first website image using the form above.</p>
        </div>
      ) : (
        <div className="media-grid">
          {media.map((item) => (
            <div className="media-card" key={item._id}>
              <div className="media-card-image">
                <img src={item.imageUrl} alt={item.alt || item.key} />
              </div>

              <div className="media-card-details">
                <h4>{item.key}</h4>
                <p>Section: {item.section}</p>
                <p>Order: {item.order}</p>

                <button
                  type="button"
                  className="media-delete-btn"
                  onClick={() => handleDelete(item.key)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
