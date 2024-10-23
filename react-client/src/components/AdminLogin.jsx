import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../../src/App.css"; // Ensure you have this CSS file in the correct directory

const AdminLogin = ({ setIsAuthenticated, setUserRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const loginData = {
      query: `
        query {
          loginAdmin(adminEmail: "${email}", password: "${password}")
        }
      `,
    };

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Login successful:", result);
        setIsAuthenticated(true);
        setUserRole("admin");

        const token = result.data.loginAdmin; // Get the token from the response

        localStorage.setItem("token", token); // Save the token in local storage for session management

        setTimeout(() => {
          setLoading(false);
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            navigate("/admin-menu");
          }, 3000); // Time for which the toast is displayed
        }, 3000); // 3 seconds delay before the toast appears
      } else {
        const error = await response.json();
        console.error("Error logging in:", error);
        setLoading(false);
        setError(true);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? <div className="loader"></div> : "Login"}
        </button>
        {error && (
          <p className="error">Invalid credentials. Please try again.</p>
        )}
      </form>
      <p>
        <a href="/admin-signup">Don`t have an account? Sign up here.</a>
      </p>
      {showToast && <div className="toast">Login successful!</div>}
    </div>
  );
};

AdminLogin.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  setUserRole: PropTypes.func.isRequired,
};

export default AdminLogin;
