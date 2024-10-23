import React, { useState, useEffect } from "react";
import NavigateBack from "../route/navigate";

const ModifyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [course, setCourse] = useState({
    courseCode: "",
    courseName: "",
    section: "",
    semester: "",
  });
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingCourseDetails, setLoadingCourseDetails] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all courses for selection using GraphQL
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const query = `
          query {
            getAllCourses {
              id
              courseCode
              courseName
            }
          }
        `;

        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const { data } = await response.json();
        setCourses(data.getAllCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch course details when a course is selected using GraphQL
  useEffect(() => {
    if (selectedCourseId) {
      const fetchCourseDetails = async () => {
        setLoadingCourseDetails(true);
        try {
          const query = `
            query {
              getCourseById(id: "${selectedCourseId}") {
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
            body: JSON.stringify({ query }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch course details");
          }

          const { data } = await response.json();
          setCourse(data.getCourseById);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingCourseDetails(false);
        }
      };

      fetchCourseDetails();
    }
  }, [selectedCourseId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  // Handle form submission for updating the course using GraphQL mutation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const mutation = `
        mutation {
          updateCourseById(
            id: "${selectedCourseId}",
            courseCode: "${course.courseCode}",
            courseName: "${course.courseName}",
            section: "${course.section}",
            semester: "${course.semester}"
          ) {
            id
            courseCode
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
        throw new Error("Failed to update course");
      }

      alert("Course updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  let content;

  if (loadingCourses) {
    content = <div>Loading courses...</div>;
  } else if (error) {
    content = <div className="error">{error}</div>;
  } else {
    content = (
      <>
        <div>
          <label htmlFor="courseSelect">Select a course to update:</label>
          <select
            id="courseSelect"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseName} ({course.courseCode})
              </option>
            ))}
          </select>
        </div>

        {loadingCourseDetails ? (
          <div>Loading course details...</div>
        ) : (
          <>
            {selectedCourseId ? (
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="courseCode">Course Code:</label>
                  <input
                    id="courseCode"
                    type="text"
                    name="courseCode"
                    value={course.courseCode}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="courseName">Course Name:</label>
                  <input
                    id="courseName"
                    type="text"
                    name="courseName"
                    value={course.courseName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="section">Section:</label>
                  <input
                    id="section"
                    type="text"
                    name="section"
                    value={course.section}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="semester">Semester:</label>
                  <input
                    id="semester"
                    type="text"
                    name="semester"
                    value={course.semester}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit">Update Course</button>
              </form>
            ) : (
              <div>Please select a course to update.</div>
            )}
          </>
        )}
      </>
    );
  }

  return (
    <div className="container">
      <NavigateBack />
      <h2>Update Course</h2>
      {content}
    </div>
  );
};

export default ModifyCourses;
