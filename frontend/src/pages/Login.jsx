import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login Successful!");
    navigate("/notes");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p>Login to continue to StudyVault</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            required
          />

          <input
            type="password"
            placeholder="Password"
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

        <p className="signup-text">
          Don't have an account? <span>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;