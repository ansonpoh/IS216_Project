import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Signup.module.css";
import Navbar from "../../components/Navbar";
import { supabase } from "../../config/supabaseClient";

export default function LoginSignup() {
  const [active, setActive] = useState(false);
  const [registerErrors, setRegisterErrors] = useState(false);
  const [loginErrors, setLoginErrors] = useState(false);
  const { setAuth } = useAuth();
  const nav = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    org_name: "",
    email: "",
    password: "",
    confimPassword: "",
    profile_image: "",
    agree: false,
  });

  useEffect(() => {
    setLoginData({ email: "", password: "" });
    setRegisterData({
      org_name: "",
      email: "",
      password: "",
      confimPassword: "",
    });
  }, [active, loginErrors, registerErrors]);

  const handle_register = async (e) => {
    e.preventDefault();
    setRegisterErrors("");
    if (!registerData.agree) {
      setRegisterErrors("Please agree to Terms and Privacy to continue");
      return;
    }

    if (registerData.password !== registerData.confimPassword) {
      setRegisterErrors("Passwords do not match");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/organiser/auth`,
          data: { org_name: registerData.org_name },
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

  const handle_login = async (e) => {
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

      const org = data.user;
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || "";

      if (!org) {
        setLoginErrors("Unable to retreieve org after login");
        return;
      }

      if (!org.email_confirmed_at) {
        setLoginErrors("Your email is not yet verified");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("supabase_id", org.id);
        formData.append("org_name", org.user_metadata?.org_name || "");
        formData.append("email", org.email || "");
        if (registerData.profile_image instanceof File) {
          formData.append("profile_image", registerData.profile_image);
        }
        const res = await axios.post(
          "http://localhost:3001/orgs/complete_registration",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setAuth({
          role: "organiser",
          id: org.id,
          token: accessToken || "",
        });

        if (res?.data?.status) {
          alert("Login success");
        } else {
          console.log(res?.data);
        }
        nav("/");
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.error(err);
      setLoginErrors("Unexpected error during login");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.body}>
        <div className={`${styles.login_signup_container} ${active ? styles.active : ""}`}>
          {/* LOGIN FORM */}
          <div className={styles.form_box}>
            <form onSubmit={handle_login}>
              <h1>Login for Organiser</h1>
              {loginErrors && (
                <div className={`${styles['form-alert']} mt-3`} style={{ color: "red" }}>
                  <i className="bx bx-error-circle"></i>
                  {loginErrors}
                </div>
              )}

              <div className={styles['input-box']}>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles['form-control']}
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
                  className={styles['form-control']}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <i className="bx bxs-lock-alt"></i>
              </div>

              <div className={`d-flex justify-content-between align-items-center mb-3`}>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="remember" />
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
            </form>
          </div>

          {/* REGISTER FORM */}
          <div className={`${styles.form_box} ${styles.register}`}>
            <form onSubmit={handle_register}>
              <h1>Registration for Organiser</h1>
              {registerErrors && (
                <div className={`${styles['form-alert']} mt-3`} style={{ color: "red" }}>
                  <i className="bx bx-error-circle"></i>
                  {registerErrors}
                </div>
              )}

              <div className={styles['input-box']}>
                <input
                  type="text"
                  placeholder="Organisation Name"
                  className={styles['form-control']}
                  value={registerData.org_name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, org_name: e.target.value })
                  }
                  required
                />
                <i className="bx bxs-user"></i>
              </div>

              <div className={styles['input-box']}>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles['form-control']}
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
                  className={styles['form-control']}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
                <i className="bx bxs-lock-alt"></i>
              </div>

              <div className={styles['input-box']}>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={styles['form-control']}
                  value={registerData.confimPassword}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, confimPassword: e.target.value })
                  }
                  required
                />
                <i className="bx bxs-lock-alt"></i>
              </div>

              <div className={`form-check mb-3`}>
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
            </form>
          </div>

          {/* TOGGLE BOX */}
          <div className={styles.toggle_box}>
            <div className={`${styles.toggle_panel} ${styles['toggle-left']}`}>
              <h1>Hello, Welcome!</h1>
              <p>Don't have an account?</p>
              <button className={styles.signup_btn} onClick={() => setActive(true)}>
                Register
              </button>
            </div>

            <div className={`${styles.toggle_panel} ${styles['toggle-right']}`}>
              <h1>Welcome Back!</h1>
              <p>Already have an account?</p>
              <button className={styles.signup_btn} onClick={() => setActive(false)}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}