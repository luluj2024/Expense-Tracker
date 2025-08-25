import React, { useEffect, useState } from "react";

const getPreferredTheme = () => {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const initial = getPreferredTheme();
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      style={{
        backgroundColor: "transparent",
        color: "var(--text-primary)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
        padding: "6px 10px",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
};

export default ThemeToggle;


