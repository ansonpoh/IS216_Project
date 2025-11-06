import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Signup.module.css";
import Navbar from "../../components/Navbar";
import { supabase } from "../../config/supabaseClient";
import PageTransition from "../../components/Animation/PageTransition";
import modalStyles from "../../styles/Modals.module.css";

export default function LoginSignup() {
  const [active, setActive] = useState(false);
  const [loginErrors, setLoginErrors] = useState(false);
  const [registerErrors, setRegisterErrors] = useState(false);
  const { setAuth } = useAuth();
  const nav = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL;
  const LOCAL_BASE = "http://localhost:3001"

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_image: "",
    agree: false,
  });
  const [remember, setRemember] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [sendingReset, setSendingReset] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  useEffect(() => {
    if (active) {
      setLoginData({ email: "", password: "" });
    } else {
      setRegisterData(prev => ({
        ...prev,
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }));
    }
  }, [active]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterErrors("");

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterErrors("Passwords do not match");
      return;
    }

    const emailInUse = await axios.get(`${API_BASE}/users/check_email`, {params: {email: registerData.email}});
    if(emailInUse.data.status) {
      setRegisterErrors("Email in use.")
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/volunteer/auth`,
          data: { username: registerData.username },
        },
      });

      if (error) {
        setRegisterErrors(error.message);
        return;
      }

      const user = data.user;

      if (user) {
        const formData = new FormData();
        formData.append("user_id", user.id);
        formData.append("username", registerData.username);
        formData.append("email", registerData.email);
        if (registerData.profile_image instanceof File) {
          formData.append("profile_image", registerData.profile_image);
        }
        try {
          await axios.post(`${API_BASE}/users/complete_registration`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } catch (uploadErr) {
          console.error("Backend registration error:", uploadErr);
        }
      }


  setSuccessMessage("Verification link sent to email!");
  setShowSuccessModal(true);
  setActive(false);
    } catch (err) {
      console.error(err);
      setRegisterErrors("Unexpected error during registration.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginErrors("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        if (error.message?.toLowerCase().includes("email not confirmed")) {
          setLoginErrors("Please verify email before logging in");
        } else {
          setLoginErrors(error.message || "Login failed");
        }
        return;
      }

      const { user } = data;
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";

      if (!user) {
        setLoginErrors("Unable to retrieve user after login");
        return;
      }

      if (!user.email_confirmed_at) {
        setLoginErrors("Your email is not yet verified");
        return;
      }
      
      await supabase.auth.setSession(data.session);

      await supabase.auth.setSession(data.session);

      if (remember) {
        localStorage.setItem("sb-persist-session", JSON.stringify({status: true, role:"volunteer"}));
      } else {
        localStorage.removeItem("sb-persist-session");
      }

      setAuth({
        role:"volunteer",
        id: user.id,
        token: accessToken,
      })

      nav("/");
    } catch (err) {
      console.error(err);
      setLoginErrors("Unexpected error during login");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const {data, error} = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if(error) {
        console.error("Google login error", error.message);
      } else {
        console.log("Redirecting to Google OAuth...");
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setSendingReset(true);
    setForgotMsg("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;

      setForgotMsg("Reset link sent! Check your email.");
      setForgotEmail("");
    } catch (err) {
      console.error(err);
      setForgotMsg(`${err.message}`);
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageTransition>
      <div className={styles.body}>
        <div className={`${styles.login_signup_container} ${active ? styles.active : ""}`}>
          {/* LOGIN FORM */}
          <div className={styles['form-box']}>
            <form onSubmit={handleLogin} className={styles.form}>
              <h1>Login for Volunteer</h1>
              {loginErrors && (
                <div className={`form-alert mt-3`} style={{ color: "red" }}>
                  <i className="bx bx-error-circle"></i>
                  {loginErrors}
                </div>
              )}

              <div className={styles['input-box']}>
                <input
                  type="email"
                  placeholder="Email"
                  className={`form-control`}
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
                <i className="bx bxs-user"></i>
              </div>

              <div className={styles['input-box']}>
                <input
                  type="password"
                  placeholder="Password"
                  className={`form-control`}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <i className="bx bxs-lock-alt"></i>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)}/>
                  <label className="form-check-label" htmlFor="remember">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="btn btn-link p-0 small"
                  style={{ textDecoration: "none" }}
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className={styles.signup_btn}>
                Login
              </button>

              <div className={`${styles['social-icons']}`}>
                <button type="button" className={`${styles['social-icons-btn']}`} onClick={handleGoogleLogin}><i className="bx bxl-google"></i></button>
              </div>
            </form>
          </div>

          {showForgotPassword && (
            <div
              className={styles.modalOverlay}
              onClick={(e) => {
                if (e.target.classList.contains(styles.modalOverlay)) setShowForgotPassword(false);
              }}
            >
            <div className={styles.modalBox}>
              <h3>Reset Password</h3>
              <p className="small text-muted">
                Enter your registered email, and we'll send you a reset link.
              </p>
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="Email address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="form-control mb-2"
                />
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotMsg("");
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={sendingReset}>
                    {sendingReset ? "Sending..." : "Send Link"}
                  </button>
                </div>
              </form>
              {forgotMsg && <p className="mt-3 small text-center">{forgotMsg}</p>}
            </div>
          </div>
          )}
          
          {/* REGISTER FORM */}
          <div className={`${styles['form-box']} ${styles.register}`}>
            <form onSubmit={handleRegister}>
              <h1>Registration for Volunteer</h1>
              {registerErrors && (
                <div className={`form-alert mt-3`} style={{ color: "red" }}>
                  <i className="bx bx-error-circle"></i>
                  {registerErrors}
                </div>
              )}

              <div className={styles['input-box']}>
                <input
                  type="text"
                  placeholder="Username"
                  className={'form-control'}
                  value={registerData.username}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, username: e.target.value })
                  }
                  required
                />
                <i className="bx bxs-user"></i>
              </div>

              <div className={styles['input-box']}>
                <input
                  type="email"
                  placeholder="Email"
                  className={'form-control'}
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
                <i className="bx bxs-envelope"></i>
              </div>

              <div className={styles['input-box']}>
                <input
                  type="password"
                  placeholder="Password"
                  className={'form-control'}
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, password: e.target.value })
                  }
                  required
                />
                <i className="bx bxs-lock-alt"></i>
              </div>

              <div className={styles['input-box']}>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={'form-control'}
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, confirmPassword: e.target.value })
                  }
                  required
                />
                <i className="bx bxs-lock-alt"></i>
              </div>

              <div className={styles['input-box']} style={{marginBottom: "5px"}}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setRegisterData({ ...registerData, profile_image: file });
                  }}
                  required
                />
                <i className="bx bxs-image"></i>
              </div>
              <p className="text-muted">Upload a profile photo</p>


              {/* <div className="form-check mb-3">
                <input
                  id="agree"
                  name="agree"
                  className={styles['form-check-input']}
                  type="checkbox"
                  checked={registerData.agree}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, agree: e.target.checked })
                  }
                /> */}
                {/* <label className="form-check-label" htmlFor="agree">
                  I agree to the <a href="#">Terms</a> and <a href="#">Privacy</a>.
                </label> */}
              {/* </div> */}

              <button type="submit" className={styles.signup_btn}>
                Register
              </button>

              <div className={`${styles['social-icons']}`}>
                <button type="button" className={`${styles['social-icons-btn']}`} onClick={handleGoogleLogin}><i className="bx bxl-google"></i></button>
              </div>
            </form>
          </div>

          {/* TOGGLE BOX */}
          <div className={styles['toggle-box']}>
            <div className={`${styles['toggle-panel']} ${styles['toggle-left']}`}>
              <h1>Hello, Welcome!</h1>
              <p>Don't have an account?</p>
              <button className={styles.signup_btn} onClick={() => setActive(true)}>
                Register
              </button>
            </div>

            <div className={`${styles['toggle-panel']} ${styles['toggle-right']}`}>
              <h1>Welcome Back!</h1>
              <p>Already have an account?</p>
              <button className={styles.signup_btn} onClick={() => setActive(false)}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
      </PageTransition>
      <SuccessModalLocal open={showSuccessModal} message={successMessage} onClose={() => setShowSuccessModal(false)} />
    </>
  );
}

function SuccessModalLocal({ open, message, onClose }) {
  if (!open) return null;
  return (
    <div className={modalStyles.overlay} onClick={onClose}>
      <div className={modalStyles.dialog} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className={modalStyles.icon} style={{ color: 'green' }}>✓</div>
        <div className={modalStyles.title}>Success</div>
        <div className={modalStyles.body}>{message}</div>
        <div className={modalStyles.buttons}>
          <button className={modalStyles.btnPrimary} onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}