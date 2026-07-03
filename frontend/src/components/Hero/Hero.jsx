import "./Hero.css";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      {/* Left Side */}
      <div className="hero-text">
        <span className="tagline">
          ✨ AI Powered Learning Platform
        </span>

        <h1>
          Study Smarter.
          <br />
          Learn Faster.
        </h1>

        <p className="description">
          StudyVault is your all-in-one academic platform designed for students.
          Access quality notes, previous year question papers, AI-powered
          summaries, and collaborate with classmates—all from one modern
          workspace.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/notes")}
          >
            Explore Notes
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="hero-image">
        <div className="dashboard">
          <div className="dashboard-header">
            <h2>StudyVault</h2>

            <div className="profile">
              <span className="online"></span>
              Online
            </div>
          </div>

          {/* Card 1 */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/notes")}
            style={{ cursor: "pointer" }}
          >
            <div>
              <h3>📚 My Notes</h3>
              <p>245 Notes Available</p>
            </div>

            <span className="badge green">Open</span>
          </div>

          {/* Card 2 */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/ai")}
            style={{ cursor: "pointer" }}
          >
            <div>
              <h3>🤖 AI Assistant</h3>
              <p>Generate summaries instantly</p>
            </div>

            <span className="badge blue">Launch</span>
          </div>

          {/* Card 3 */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/pyqs")}
            style={{ cursor: "pointer" }}
          >
            <div>
              <h3>📄 PYQs</h3>
              <p>1200+ Previous Year Papers</p>
            </div>

            <span className="badge orange">Browse</span>
          </div>

          {/* Card 4 */}
          <div
            className="dashboard-card"
            onClick={() => navigate("/team")}
            style={{ cursor: "pointer" }}
          >
            <div>
              <h3>👥 Team Workspace</h3>
              <p>Collaborate with classmates</p>
            </div>

            <span className="badge purple">Open</span>
          </div>

          {/* Progress */}
          <div className="progress-section">
            <div className="progress-title">
              <span>Weekly Progress</span>
              <span>78%</span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </div>

        {/* Floating Cards */}

        <div
          className="floating-card card1"
          onClick={() => navigate("/notes")}
          style={{ cursor: "pointer" }}
        >
          <h3>10K+</h3>
          <p>Study Notes</p>
        </div>

        <div
          className="floating-card card2"
          onClick={() => navigate("/pyqs")}
          style={{ cursor: "pointer" }}
        >
          <h3>1200+</h3>
          <p>PYQs</p>
        </div>

        <div
          className="floating-card card3"
          onClick={() => navigate("/ai")}
          style={{ cursor: "pointer" }}
        >
          <h3>AI</h3>
          <p>Ask Anything</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;