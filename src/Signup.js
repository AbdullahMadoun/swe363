import { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import visibilityOff from "./assets/visibility_off.png";
import visibilityOn from "./assets/visibility_on.png";
import { Route } from "react-router-dom";

function Signup() {
  const { loginUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Buyer");

  const [visible, setVisible] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const [valid, setValid] = useState(true);

  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  });

  const [requirements, setRequirements] = useState([
    {
      text: "Password must be at least 8 characters long",
      isValid: false,
      check: (pwd) => pwd.length >= 8,
    },
    {
      text: "Password must include at least one lowercase letter",
      isValid: false,
      check: (pwd) => /[a-z]/.test(pwd),
    },
    {
      text: "Password must include at least one uppercase letter",
      isValid: false,
      check: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      text: "Password must include at least one digit",
      isValid: false,
      check: (pwd) => /\d/.test(pwd),
    },
    {
      text: "Password must include at least one special character",
      isValid: false,
      check: (pwd) => /[^A-Za-z0-9]/.test(pwd),
    },
  ]);

  function checkEmail(string) {
    setEmail(string);
    const patternValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!patternValid.test(string)) {
      setErrorEmail("Invalid email format");
      setValid(false);
    } else if (users.some((user) => user.email === string)) {
      setErrorEmail("Email already in use");
      setValid(false);
    } else {
      setErrorEmail("");
      setValid(true);
    }
  }

  function checkPassword(string) {
    setPassword(string.replace(" ", ""));
  }

  useEffect(() => {
    const updatedRequirements = requirements.map((req) => ({
      ...req,
      isValid: req.check(password),
    }));
    setRequirements(updatedRequirements);
    setValid(updatedRequirements.every((req) => req.isValid));
  }, [password]);

  function signUp(e) {
    e.preventDefault();

    if (!valid) {
      setErrorEmail("Fix errors before signing up");
      return;
    }

    const newUser = { email, username, password, role };
    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    loginUser(newUser);
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>TechMart</h2>
        <form onSubmit={signUp}>
          {errorEmail && <p style={styles.errorText}>{errorEmail}</p>}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
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
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <small style={{ color: '#6b7280' }}>This is the name other users sees</small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                style={styles.passwordInput}
                type={visible ? "text" : "password"}
                name="password"
                value={password}
                placeholder="********"
                onChange={(e) => checkPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
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
                  <span style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
                    {req.isValid ? "✓" : "✗"}
                  </span>
                  <span>{req.text}</span>
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

          <button type="submit" style={styles.submitButton} disabled={!valid}>
            Sign In
          </button>
        </form>
      </div>
    </div>
   
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "#fff",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    width: "360px",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgb(0 0 0 / 10%)",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: 500,
    fontSize: "0.95rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordInput: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  visibilityButton: {
    position: "absolute",
    top: "50%",
    right: "8px",
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
    color: "#dc2626",
    fontSize: "0.875rem",
    margin: "0.25rem 0",
  },
  submitButton: {
    width: "100%",
    padding: "0.75rem",
    marginTop: "1rem",
    borderRadius: "4px",
    border: "none",
    fontSize: "1rem",
    fontWeight: 500,
    cursor: "pointer",
    color: "#fff",
    backgroundColor: "#111827",
    boxSizing: "border-box",
  },
};

export default Signup;