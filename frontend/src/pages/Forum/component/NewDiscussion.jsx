import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import modalStyles from '../../../styles/Modals.module.css';
import Title from "../../../components/ui/Title";
import Navbar from "../../../components/Navbar";
import PageTransition from "../../../components/Animation/PageTransition";

// Validation constants
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function NewDiscussion() {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [showGuidelines, setShowGuidelines] = useState(false);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";
  const LOCAL_BASE = "http://localhost:3001"
  const auth = JSON.parse(sessionStorage.getItem("auth"));

  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    image_file: null,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

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
      setStatus("Image is too large (max 5MB). Please choose a smaller image.");
      return;
    }

    setFormData((prev) => ({ ...prev, image_file: file }));
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setStatus("");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function handleCancel() {
    // open discard confirmation modal instead of native confirm
    setShowDiscardModal(true);
  }

  function handleDiscardConfirm() {
    setFormData({ subject: "", body: "", image_file: null });
    clearImage();
    setShowDiscardModal(false);
    nav("/community")
  }
  /* ========== Submit ========== */
  async function handlePost(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    // Ensure user is signed in
    const currentAuth = auth || JSON.parse(sessionStorage.getItem("auth"));
    if (!currentAuth?.id) {
      // show sign-in modal instead of navigating away immediately
      setStatus("Please sign in to post");
      setShowSignInModal(true);
      setSubmitting(false);
      return;
    }

    if (!formData.subject.trim() || !formData.body.trim()) {
      setStatus("Subject and body are required");
      setSubmitting(false);
      return;
    }

    const fd = new FormData();
    fd.append("user_id", currentAuth.id);
    fd.append("subject", formData.subject.trim());
    fd.append("body", formData.body.trim());
    if (formData.image_file) fd.append("image_file", formData.image_file);

    setUploading(!!formData.image_file);

    try {
      const response = await axios.post(
        `${API_BASE}/community/create_post`,
        fd,
        {
          headers: { Accept: "application/json", "Content-Type": "multipart/form-data" },
          withCredentials: true,
          timeout: 30000,
        }
      );

      if (response?.data?.status) {
        // show a success modal (instead of alert) and navigate when user dismisses
        setShowSuccessModal(true);
        setFormData({ subject: "", body: "", image_file: null });
        clearImage();
      } else {
        const msg = response?.data?.message || "Failed to create post";
        setStatus(msg);
        setErrorModalMessage(msg);
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error("Create post error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to create post";
      setStatus(errorMessage);
      setErrorModalMessage(errorMessage);
      setShowErrorModal(true);
      if (err.response?.status === 413) setStatus("Image file is too large");
      if (err.response?.status === 415) setStatus("Unsupported image format");
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  }

  function handleSuccessOk() {
    setShowSuccessModal(false);
    nav('/community');
  }

  function handleSignInOk() {
    setShowSignInModal(false);
    nav('/volunteer/auth');
  }



  return (
    <>
    <Navbar />
    <PageTransition>
    <div style={{
      minHeight: '100vh',
      // background: 'linear-gradient(to bottom, #f0f4ff 0%, #e5e7ff 100%)',
      // padding: '80px 20px 60px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <Title
          text="My Moment"
          size="52px"
          subtitle="Share your volunteer experience with the community"
          className="mb-4 mt-4"
        />

        {/* Main Card */}
        <div style={{
          position: 'relative',
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15)'
        }}>
          {/* Close button (top-right) */}
          <button
            type="button"
            onClick={() => nav('/community')}
            aria-label="Close and return to community"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'white',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(16,24,40,0.06)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(16,24,40,0.08)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(16,24,40,0.06)'; }}
          >
            ✕
          </button>
          {/* Guidelines Notice */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '2px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px'
          }}>
            <div
              onClick={() => setShowGuidelines(!showGuidelines)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ℹ️
            </div>
            <div style={{ flex: 1 }}>
              {/* Header row that vertically centers against the icon */}
              <div style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
                  Remember that posts are subject to the Community Policy.
                  <span onClick={() => setShowGuidelines(!showGuidelines)} style={{ color: '#6366f1', cursor: 'pointer', marginLeft: '4px', fontWeight: '600' }}>
                    {showGuidelines ? 'Hide' : 'View'} guidelines
                  </span>
                </p>
              </div>

              {showGuidelines && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(102, 126, 234, 0.2)', fontSize: '13px', color: '#6b7280', lineHeight: '1.8' }}>
                  <strong style={{ color: '#4b5563', display: 'block', marginBottom: '8px' }}>Community Guidelines:</strong>
                  • Be respectful and kind<br/>
                  • No personal attacks or bullying<br/>
                  • Keep content family-friendly<br/>
                  • No spam or self-promotion<br/>
                  • Respect privacy and confidentiality
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handlePost}>
            {/* Subject */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '700', color: '#1f2937', marginBottom: '10px' }}>
                Subject
              </label>
              <input
                name="subject"
                type="text"
                placeholder="What's your story about?"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '14px 18px', fontSize: '15px', border: '2px solid #e5e7eb', borderRadius: '12px', outline: 'none', transition: 'all 0.2s ease', fontFamily: 'inherit' }}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Body */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '700', color: '#1f2937', marginBottom: '10px' }}>
                Share Your Experience
              </label>
              <textarea
                name="body"
                rows={8}
                placeholder="Tell us about your volunteer experience, what you learned, and how it made you feel..."
                value={formData.body}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '14px 18px', fontSize: '15px', border: '2px solid #e5e7eb', borderRadius: '12px', outline: 'none', transition: 'all 0.2s ease', fontFamily: 'inherit', resize: 'vertical' }}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '700', color: '#1f2937', marginBottom: '10px' }}>
                Add a Photo <span style={{ color: '#9ca3af', fontWeight: '400', fontSize: '14px' }}>(optional)</span>
              </label>
              <div onDrop={onDrop} onDragOver={onDragOver} style={{ border: '2px dashed #d1d5db', borderRadius: '16px', padding: '32px', textAlign: 'center', background: imagePreview ? 'transparent' : '#f9fafb', transition: 'all 0.2s ease', cursor: 'pointer' }}
                onMouseOver={(e) => { if (!imagePreview) { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#f0f4ff'; } }}
                onMouseOut={(e) => { if (!imagePreview) { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#f9fafb'; } }}
              >
                {imagePreview ? (
                  <div style={{ position: 'relative' }}>
                    <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '12px' }} />
                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <label style={{ padding: '10px 20px', background: 'white', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', color: '#4b5563' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#4b5563'; }}>
                        Change Image
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageChange} style={{ display: "none" }} />
                      </label>
                      <button type="button" onClick={clearImage} disabled={uploading || submitting} style={{ padding: '10px 20px', background: 'white', border: '2px solid #ef4444', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', color: '#ef4444' }} onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#ef4444'; }}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>📷</div>
                    <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '8px', fontWeight: '600' }}>Drop your image here, or click to browse</p>
                    <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>PNG, JPG, WEBP or GIF up to 5MB</p>
                    <label style={{ display: 'inline-block', marginTop: '16px', padding: '10px 24px', background: '#7494ec', color: 'white', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                      Choose File
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={onImageChange} style={{ display: "none" }} />
                    </label>
                  </div>
                )}
              </div>

              {status && (
                <div style={{ marginTop: '12px', padding: '12px 16px', background: '#fee2e2', color: '#991b1b', borderRadius: '10px', fontSize: '14px' }}>{status}</div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
              <button type="button" onClick={handleCancel} disabled={submitting} style={{ padding: '14px 32px', background: 'white', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', color: '#6b7280' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#9ca3af'; e.currentTarget.style.color = '#4b5563'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}>Cancel</button>
              <button type="submit" disabled={submitting || uploading} style={{ padding: '14px 32px', background: submitting ? '#9ca3af' : '#7494ec', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseOver={(e) => { if (!submitting) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.3)'; } }} onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                {submitting ? (
                  <>
                    <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    <span>Posting...</span>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Share Your Story</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccessModal && (
        <div className={modalStyles.overlay} onClick={() => { setShowSuccessModal(false); nav('/community'); }}>
          <div className={modalStyles.dialog} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className={modalStyles.icon} style={{ color: 'green' }}>✓</div>
            <div className={modalStyles.title}>Post Created Successfully!</div>
            <div className={modalStyles.body}>Your post is live in the community.</div>
            <div className={modalStyles.buttons}>
              <button className={modalStyles.btnPrimary} onClick={handleSuccessOk}>OK</button>
            </div>
          </div>
        </div>
      )}

      {showSignInModal && (
        <div className={modalStyles.overlay} onClick={() => { setShowSignInModal(false); nav('/volunteer/auth'); }}>
          <div className={modalStyles.dialog} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className={modalStyles.icon} style={{ color: '#f59e0b' }}>⚠️</div>
            <div className={modalStyles.title}>Please sign in to continue</div>
            <div className={modalStyles.body}>You need to sign in before posting. Would you like to go to the sign in page?</div>
            <div className={modalStyles.buttons}>
              <button className={modalStyles.btnCancel} onClick={() => setShowSignInModal(false)}>Cancel</button>
              <button className={modalStyles.btnPrimary} onClick={handleSignInOk}>Sign In</button>
            </div>
          </div>
        </div>
      )}

      {showDiscardModal && (
        <div className={modalStyles.overlay} onClick={() => setShowDiscardModal(false)}>
          <div className={modalStyles.dialog} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className={modalStyles.icon} style={{ color: '#f59e0b' }}>⚠️</div>
            <div className={modalStyles.title}>Discard your post?</div>
            <div className={modalStyles.body}>Are you sure you want to discard this post? This action cannot be undone.</div>
            <div className={modalStyles.buttons}>
              <button className={modalStyles.btnCancel} onClick={() => setShowDiscardModal(false)}>Cancel</button>
              <button className={modalStyles.btnPrimary} onClick={handleDiscardConfirm}>Discard</button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className={modalStyles.overlay} onClick={() => setShowErrorModal(false)}>
          <div className={modalStyles.dialog} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className={modalStyles.icon} style={{ color: '#f59e0b' }}>⚠️</div>
            <div className={modalStyles.title}>Error</div>
            <div className={modalStyles.body}>{errorModalMessage}</div>
            <div className={modalStyles.buttons}>
              <button className={modalStyles.btnPrimary} onClick={() => setShowErrorModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

    </div>
    </PageTransition>
    </>
  );
}