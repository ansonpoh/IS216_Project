import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import Navbar from "./Navbar";
import { supabase } from "../config/supabaseClient";

export default function LoginSignup() {
  const [active, setActive] = useState(false);
  const [loginErrors, setLoginErrors] = useState(false);
  const [registerErrors, setRegisterErrors] = useState(false);
  const {setAuth} = useAuth();
  const nav = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_image: "",
    agree: false,
  })

  useEffect(() => {
  if (active) {
    setLoginData({ email: "", password: "" });
  } else {
    setRegisterData({ username: "", email: "", password: "", confimPassword: "" });
  }
}, [active]);


    const handle_register = async (e) => {
        e.preventDefault();
        setRegisterErrors("");
        if(!registerData.agree) {
            setRegisterErrors("Please agree to Terms and Privacy to continue");
            return;
        }

        if(registerData.password !== registerData.confirmPassword) {
            setRegisterData("Passwords do not match");
            return
        }

        try {
            const {data, error} = await supabase.auth.signUp({
                email: registerData.email,
                password: registerData.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/volunteer/auth`,
                    data: {username: registerData.username},
                }
            })

            if(error) {
                setRegisterErrors(error.message);
                return;
            }

            alert("Verification link sent to email!")
            setActive(false);
        } catch (err) {
            console.error(err);
            setRegisterErrors("Unexpected error during registration.");
        }
    }

    const handle_login = async (e) => {
        e.preventDefault();
        setLoginErrors("");

        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: loginData.email,
                password: loginData.password,
            })

            if(error) {
                if(error.message?.toLowerCase().includes("email not confirmed")) {
                    setLoginErrors("Please verify email before logging in")
                } else {
                    setLoginErrors(error.message || "Login failed");
                }
                return
            }

            const {user} = data;
            const {data: sessionData} = await supabase.auth.getSession();
            const accessToken = sessionData?.session?.access_token || "";

            if(!user) {
                setLoginErrors("Unable to retreieve user after login");
                return;
            }

            if(!user.email_confirmed_at) {
                setLoginErrors("Your email is not yet verified");
                return
            }

            try {
                const formData = new FormData();
                formData.append("supabase_id", user.id);
                formData.append("username", user.user_metadata?.username || "");
                formData.append("email", user.email || "");
                if(registerData.profile_image instanceof File) {
                    formData.append("profile_image", registerData.profile_image)
                }
                const res = await axios.post("http://localhost:3001/users/complete_registration", formData, {headers: {"Content-Type" : "multipart/form-data"}});

                setAuth({
                    role:"volunteer",
                    id: user.id,
                    token: accessToken || "",
                })

                if(res?.data?.status) {
                    alert("Login success")
                } else {
                    console.log(res?.data);
                }
                nav("/")
            } catch (err){
                console.log(err);
            }

        } catch (err) {
            console.error(err);
            setLoginErrors("Unexpected error during login");

        }
    }
  
  return (
    <>
    <Navbar/>
    <div className="body">
        <div className={`login_signup_container ${active ? "active" : ""}`}>
            {/* LOGIN FORM */}
            <div className="form-box login">
                <form onSubmit={handle_login}>
                <h1>Login for Volunteer</h1>
                {loginErrors && (
                    <div className="form-alert mt-3" style={{color: "red", }}>
                        <i className="bx bx-error-circle"></i>
                        {loginErrors}
                    </div>
                )}

                <div className="input-box">
                    <input type="email" placeholder="Email" className={`form-control`} value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
                    <i className="bx bxs-user"></i>
                </div>

                <div className="input-box">
                    <input type="password" placeholder="Password" required className={`form-control`} value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
                    <i className="bx bxs-lock-alt"></i>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="remember" />
                    <label className="form-check-label" htmlFor="remember">
                        Remember me
                    </label>
                    </div>
                    <a href="#" className="small">Forgot password?</a>
                </div>

                <button type="submit" className="signup_btn">
                    Login
                </button>
                
                <p>or login with social platforms</p>
                {/* <div className="social-icons">
                    <a href="#"><i className="bx bxl-google"></i></a>
                    <a href="#"><i className="bx bxl-facebook"></i></a>
                    <a href="#"><i className="bx bxl-github"></i></a>
                    <a href="#"><i className="bx bxl-linkedin"></i></a>
                </div> */}
                </form>
            </div>

            {/* REGISTER FORM */}
            <div className="form-box register">
                <form onSubmit={handle_register}>
                <h1>Registration for Volunteer</h1>
                {registerErrors && (
                    <div className="form-alert mt-3" style={{color: "red", }}>
                        <i className="bx bx-error-circle"></i>
                        {registerErrors}
                    </div>
                )}
                <div className="input-box">
                    <input type="text" placeholder="Username" className={`form-control`} value={registerData.username} onChange={(e) => setRegisterData({...registerData, username: e.target.value
                    })} required />
                    <i className="bx bxs-user"></i> 
                </div>

                <div className="input-box">
                    <input type="email" placeholder="Email" className={`form-control`}
                      value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} required />
                    <i className="bx bxs-envelope"></i>
                </div>

                <div className="input-box">
                    <input type="password" placeholder="Password" className={`form-control`}value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})}required />
                    <i className="bx bxs-lock-alt"></i>
                </div>

                <div className="input-box">
                    <input type="password" placeholder="Confirm Password" className={`form-control`}value={registerData.confirmPassword} onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}required />
                    <i className="bx bxs-lock-alt"></i>
                </div>

                <div className="input-box">
                <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                    setRegisterData({ ...registerData, profile_image: e.target.files[0] })
                    }
                />
                </div>
                
                <div className="form-check mb-3">
                      <input className={`form-check-input`} type="checkbox" checked={registerData.agree} onChange={(e) => setRegisterData({...registerData, agree: e.target.checked})}
                      />

                      <label className="form-check-label" htmlFor="agree">
                        I agree to the <a href="#">Terms</a> and <a href="#">Privacy</a>.
                      </label>
                </div>
                <button type="submit" className="signup_btn">
                    Register
                </button>
                {/* <p>or register with social platforms</p>
                <div className="social-icons">
                    <a href="#"><i className="bx bxl-google"></i></a>
                    <a href="#"><i className="bx bxl-facebook"></i></a>
                    <a href="#"><i className="bx bxl-github"></i></a>
                    <a href="#"><i className="bx bxl-linkedin"></i></a>
                </div> */}
                </form>
            </div>

            {/* TOGGLE BOX */}
            <div className="toggle-box">
                <div className="toggle-panel toggle-left">
                <h1>Hello, Welcome!</h1>
                <p>Don't have an account?</p>
                <button className="signup_btn" onClick={() => setActive(true)}>
                    Register
                </button>
                </div>

                <div className="toggle-panel toggle-right">
                <h1>Welcome Back!</h1>
                <p>Already have an account?</p>
                <button className="signup_btn" onClick={() => setActive(false)}>
                    Login
                </button>
                </div>
            </div>
        </div>
    </div>
    </>

    
    
  );
}