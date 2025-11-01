import React, { useState, useRef, useEffect } from "react";
import * as bootstrap from 'bootstrap';  // Add this line
import styles from "../../../styles/Community.module.css";
import SplitText from "../../../components/Animation/SplitText.jsx";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from "react-router-dom";

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
    supabase_id: auth.id,
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

      // Form validation
      if (!formData.subject.trim() || !formData.body.trim()) {
        setStatus("Subject and body are required");
        return;
      }

      // Debug log
      console.log("Sending data:", {
        supabase_id: auth.id,
        user_id: auth.id,
        subject: formData.subject,
        body: formData.body,
        hasImage: !!formData.image_file
      });

      const fd = new FormData();
      fd.append("supabase_id", auth.id);
      fd.append("user_id", auth.id)
      fd.append("subject", formData.subject.trim());
      fd.append("body", formData.body.trim());

      if (formData.image_file) {
        fd.append("image_file", formData.image_file);
        console.log("Image file type:", formData.image_file.type);
        console.log("Image file size:", formData.image_file.size);
      }

      // Make the API call with detailed error logging
      try {
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

        console.log("Server response:", response.data);

        if (response.data.status) {
          alert("Post Created Successfully!");
          nav("/community");
        }
      } catch (axiosError) {
        console.error("Axios error details:", {
          message: axiosError.message,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          responseData: axiosError.response?.data
        });
        throw axiosError;
      }

    } catch (err) {
      console.error("Full error object:", err);

      const errorMessage = err.response?.data?.message
        || err.message
        || "Failed to create post";

      setStatus(errorMessage);
      alert(`Error: ${errorMessage}`);

      if (err.response?.status === 413) {
        setStatus("Image file is too large");
      } else if (err.response?.status === 415) {
        setStatus("Unsupported image format");
      }
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }


  function handleCancel() {
    window.history.back();
  }

  // Add useEffect for tooltip initialization
  useEffect(() => {
    // Initialize all tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
      new bootstrap.Tooltip(tooltip);
    });

    // Cleanup on unmount
    return () => {
      tooltips.forEach(tooltip => {
        const instance = bootstrap.Tooltip.getInstance(tooltip);
        if (instance) {
          instance.dispose();
        }
      });
    };
  }, []);

  return (
    <div className={`${styles.My_moment}`}>
      {/* Enhanced Header with SplitText */}
      <div className="text-center mb-2 mt-5 ">
        <SplitText
          text="My Moment"
          tag="h1"
          className="display-4 fw-bold mb-3"
          delay={150}
          duration={0.8}
          from={{ opacity: 0, y: 50 }}
          to={{ opacity: 1, y: 0 }}
          splitType="chars"
        />
        <nav className={`${styles.breadcrumb} d-inline-flex`}>
          <SplitText
            text="Share with the Community"
            delay={50}
            duration={0.6}
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            splitType="words"
            className="text-muted"
          />
        </nav>
      </div>



      <div className={styles.card}>
        <div className={styles['card-body']}>
          {/* Policy notice with icon */}
          <div className="alert alert-light border d-flex align-items-center mb-4">
            <i 
              className={`bi bi-info-circle me-2 ${styles.info_icon}`}
              style={{ cursor: 'pointer' }}
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              data-bs-html="true"
              title='<div class="guidelines_title">Community Guidelines:</div>• Be respectful and kind<br/>• No personal attacks or bullying<br/>• Keep content family-friendly<br/>• No spam or self-promotion<br/>• Respect privacy and confidentiality'
            ></i>
            <p className="mb-0">Remember that posts are subject to the Community Policy.</p>
          </div>

          <form onSubmit={handlePost}>
            {/* Subject with enhanced styling */}
            <div className="mb-4">
              <label htmlFor="subjectInput" className={`form-label fw-bold ${styles.form_label}`}>
                Subject
              </label>
              <input
                id="subjectInput"
                name="subject"
                type="text"
                className={`form-control ${errors.subject ? "is-invalid" : ""} ${styles['subject-highlight']}`}
                placeholder="Enter a subject"
                value={formData.subject}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
            </div>

            {/* Body with enhanced styling */}
            <div className="mb-4">
              <label
                htmlFor="body"
                className={`form-label fw-bold ${styles.form_label}`}
              >
                Body
              </label>
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

            {/* Enhanced image upload area */}
            <div
              className={`${styles['image-upload-area']} mb-4`}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <i className="bi bi-image me-2 text-primary"></i>
                  <small>Attach an image (optional)</small>
                </div>
                <div>
                  <label className={`btn ${styles['btn-sm']} btn-outline-secondary mb-0`}>
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
                      className={`btn ${styles['btn-sm']} btn-outline-danger ms-2`}
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
                <div className={styles['preview-container']}>
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-100"
                    style={{ height: 220, objectFit: "cover" }}
                  />
                  <div className="small text-muted mt-2 text-center">
                    <i className="bi bi-eye me-1"></i>Preview
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced action buttons */}
            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={handleCancel}
                disabled={submitting}
              >
                <i className="bi bi-x me-2"></i>Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={submitting || uploading}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Posting...
                  </>
                ) : uploading ? (
                  <>
                    <i className="bi bi-cloud-upload me-2"></i>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}