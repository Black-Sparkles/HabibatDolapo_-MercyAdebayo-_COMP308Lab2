import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../src/App.css"; // Ensure you have this CSS file in the correct directory

const AdminSignUp = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const signUpData = {
      query: `
        mutation {
          createAdmin(adminEmail: "${adminEmail}", password: "${password}") {
            id
            adminEmail
          }
        }
      `,
    };

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Admin created successfully:", result);
        setLoading(false);
        navigate("/admin-login");
      } else {
        const error = await response.json();
        console.error("Error creating admin:", error);
        setLoading(false);
        setError(true);
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
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
          {loading ? <div className="loader"></div> : "Sign Up"}
        </button>
        {error && (
          <p className="error">Error creating account. Please try again.</p>
        )}
      </form>
      <p>
        <a href="/admin-login">Already have an account? Login here.</a>
      </p>
    </div>
  );
};

export default AdminSignUp;
