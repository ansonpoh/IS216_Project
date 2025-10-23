// src/components/NewDiscussion.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./community.css";

/**
 * NewDiscussion skeleton page.
 *
 * Notes:
 * - Replace commented axios/fetch code with your real backend routes.
 * - To show this page when user clicks "Start a discussion":
 *    • If using react-router: add a route like <Route path="/discussions/new" element={<NewDiscussion />} />
 *    • Or open it in a modal and render <NewDiscussion /> inside the modal body.
 */

export default function NewDiscussion({ initialBoard = "" }) {
  const [subject, setSubject] = useState("");
  const [board, setBoard] = useState(initialBoard || "");
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!subject.trim()) e.subject = "Subject is required.";
    if (!board) e.board = "Please choose a board.";
    if (!body.trim()) e.body = "Post body cannot be empty.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePost(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = { subject: subject.trim(), board, body };
      // Example: send to backend
      // await axios.post('/api/discussions', payload);
      // after success redirect / show toast:
      // navigate('/forums') // react-router
      window.alert("Posted (skeleton). Wire the API in handlePost.");
    } catch (err) {
      console.error(err);
      window.alert("Failed to post. See console for details.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    // go back to previous page. If you use router, use navigate(-1) instead.
    window.history.back();
  }

  return (
    <div className="container py-5">
      <h1 className="display-6 mb-3">New Discussion</h1>

      <nav className="small text-muted mb-4">
        Welcome to the Community &nbsp;/&nbsp; <span className="text-body fw-medium">Etsy Forums</span> &nbsp;/&nbsp; New Discussion
      </nav>

      <div className="card border-0">
        <div className="card-body">
          <p className="text-muted small mb-3">
            Remember that posts are subject to the Community Policy.
          </p>

          <form onSubmit={handlePost}>
            {/* Subject */}
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

            {/* Board / Location */}
            <div className="mb-3">
              <label htmlFor="boardSelect" className="form-label">Select Location</label>
              <select
                id="boardSelect"
                className={`form-select ${errors.board ? "is-invalid" : ""}`}
                value={board}
                onChange={(e) => setBoard(e.target.value)}
              >
                <option value="">Choose a Board</option>
                <option value="announcements">Announcements</option>
                <option value="technical">Technical Issues</option>
                <option value="events">Events</option>
                <option value="general">General Discussion</option>
              </select>
              {errors.board && <div className="invalid-feedback">{errors.board}</div>}
            </div>

            {/* Body / Rich text toolbar (placeholder) */}
            <div className="mb-2 d-flex justify-content-between align-items-center">
              <label className="form-label mb-0">Body</label>
              <div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => setPreview((p) => !p)}
                >
                  {preview ? "Edit" : "Preview"}
                </button>
                <span className="text-muted small">Preview shows basic rendering</span>
              </div>
            </div>

            <div className="mb-3">
              {/* toolbar placeholder */}
              <div className="rich-toolbar mb-2 p-2 rounded border bg-white">
                {/* icons are non-functional skeletons */}
                <button type="button" className="btn btn-sm btn-light me-1" disabled><b>B</b></button>
                <button type="button" className="btn btn-sm btn-light me-1" disabled><i>I</i></button>
                <button type="button" className="btn btn-sm btn-light me-1" disabled><u>U</u></button>
                <button type="button" className="btn btn-sm btn-light me-1" disabled>• List</button>
                <button type="button" className="btn btn-sm btn-light me-1" disabled>Link</button>
                <button type="button" className="btn btn-sm btn-light me-1" disabled>Emoji</button>
                <span className="text-muted small ms-2">Toolbar placeholders — plug a WYSIWYG editor here (eg. Quill, TinyMCE).</span>
              </div>

              {!preview ? (
                <textarea
                  className={`form-control ${errors.body ? "is-invalid" : ""}`}
                  rows={10}
                  placeholder="Write your post here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              ) : (
                <div className="card p-3 preview-box" aria-live="polite">
                  {/* Very basic preview: escape HTML to prevent XSS in real app; here we keep plain text rendering */}
                  {body ? (
                    <div style={{ whiteSpace: "pre-wrap" }}>{body}</div>
                  ) : (
                    <div className="text-muted">Nothing to preview yet.</div>
                  )}
                </div>
              )}

              {errors.body && <div className="invalid-feedback d-block">{errors.body}</div>}
            </div>

            {/* Actions */}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button type="button" className="btn btn-outline-secondary" onClick={handleCancel} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-dark" disabled={submitting}>
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
