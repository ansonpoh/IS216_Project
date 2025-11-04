import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Signup.module.css";
import Navbar from "../../components/Navbar";
import { supabase } from "../../config/supabaseClient";
import PageTransition from "../../components/Animation/PageTransition";

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

  useEffect(() => {
    if (active) {
      setLoginData({ email: "", password: "" });
    } else {
      setRegisterData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [active]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterErrors("");

    if (!registerData.agree) {
      setRegisterErrors("Please agree to Terms and Privacy to continue");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterErrors("Passwords do not match");
      return;
    }

    const emailInUse = await axios.get(`${LOCAL_BASE}/users/check_email`, {params: {email: registerData.email}});
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

      alert("Verification link sent to email!");
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

      if (remember) {
        localStorage.setItem("sb-persist-session", JSON.stringify({status: true, role:"volunteer"}));
      } else {
        localStorage.removeItem("sb-persist-session");
      }

      const userInDb = await axios.get(`${LOCAL_BASE}/users/get_user_by_id`, {params: {id: user.id}});
      if(userInDb.data.result.length === 0) {
        try {
          const formData = new FormData();
          formData.append("user_id", user.id);
          formData.append("username", user.user_metadata?.username || "");
          formData.append("email", user.email || "");
          if (registerData.profile_image instanceof File) {
            formData.append("profile_image", registerData.profile_image);
          }

          const res = await axios.post(
            `${LOCAL_BASE}/users/complete_registration`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          if (res?.data?.status) {
            alert("Login success");
          } else {
            console.log(res?.data);
          }

          setAuth({
            role: "volunteer",
            id: user.id,
            token: accessToken || "",
          });
          nav("/");
        } catch (err) {
          console.error(err);
        }
      } else {
        setAuth({
          role: "volunteer",
          id: user.id,
          token: accessToken || "",
        });
        nav("/");
      }
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
          redirectTo: `${window.location.origin}/`,
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
                <a href="#" className="small">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className={styles.signup_btn}>
                Login
              </button>

              <div className={`${styles['social-icons']}`}>
                <button className={`${styles['social-icons-btn']}`} onClick={handleGoogleLogin}><i className="bx bxl-google"></i></button>
              </div>
            </form>
          </div>

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

              <div className="form-check mb-3">
                <input
                  className={styles['form-check-input']}
                  type="checkbox"
                  checked={registerData.agree}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, agree: e.target.checked })
                  }
                />
                <label className="form-check-label" htmlFor="agree">
                  I agree to the <a href="#">Terms</a> and <a href="#">Privacy</a>.
                </label>
              </div>

              <button type="submit" className={styles.signup_btn}>
                Register
              </button>

              <div className={`${styles['social-icons']}`}>
                <button className={`${styles['social-icons-btn']}`} onClick={handleGoogleLogin}><i className="bx bxl-google"></i></button>
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
    </>
  );
}