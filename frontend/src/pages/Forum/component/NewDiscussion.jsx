// src/components/NewDiscussion.jsx
import React, { useState, useRef } from "react";
import "../../../styles/Community.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * NewDiscussion page with single-image upload (drag/drop/paste/choose).
 *
 * Server expectations (example):
 * - POST /api/upload (multipart/form-data) -> { url: "https://cdn.example.com/..." }
 * - POST /api/discussions (application/json) -> create discussion
 *
 * Replace /api/* with your real endpoints or adapt handlePost to your API client (axios).
 */

// validation constants
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function NewDiscussion({ initialBoard = "" }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const auth = JSON.parse(sessionStorage.getItem("auth"));
  const [formData, setFormData] = useState({
    user_id: auth.id,
    subject: "",
    body: "",
    image_file: null,
  });

  // refs
  const fileInputRef = useRef(null);
  const nav = useNavigate();

  /* ========== Image helpers ========== */
  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleImageFile = (file) => {
    if (!file) return clearImage();

    if (!ALLOWED_TYPES.includes(file.type)) {
      setStatus("Only JPG, PNG, WEBP or GIF allowed.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setStatus("Image is too large (max 5MB).");
      return;
    }

    setFormData((prev) => ({ ...prev, image_file: file }));

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    handleImageFile(file);
  };

  function onDrop(e) {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) {
      const file = e.dataTransfer.files[0];
      handleImageFile(file);
    }
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function onPaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.kind === "file" && it.type.startsWith("image/")) {
        const file = it.getAsFile();
        handleImageFile(file);
        break;
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ========== Submit ========== */
  async function handlePost(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      // Auth check
      if (!auth?.id) {
        setStatus("Please sign in to post");
        alert("Please sign in to create a post");
        nav("/volunteer/auth");
        return;
      }

      // Validate subject is unique
      if (!formData.subject.trim()) {
        setStatus("Subject is required");
        return;
      }

      const fd = new FormData();
      fd.append("user_id", auth.id);
      fd.append("subject", formData.subject.trim());
      fd.append("body", formData.body.trim());
      
      if (formData.image_file) {
        fd.append("image_file", formData.image_file);
      }

      const response = await axios.post(
        "http://localhost:3001/community/create_post",
        fd,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      if (response.data.status) {
        alert("Post Created Successfully!");
        nav("/community");
      }

    } catch (err) {
      console.error("Error creating post:", err);
      
      // Handle duplicate subject error
      if (err.response?.data?.includes('feedback_subject_key')) {
        setStatus("A post with this subject already exists. Please choose a different subject.");
        setErrors(prev => ({
          ...prev,
          subject: "This subject is already taken. Please choose a different one."
        }));
      } else {
        setStatus(err.message || "Failed to create post");
      }
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }


  function handleCancel() {
    window.history.back();
  }

  return (
    <div className="container py-5">
      <h1 className="display-6 mb-3">New Discussion</h1>

      <nav className="small text-muted mb-4">Welcome to the Community &nbsp;/&nbsp; New Discussion</nav>

      <div className="card border-0">
        <div className="card-body">
          <p className="text-muted small mb-3">Remember that posts are subject to the Community Policy.</p>

          <form onSubmit={handlePost}>
            {/* Subject */}
            <div className="mb-3">
              <label htmlFor="subjectInput" className="form-label">Subject</label>
              <input
                id="subjectInput"
                name="subject"
                type="text"
                className={`form-control ${errors.subject ? "is-invalid" : ""} subject-highlight`}
                placeholder="Enter a subject"
                value={formData.subject}
                onChange={handleChange}
                autoComplete="off"
                required

              />
              {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
            </div>

            {/* Body */}
            <div className="mb-3" onPaste={onPaste}>
              <label htmlFor="body" className="form-label mb-2">Body</label>
              <textarea
                id="body"
                name="body"
                className={`form-control ${errors.body ? "is-invalid" : ""}`}
                rows={10}
                placeholder="Write your post here..."
                value={formData.body}
                onChange={handleChange}
                required
                aria-invalid={errors.body ? "true" : "false"}
                aria-describedby={errors.body ? "body-error" : undefined}
              />
              {errors.body && (
                <div id="body-error" className="invalid-feedback d-block">
                  {errors.body}
                </div>
              )}
            </div>

            {/* Image upload area */}
            <div
              className="border rounded p-2 mb-3"
              onDrop={onDrop}
              onDragOver={onDragOver}
              aria-label="Attach an image (drag & drop, paste or choose file)"
            >
              <div className="d-flex align-items-center justify-content-between">
                <small className="text-muted">Attach an image (optional) — drag & drop, paste, or choose file</small>

                <div>
                  <label className="btn btn-sm btn-outline-secondary mb-0">
                    Choose file
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onImageChange}
                      style={{ display: "none" }}
                    />
                  </label>

                  {formData.image_file && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={clearImage}
                      disabled={uploading || submitting}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {imageError && <div className="text-danger small mt-2">{imageError}</div>}

              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{ maxWidth: "100%", height: 220, objectFit: "cover", borderRadius: 6 }}
                  />
                  <div className="small text-muted mt-1">Preview — image will be uploaded when you submit.</div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-dark" disabled={submitting || uploading}>
                {submitting ? "Posting..." : uploading ? "Uploading…" : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}