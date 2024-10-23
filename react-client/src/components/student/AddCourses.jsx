import React, { useState, useEffect } from "react";
import NavigateBack from "../route/navigate";
import "../../AddCourses.css"; 

const AddCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // GraphQL query to fetch all available courses
        const coursesQuery = `
          query {
            getAllCourses {
              id
              courseCode
              courseName
              section
              semester
            }
          }
        `;

        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: coursesQuery }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const { data } = await response.json();
        setCourses(data.getAllCourses);

        // Fetch student details from token
        const token = localStorage.getItem("token");
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const studentID = decodedToken.id;

        // GraphQL query to fetch enrolled courses
        const enrolledCoursesQuery = `
          query {
            getEnrolledCourses(studentId: "${studentID}") {
              id
            }
          }
        `;

        const enrolledResponse = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: enrolledCoursesQuery }),
        });

        if (!enrolledResponse.ok) {
          throw new Error("Failed to fetch enrolled courses");
        }

        const enrolledData = await enrolledResponse.json();
        setEnrolledCourses(enrolledData.data.getEnrolledCourses.map(course => course.id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = async (courseID) => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const studentID = decodedToken.id;

      // GraphQL mutation to add a course for the student
      const addCourseMutation = `
        mutation {
          addCourseToStudent(studentId: "${studentID}", courseId: "${courseID}") {
            id
          }
        }
      `;

      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: addCourseMutation }),
      });

      if (!response.ok) {
        throw new Error("Failed to add course");
      }

      const result = await response.json();
      console.log("Course added successfully:", result);

      // Update the enrolled courses state
      setEnrolledCourses([...enrolledCourses, courseID]);
      setToastMessage("Course added successfully!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Error adding course:", err.message);
    }
  };

  let content;

  if (loading) {
    content = <div className="loader"></div>;
  } else if (error) {
    content = <div className="error">{error}</div>;
  } else {
    content = (
      <>
        <table className="course-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Section</th>
              <th>Semester</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.courseCode}</td>
                <td>{course.courseName}</td>
                <td>{course.section}</td>
                <td>{course.semester}</td>
                <td>
                  {enrolledCourses.includes(course.id) ? (
                    <span>Enrolled</span>
                  ) : (
                    <button
                      className="btn"
                      onClick={() => handleAddCourse(course.id)}
                    >
                      Add Course
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {toastMessage && <div className="toast">{toastMessage}</div>}
      </>
    );
  }

  return (
    <div className="add-course-container">
      <NavigateBack />
      <h2>Add Course</h2>
      {content}
    </div>
  );
};

export default AddCourses;
