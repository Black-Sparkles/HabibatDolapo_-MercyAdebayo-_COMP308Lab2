import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavigateBack from "../route/navigate";

const UpdateCourse = () => {
  const { courseID } = useParams(); // Get the courseID from the URL
  const [course, setCourse] = useState({
    courseCode: "",
    courseName: "",
    section: "",
    semester: "",
  });
  const [loadingCourseDetails, setLoadingCourseDetails] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course details based on courseID
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/${courseID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCourseDetails(false);
      }
    };

    fetchCourseDetails();
  }, [courseID]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  // Handle form submission for updating the course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${courseID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(course),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update course");
      }
      alert("Course updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <NavigateBack />
      <h2>Update Course</h2>

      {loadingCourseDetails && <div>Loading course details...</div>}
      {error && <div className="error">{error}</div>}
      {!loadingCourseDetails && !error && (
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
      )}
    </div>
  );
};

export default UpdateCourse;
