import React, { useState, useEffect } from "react";
import NavigateBack from "../route/navigate";
import "../../../src/AddStudent.css";

const AddStudent = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentData, setStudentData] = useState({
    studentNumber: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phoneNumber: "",
    email: "",
    program: "",
    favoriteTopic: "",
    strongestSkill: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchStudentsAndCourses = async () => {
      try {
        const studentsQuery = `
          query {
            getAllStudents {
              id
              studentNumber
              firstName
              lastName
              email
            }
          }
        `;
        const coursesQuery = `
          query {
            getAllCourses {
              id
              courseName
            }
          }
        `;

        const fetchGraphQL = async (query) => {
          const response = await fetch("http://localhost:5000/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const { data } = await response.json();
          return data;
        };

        const studentsData = await fetchGraphQL(studentsQuery);
        const coursesData = await fetchGraphQL(coursesQuery);

        setStudents(studentsData.getAllStudents);
        setCourses(coursesData.getAllCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndCourses();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  // Handle adding a student to a course
  const handleAddStudentToCourse = async (studentID) => {
    try {
      const mutation = `
        mutation {
          addStudentToCourse(courseId: "${selectedCourse}", studentId: "${studentID}") {
            id
            courseName
          }
        }
      `;

      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: mutation }),
      });

      if (!response.ok) {
        throw new Error("Failed to add student to course");
      }

      const result = await response.json();
      console.log("Student added to course:", result);

      setToastMessage("Student added to course successfully!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle creating a new student
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    const mutation = `
      mutation {
        createStudent(
          studentNumber: "${studentData.studentNumber}",
          password: "${studentData.password}",
          firstName: "${studentData.firstName}",
          lastName: "${studentData.lastName}",
          address: "${studentData.address}",
          city: "${studentData.city}",
          phoneNumber: "${studentData.phoneNumber}",
          email: "${studentData.email}",
          program: "${studentData.program}",
          favoriteTopic: "${studentData.favoriteTopic}",
          strongestSkill: "${studentData.strongestSkill}"
        ) {
          id
          studentNumber
        }
      }
    `;

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: mutation }),
      });

      if (!response.ok) {
        throw new Error("Failed to create student");
      }

      const result = await response.json();
      console.log("Student created:", result);

      setStudents((prevStudents) => [...prevStudents, result.data.createStudent]);
      setToastMessage("Student created successfully!");
      setTimeout(() => setToastMessage(""), 3000);

      // Clear form after successful submission
      setStudentData({
        studentNumber: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        phoneNumber: "",
        email: "",
        program: "",
        favoriteTopic: "",
        strongestSkill: ""
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <NavigateBack />
      <h2>Add a New Student</h2>
      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          {/* Student Creation Form */}
          <form onSubmit={handleCreateStudent} className="add-student-form">
            <input
              type="text"
              name="studentNumber"
              placeholder="Student Number"
              value={studentData.studentNumber}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={studentData.password}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={studentData.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={studentData.lastName}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={studentData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={studentData.address}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={studentData.city}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={studentData.phoneNumber}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="program"
              placeholder="Program"
              value={studentData.program}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="favoriteTopic"
              placeholder="Favorite Topic"
              value={studentData.favoriteTopic}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="strongestSkill"
              placeholder="Strongest Skill"
              value={studentData.strongestSkill}
              onChange={handleInputChange}
            />
            <button type="submit" className="btn">
              Add Student
            </button>
          </form>
        
          {toastMessage && <div className="toast">{toastMessage}</div>}
        </>
      )}
    </div>
  );
};

export default AddStudent;
