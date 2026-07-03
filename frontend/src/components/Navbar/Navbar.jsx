import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        Study<span>Vault</span>
      </div>

      <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">Features</a></li>
        <li><a href="#">Resources</a></li>
        <li><a href="#">About</a></li>
      </ul>

      <div className="nav-buttons">
        <button className="login">Login</button>
        <button className="cta">Get Started</button>
      </div>
    </nav>
  );
}

export default Navbar;