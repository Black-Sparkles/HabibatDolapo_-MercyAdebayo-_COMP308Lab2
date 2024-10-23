import React, { useState, useEffect } from "react";
import NavigateBack from "../route/navigate";
import "../../../src/AddStudent.css";

const AddStudent = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
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
  

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

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
  
      // Show success toaster
      setToastMessage("Student added to course successfully!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <div className="container">
      <NavigateBack />
      <h2>All Students</h2>
      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <select
            value={selectedCourse}
            onChange={handleCourseChange}
            className="course-select"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>
          <table className="students-table">
            <thead>
              <tr>
                <th>Student Number</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.studentNumber}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.email}</td>
                  <td>
                    <button
                      onClick={() => handleAddStudentToCourse(student._id)}
                      className="btn"
                      disabled={!selectedCourse}
                    >
                      Add to Course
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {toastMessage && <div className="toast">{toastMessage}</div>}
        </>
      )}
    </div>
  );
};

export default AddStudent;
