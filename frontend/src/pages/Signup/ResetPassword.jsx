import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const nav = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMsg(error.message);
    else {
        setMsg("Your password has been updated successfully!")
        setSuccess(true);
    };
  };

  return (
 <div
      className="auth-container d-flex flex-column align-items-center justify-content-center vh-100"
      style={{ background: "#f4f6fb" }}
    >
      <div
        className="card p-4 shadow text-center"
        style={{ maxWidth: 400, width: "90%", borderRadius: "1rem" }}
      >
        <h2 className="mb-3">Reset Password</h2>

        {!success ? (
          <>
            <form onSubmit={handleUpdatePassword}>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="form-control mb-3"
              />
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
            {msg && <p className="mt-3 small text-center">{msg}</p>}
          </>
        ) : (
          <>
            <p className="text-success mb-3 fw-medium">{msg}</p>
            <button
              onClick={() => nav("/volunteer/auth")}
              className="btn btn-outline-primary w-100"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}