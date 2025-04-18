import visibilityOff from "./assets/visibility_off.png";
import visibilityOn from "./assets/visibility_on.png";
import { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { loginUser } = useContext(UserContext);

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  function login(formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = storedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      setError("");
      loginUser(foundUser); // ✅ set user in context
    } else {
      setError("Invalid email or password");
    }
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
      <h1 style={styles.heading}>TechMart</h1>
      <h2 style={styles.subheading}>Welcome again</h2>

       
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(new FormData(e.target));
          }}
        >
          {error && <p style={styles.errorText}>{error}</p>}

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="login-email">
              Email address
            </label>
            <input
              style={styles.input}
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="login-password">
              Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                style={styles.passwordInput}
                type={visible ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                placeholder="************"
                onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" style={styles.submitButton}>
            Sign in
          </button>
        </form>
        <p style={styles.bottomText}>
          Don't have an account?
          <span style={styles.signUpLink} onClick={() => {
              navigate("/signup"); 
              window.location.reload();
          }

          }>
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;
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
    border: "1px solid #e5e7eb", // light gray border
    borderRadius: "8px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "0.25rem",
  },
  subheading: {
    fontSize: "1rem",
    fontWeight: "600",
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
    color: "#111827",
  },
  input: {
    width: "100%",
    padding: "0.6rem 0.75rem",
    fontSize: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#f9fafb",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordInput: {
    width: "100%",
    padding: "0.6rem 0.75rem",
    fontSize: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#f9fafb",
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
  bottomText: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  signUpLink: {
    marginLeft: "4px",
    textDecoration: "underline",
    color: "#1f1f1f",
    fontWeight: 500,
    cursor: "pointer",
  },
};
