import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import "boxicons/css/boxicons.min.css";
import Navbar from "./Navbar";


export default function LoginSignup() {
  const [active, setActive] = useState(false);
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
    confimPassword: "",
    agree: false,
  })

  useEffect(() => {
    setLoginData({ email: "", password: "" });
    setRegisterData({ username: "", email: "", password: "", confimPassword: "" });
  }, [active]);

  const [errors, setErrors] = useState({});


    const handle_register = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/users/register", {username: registerData.username, email: registerData.email, password: registerData.password})
            .then((res) => {
                const data = res.data;
                if(data.status) {
                    setAuth({role: "organiser", id: data.id});
                    nav("/")
                    // To remove
                    alert("Registration Success!")
                } else {
                    alert("Registration Failed!")
                }
            })
    }

    const handle_login = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/users/login", {email: loginData.email, password: loginData.password})
            .then((res) => {
                const data = res.data;
                if(data.status) {
                setAuth({role: "organiser", id: data.id, token: data.token});
                nav("/")
                // To remove
                alert("Login Success!")
            } else {
                alert("Login Failed!")
            }
        })
    }
  
  return (
    <>
    <Navbar/>
    <div className="body">
        <div className={`login_signup_container ${active ? "active" : ""}`}>
            {/* LOGIN FORM */}
            <div className="form-box login">
                <form onSubmit={handle_login}>
                <h1>Login for Organiser</h1>

                <div className="input-box">
                    <input type="email" placeholder="Email" className={`form-control ${errors.email ? "is-invalid" : ""}`} value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} required />
                    <i className="bx bxs-user"></i>
                </div>

                <div className="input-box">
                    <input type="password" placeholder="Password" required className={`form-control ${errors.password ? "is-invalid" : ""}`} value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
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
                
                {/* <p>or login with social platforms</p>
                <div className="social-icons">
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
                <h1>Registration for Organiser</h1>

                <div className="input-box">
                    <input type="text" placeholder="Username" className={`form-control ${errors.username ? "is-invalid" : ""}`} value={registerData.username} onChange={(e) => setRegisterData({...registerData, username: e.target.value
                    })} required />
                    <i className="bx bxs-user"></i> 
                </div>

                <div className="input-box">
                    <input type="email" placeholder="Email" className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} required />
                    <i className="bx bxs-envelope"></i>
                </div>

                <div className="input-box">
                    <input type="password" placeholder="Password" className={`form-control ${errors.password ? "is-invalid" : ""}`}value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})}required />
                    <i className="bx bxs-lock-alt"></i>
                </div>

                <div className="input-box">
                    <input type="password" placeholder="Confirm Password" className={`form-control ${errors.password ? "is-invalid" : ""}`}value={registerData.confimPassword} onChange={(e) => setRegisterData({...registerData, confimPassword: e.target.value})}required />
                    <i className="bx bxs-lock-alt"></i>
                </div>
                
                <div className="form-check mb-3">
                      <input className={`form-check-input ${errors.agree ? "is-invalid" : ""}`} type="checkbox" checked={registerData.agree} onChange={(e) => setRegisterData({...registerData, agree: e.target.checked})}
                      />

                      <label className="form-check-label" htmlFor="agree">
                        I agree to the <a href="#">Terms</a> and <a href="#">Privacy</a>.
                      </label>
                      {errors.agree && (
                        <div className="invalid-feedback d-block">{errors.agree}</div>
                      )}
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
