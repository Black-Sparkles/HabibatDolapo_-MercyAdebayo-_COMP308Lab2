import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../../src/StudentLogin.css"; // Ensure the CSS file is in the correct directory

const StudentLogin = ({ setIsAuthenticated, setUserRole }) => {
  const [studentNumber, setStudentNumber] = useState("");
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
          loginStudent(studentNumber: "${studentNumber}", password: "${password}")
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

        // Store token in local storage
        localStorage.setItem("token", result.data.loginStudent);

        // Decode token to get user role and ID
        const decodedToken = JSON.parse(
          atob(result.data.loginStudent.split(".")[1])
        );
        setIsAuthenticated(true);
        setUserRole("student");

        setShowToast(true); // Show toaster notification

        setTimeout(() => {
          setLoading(false);
          navigate("/student-menu");
        }, 3000); // 3-second delay
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
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student Number:</label>
          <input
            type="text"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
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
        <a href="/student-signup">Don`t have an account? Sign up here.</a>
      </p>
      {showToast && <div className="toast">Login successful!</div>}
    </div>
  );
};

StudentLogin.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  setUserRole: PropTypes.func.isRequired,
};

export default StudentLogin;
