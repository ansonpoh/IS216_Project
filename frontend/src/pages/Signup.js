import React, {useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const AuthPage = () => {

  const {setAuth} = useAuth();
  const nav = useNavigate();

  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });
  const [errors, setErrors] = useState({});

  const isSignup = mode === "signup";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const next = {};
    if (isSignup && !form.username.trim()) next.username = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (form.password.length < 6) next.password = "At least 6 characters.";
    if (isSignup && form.password !== form.confirm) next.confirm = "Passwords do not match.";
    if (isSignup && !form.agree) next.agree = "You must accept the Terms.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isSignup) {
      axios.post("http://localhost:3001/users/register", {username: form.username, email: form.email, password: form.password})
        .then((res) => {
          const data = res.data;
          if(data.status) {
            setAuth({role: "user", id: data.id});
            nav("/")
            // To remove
            alert("Registration Success!")
          } else {
            alert("Registration Failed!")
          }
        })
    } else {
      axios.post("http://localhost:3001/users/login", {email: form.email, password: form.password})
        .then((res) => {
          const data = res.data;
          console.log(data);
          if(data.status) {
            setAuth({role: "user", id: data.id, token: data.token});
            nav("/")
            // To remove
            alert("Login Success!")
          } else {
            alert("Login Failed!")
          }
        })
    }
  };

  return (
    <>
    <Navbar/>
      <div className="min-vh-100 d-flex align-items-center bg-body-secondary">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h1 className="h4 mb-0">
                    {isSignup ? "Create your account" : "Welcome back"}
                  </h1>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      setMode((m) => (m === "login" ? "signup" : "login"))
                    }
                  >
                    {isSignup ? "Have an account? Log in" : "New here? Sign up"}
                  </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {isSignup && (
                    <div className="mb-3">
                      <label className="form-label" htmlFor="username">
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        className={`form-control ${errors.username ? "is-invalid" : ""}`}
                        value={form.username}
                        onChange={handleChange}
                        placeholder="e.g. Alex Tan"
                        autoComplete="name"
                      />
                      {errors.username && (
                        <div className="invalid-feedback">{errors.username}</div>
                      )}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label" htmlFor="email">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete={isSignup ? "new-password" : "current-password"}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  {isSignup && (
                    <div className="mb-3">
                      <label className="form-label" htmlFor="confirm">
                        Confirm password
                      </label>
                      <input
                        id="confirm"
                        name="confirm"
                        type="password"
                        className={`form-control ${errors.confirm ? "is-invalid" : ""}`}
                        value={form.confirm}
                        onChange={handleChange}
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                      {errors.confirm && (
                        <div className="invalid-feedback">{errors.confirm}</div>
                      )}
                    </div>
                  )}

                  {isSignup ? (
                    <div className="form-check mb-3">
                      <input
                        className={`form-check-input ${errors.agree ? "is-invalid" : ""}`}
                        type="checkbox"
                        id="agree"
                        name="agree"
                        checked={form.agree}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="agree">
                        I agree to the <a href="#">Terms</a> and <a href="#">Privacy</a>.
                      </label>
                      {errors.agree && (
                        <div className="invalid-feedback d-block">{errors.agree}</div>
                      )}
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="remember" />
                        <label className="form-check-label" htmlFor="remember">
                          Remember me
                        </label>
                      </div>
                      <a href="#" className="small">Forgot password?</a>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary w-100">
                    {isSignup ? "Create account" : "Log in"}
                  </button>
                </form>

                <div className="text-center my-3">
                  <span className="text-secondary small">or</span>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={() => alert("Stub: Continue with Google")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-google me-2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.159 7.999v1.92h3.18c-.139.86-1.041 2.52-3.18 2.52-1.914 0-3.473-1.586-3.473-3.528s1.559-3.528 3.473-3.528c1.09 0 1.819.463 2.237.86l1.523-1.47C10.942 3.9 9.68 3.3 8.159 3.3 4.989 3.3 2.4 5.89 2.4 9.06s2.589 5.76 5.759 5.76c3.34 0 5.54-2.35 5.54-5.66 0-.38-.04-.67-.09-.96H8.159z"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="text-center text-secondary small mt-3 mb-0">
                  By continuing, you agree to our Terms and Privacy Policy.
                </p>
              </div>
            </div>

            <p className="text-center text-secondary small mt-3">
              © {new Date().getFullYear()} VolunteerConnect
            </p>
          </div>
        </div>
      </div>
    </div>
    </>

  );
};

export default AuthPage;
