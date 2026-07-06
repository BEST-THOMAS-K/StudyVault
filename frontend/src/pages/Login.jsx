import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let result;
    if (isLogin) {
      result = await login(username, password);
    } else {
      result = await register(username, email, password);
    }

    setLoading(false);

    if (result.success) {
      navigate("/notes");
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
        <p>
          {isLogin 
            ? "Login to continue to StudyVault" 
            : "Sign up to start your learning journey"}
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {!isLogin && (
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
          />

          <button type="submit" disabled={loading}>
            {loading 
              ? "Loading..." 
              : isLogin 
                ? "Login" 
                : "Sign Up"}
          </button>
        </form>

        <p className="signup-text">
          {isLogin 
            ? "Don't have an account? " 
            : "Already have an account? "}
          <span onClick={toggleMode}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;