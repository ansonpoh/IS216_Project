// src/components/NewDiscussion.jsx
import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";
import { supabase } from "../../../config/supabaseClient"; // adjust path if needed

export default function NewDiscussion({ initialBoard = "" }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  function validate() {
    const e = {};
    if (!subject.trim()) e.subject = "Subject is required.";
    if (!body.trim()) e.body = "Post body cannot be empty.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleImageFile(file) {
    setImageError("");
    if (!file) return clearImage();

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPG, PNG, WEBP or GIF allowed.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image is too large (max 5MB).");
      return;
    }

    setImageFile(file);

    // preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }

  function onImageChange(e) {
    const file = e.target.files?.[0];
    handleImageFile(file);
  }

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

  // Upload helper: uploads to 'feedback-images' bucket and returns public URL
  async function uploadToSupabaseStorage(file, userId) {
    if (!file) return null;
    // safe filename
    const path = `${userId}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    // 1) upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("feedback-images")
      .upload(path, file);

    if (uploadError) {
      console.error("Storage upload error", uploadError);
      throw uploadError;
    }

    // 2) get public URL (for public bucket)
    const { data: urlData, error: urlErr } = supabase.storage
      .from("feedback-images")
      .getPublicUrl(path);

    if (urlErr) {
      console.error("getPublicUrl error", urlErr);
      throw urlErr;
    }

    // v2 shape: urlData.publicUrl
    const publicUrl = urlData?.publicUrl || urlData?.publicURL || null;
    if (!publicUrl) throw new Error("Could not retrieve public URL after upload.");
    return publicUrl;
  }

  async function handlePost(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setImageError("");
    setUploading(false);

    try {
      // require user to be logged in (recommended)
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        console.error("getUser error:", userErr);
      }
      const user = userData?.user;
      if (!user) throw new Error("You must be signed in to post.");

      const userId = user.id;
      let imageUrl = null;

      if (imageFile) {
        setUploading(true);
        try {
          imageUrl = await uploadToSupabaseStorage(imageFile, userId);
          console.log("Uploaded image URL:", imageUrl);
        } catch (upErr) {
          console.error("Upload failed:", upErr);
          setImageError("Image upload failed. See console.");
          throw upErr;
        } finally {
          setUploading(false);
        }
      }

      // insert into feedback
      const payload = {
        user_id: userId,
        subject: subject.trim(),
        body: body.trim(),
        img: imageUrl,
      };

      console.log("Inserting payload:", payload);
      const { data: inserted, error: insertError } = await supabase
        .from("feedback")
        .insert([payload])
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      console.log("Inserted post:", inserted);
      // success: reset
      clearImage();
      setSubject("");
      setBody("");
      setErrors({});
      alert("Posted successfully!");
    } catch (err) {
      console.error("handlePost error:", err);
      const msg = err?.message || "Failed to post. Check console.";
      setImageError(msg);
      // keep user input so they can retry
    } finally {
      setUploading(false);
      setSubmitting(false);
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
            <div className="mb-3">
              <label htmlFor="subjectInput" className="form-label">Subject</label>
              <input
                id="subjectInput"
                type="text"
                className={`form-control ${errors.subject ? "is-invalid" : ""} subject-highlight`}
                placeholder="Enter a subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
            </div>

            <div className="mb-3" onPaste={onPaste}>
              <label htmlFor="body" className="form-label mb-2">Body</label>
              <textarea
                id="body"
                className={`form-control ${errors.body ? "is-invalid" : ""}`}
                rows={8}
                placeholder="Write your post here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                aria-invalid={errors.body ? "true" : "false"}
                aria-describedby={errors.body ? "body-error" : undefined}
              />
              {errors.body && (
                <div id="body-error" className="invalid-feedback d-block">
                  {errors.body}
                </div>
              )}
            </div>

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

                  {imageFile && (
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
