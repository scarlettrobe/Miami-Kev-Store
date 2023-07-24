import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, Link } from "react-router-dom"; // Add Link import
import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    const validationErrors = {};
    if (!email) {
      validationErrors.email = "Email is required";
    }
    if (!password) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(Object.values(validationErrors));
    } else {
      const data = await dispatch(login(email, password));
      if (data) {
        setErrors(data);
      }
    }
  };

  const demo = async () => {
    const data = await dispatch(login('demo@aa.io', 'password'))
    if (data) {
      setErrors(data);
    }
  };

  const handleLogoClick = () => {
    history.push("/");
  };

   // ... code above remains the same ...

   return (
    <div className="l-container" id="login-page">
      <div className="l-top" id="top-section">
        <div className="l-logo-container" onClick={handleLogoClick} id="logo-section">
          <div className="l-logo-wrapper" id="logo-wrapper">
          </div>
          <div className="l-logo-text" id="logo-text"></div>
        </div>
      </div>
      <h1 className="l-input-title" id="login-title">Log In</h1>
      <form onSubmit={handleSubmit} className="l-form-wrapper" id="login-form">
        <ul id="l-error-list">
          {errors.map((error, idx) => (
            <li key={idx} className="l-error-message">{error}</li>
          ))}
        </ul>
        <div className="l-form-group" id="email-group">
          <input
            type="email"
            value={email}
            placeholder="Email"
            className="l-inputs" id="email-input"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="l-form-group" id="password-group">
          <input
            type="password"
            value={password}
            placeholder="Password"
            className="l-inputs" id="password-input"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="l-buttons" type="submit" id="login-button">
          Log In
        </button>
      </form>
      <div className="l-demo-wrapper" id="demo-button-wrapper">
        <button className="l-buttons" onClick={demo} id="demo-button">
          Demo User
        </button>
      </div>
      <div id="l-signup-link-container">
        <span id="signup-text">Don't have an account? </span>
        <Link to="/signup" id="l-signup-link">Sign Up</Link> 
      </div>
    </div>
  );

}

export default LoginFormPage;
