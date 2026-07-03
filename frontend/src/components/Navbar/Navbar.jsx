import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <Link to="/">StudyVault</Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/notes">Notes</Link>
        </li>

        <li>
          <Link to="/ai">AI Assistant</Link>
        </li>

        <li>
          <Link to="/pyqs">PYQs</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Get Started Button */}
      <Link to="/login" className="cta-btn">
        Get Started
      </Link>

    </nav>
  );
}

export default Navbar;