import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Eye, EyeOff, BookMarked } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      let result;

      if (isLogin) {
        result = await login(username, password);
      } else {
        result = await register(username, email, password);
      }

      if (result.success) {
        navigate("/notes");
      } else {
        setError(result.error || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setRemember(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo" aria-hidden="true">
          <BookMarked size={30} strokeWidth={2} />
        </div>
        <h1 className="login-title">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="login-subtitle">
          {isLogin
            ? "Login to continue to StudyVault"
            : "Sign up to start your learning journey"}
        </p>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <User size={18} className="input-icon" aria-hidden="true" />
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="input-wrap">
                <Mail size={18} className="input-icon" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <Lock size={18} className="input-icon" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={4}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <button type="button" className="forgot-password">
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading
              ? isLogin
                ? "Logging in..."
                : "Creating account..."
              : isLogin
              ? "Login"
              : "Create account"}
          </button>
        </form>

        <div className="login-divider">
          <span>or continue with</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-btn" disabled>
            <FcGoogle size={18} />
            Continue with Google
          </button>
          <button type="button" className="social-btn" disabled>
            <FaGithub size={18} />
            Continue with GitHub
          </button>
        </div>

        <p className="signup-text">
          {isLogin
            ? "Don't have an account? "
            : "Already have an account? "}
          <button type="button" className="link-button" onClick={toggleMode}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
