// src/Signup.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import visibilityOff from "./assets/visibility_off.png";
import visibilityOn from "./assets/visibility_on.png";
import { UserContext } from "./context/UserContext";

export default function Signup() {
  const { signupUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail]           = useState("");
  const [username, setUsername]     = useState("");
  const [password, setPassword]     = useState("");
  const [role, setRole]             = useState("Buyer");
  const [visible, setVisible]       = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const [valid, setValid]           = useState(false);

  const requirementsTemplate = [
    {
      text: "Password must be at least 8 characters long",
      check: (pwd) => pwd.length >= 8,
    },
    {
      text: "Password must include at least one lowercase letter",
      check: (pwd) => /[a-z]/.test(pwd),
    },
    {
      text: "Password must include at least one uppercase letter",
      check: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      text: "Password must include at least one digit",
      check: (pwd) => /\d/.test(pwd),
    },
    {
      text: "Password must include at least one special character",
      check: (pwd) => /[^A-Za-z0-9]/.test(pwd),
    },
  ];
  const [requirements, setRequirements] = useState(
    requirementsTemplate.map((r) => ({ ...r, isValid: false }))
  );

  // Validate email format
  const checkEmail = (value) => {
    setEmail(value);
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErrorEmail(pattern.test(value) ? "" : "Invalid email format");
  };

  // Keep the raw password (no spaces)
  const checkPassword = (value) => {
    setPassword(value.replace(/\s/g, ""));
  };

  // Update which password rules pass, and overall form validity
  useEffect(() => {
    const updated = requirementsTemplate.map((r) => ({
      text: r.text,
      check: r.check,
      isValid: r.check(password),
    }));
    setRequirements(updated);

    setValid(
      email &&
        !errorEmail &&
        username.trim() &&
        updated.every((r) => r.isValid)
    );
  }, [password, email, errorEmail, username]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!valid) {
      setErrorEmail("Please fix errors before signing up");
      return;
    }

    try {
      await signupUser({ email, password, username, role });

      // ← navigate immediately on success:
      if (role === "seller") {
        navigate("/seller/products");
      } else if (role === "admin") {
        navigate("/admin/accounts");
      } else {
        navigate("/main");
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setErrorEmail("Email already in use");
      } else {
        setErrorEmail(err.message);
      }
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>TechMart</h2>
        <form onSubmit={handleSignUp}>
          {errorEmail && <p style={styles.errorText}>{errorEmail}</p>}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => checkEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <small style={{ color: "#6b7280" }}>
              This is the name other users see
            </small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                style={styles.passwordInput}
                type={visible ? "text" : "password"}
                value={password}
                placeholder="********"
                onChange={(e) => checkPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                style={styles.visibilityButton}
              >
                <img
                  src={visible ? visibilityOn : visibilityOff}
                  alt="Toggle visibility"
                  style={styles.visibilityIcon}
                />
              </button>
            </div>
          </div>

          {password && (
            <ul style={styles.requirementList}>
              {requirements.map((req, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.4rem",
                    color: req.isValid ? "green" : "red",
                  }}
                >
                  <span
                    style={{ marginRight: "0.5rem", fontWeight: "bold" }}
                  >
                    {req.isValid ? "✓" : "✗"}
                  </span>
                  {req.text}
                </li>
              ))}
            </ul>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.input}
            >
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              opacity: valid ? 1 : 0.6,
              cursor: valid ? "pointer" : "not-allowed",
            }}
            disabled={!valid}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

// … (styles object remains exactly as you had it)

const styles = {
  pageWrapper: {
    backgroundColor: "#ffffff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "380px",
    padding: "2rem",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "0.25rem",
    color: "#1f1f1f",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: 500,
    fontSize: "0.95rem",
    color: "#1f1f1f",
  },
  input: {
    width: "100%",
    padding: "0.6rem 0.75rem",
    fontSize: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#f9fafb",
    color: "#1f1f1f",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordInput: {
    width: "100%",
    paddingRight: "3rem",
    padding: "0.6rem 0.75rem",
    fontSize: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#f9fafb",
    color: "#1f1f1f",
    boxSizing: "border-box",
  },
  visibilityButton: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
    margin: 0,
  },
  visibilityIcon: {
    width: "20px",
    height: "20px",
  },
  errorText: {
    color: "#b91c1c",
    fontSize: "0.875rem",
    margin: "0.25rem 0",
  },
  submitButton: {
    width: "100%",
    padding: "0.75rem",
    marginTop: "0.75rem",
    borderRadius: "6px",
    border: "none",
    fontSize: "1rem",
    fontWeight: 500,
    cursor: "pointer",
    color: "#ffffff",
    backgroundColor: "#1f1f1f",
    boxSizing: "border-box",
  },
  requirementList: {
    paddingLeft: "1rem",
    marginTop: "0.75rem",
    fontSize: "0.875rem",
    color: "#4a5568",
  },
};
