import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../src/StudentSignUp.css"; // Ensure the correct path to the CSS file

const StudentSignUp = () => {
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState("");
  const [favoriteTopic, setFavoriteTopic] = useState("");
  const [strongestSkill, setStrongestSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

const handleSignUp = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const studentData = {
    query: `
      mutation {
        createStudent(
          studentNumber: "${studentNumber}",
          password: "${password}",
          firstName: "${firstName}",
          lastName: "${lastName}",
          address: "${address}",
          city: "${city}",
          phoneNumber: "${phoneNumber}",
          email: "${email}",
          program: "${program}",
          favoriteTopic: "${favoriteTopic}",
          strongestSkill: "${strongestSkill}"
        ) {
          id
          studentNumber
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
      body: JSON.stringify(studentData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Student created successfully:", result);
      navigate("/student-login");
    } else {
      const errorData = await response.json();
      console.error("Error creating student:", errorData);
      const errorMessage = errorData.errors
        ? errorData.errors.map((err) => err.message).join(", ")
        : "Error creating student. Please try again.";
      setError(errorMessage);
    }
  } catch (error) {
    console.error("Error creating student:", error);
    setError("An error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-container">
      <h2>Student Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Student Number"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Program"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
        />
        <input
          type="text"
          placeholder="Favorite Topic"
          value={favoriteTopic}
          onChange={(e) => setFavoriteTopic(e.target.value)}
        />
        <input
          type="text"
          placeholder="Strongest Skill"
          value={strongestSkill}
          onChange={(e) => setStrongestSkill(e.target.value)}
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? <div className="loader"></div> : "Sign Up"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        <a href="/student-login">Already have an account? Login here.</a>
      </p>
    </div>
  );
};

export default StudentSignUp;
