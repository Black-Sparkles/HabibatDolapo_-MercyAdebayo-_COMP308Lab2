import React, { useEffect, useState } from 'react';
import NavigateBack from '../route/navigate';

const ShowCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        // Get token from local storage and decode it to get student ID
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const studentID = decodedToken.id;

        // GraphQL query to fetch enrolled courses for the student
        const query = `
          query {
            getEnrolledCourses(studentId: "${studentID}") {
              id
              courseCode
              courseName
              section
              semester
            }
          }
        `;

        const response = await fetch('http://localhost:5000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const { data } = await response.json();
        setCourses(data.getEnrolledCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <div className="container">
      <NavigateBack />
      <h2>Your Courses</h2>
      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <table className="course-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Section</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.courseCode}</td>
                <td>{course.courseName}</td>
                <td>{course.section}</td>
                <td>{course.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowCourses;
