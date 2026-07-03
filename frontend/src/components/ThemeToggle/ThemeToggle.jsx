import { useEffect, useState } from "react";
import "./ThemeToggle.css";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);
  }, [darkMode]);

  return (
    <button
      className={`theme-toggle ${darkMode ? "dark" : ""}`}
      onClick={() => setDarkMode(!darkMode)}
    >
      <div className="toggle-circle">
        {darkMode ? "🌙" : "☀️"}
      </div>
    </button>
  );
}

export default ThemeToggle;