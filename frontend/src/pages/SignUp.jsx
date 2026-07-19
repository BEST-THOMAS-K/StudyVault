import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import "./SignUp.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth(); // Use 'register' from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await register(username, email, password);
      
      if (result.success) {
        // Registration and auto-login successful
        navigate("/");
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-background">
        <div className="signup-glow"></div>
      </div>

      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1>📚 StudyVault</h1>
            <h2>Create Account</h2>
            <p>Join thousands of students already learning</p>
          </div>

          {error && (
            <div className="signup-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="signup-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="signup-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="signup-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="signup-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="signup-btn"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;