import React, { useState, useEffect, useCallback } from 'react';
import NavigateBack from '../route/navigate';

const ListStudentsInCourses = () => {
  const [courseID, setCourseID] = useState('');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState(null);

  // Fetch courses using GraphQL
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const query = `
          query {
            getAllCourses {
              id
              courseName
            }
          }
        `;
        const response = await fetch('http://localhost:5000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error('Error fetching courses');
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

  const handleChange = (e) => {
    setCourseID(e.target.value);
  };

  // Fetch students in a course using GraphQL
  const fetchStudents = useCallback(async () => {
    if (!courseID) return;

    setLoadingStudents(true);
    try {
      const query = `
        query {
          getCourseById(id: "${courseID}") {
            students {
              id
              studentNumber
              firstName
              lastName
            }
          }
        }
      `;
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const { data } = await response.json();
      setStudents(data.getCourseById.students);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStudents(false);
    }
  }, [courseID]);

  useEffect(() => {
    if (courseID) {
      fetchStudents();
    }
  }, [courseID, fetchStudents]);

  return (
    <div className="container">
      <NavigateBack />
      <h2>List Students in Course</h2>
      <div>
        <label>Course:</label>
        <select value={courseID} onChange={handleChange} disabled={loadingCourses}>
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.courseName}</option>
          ))}
        </select>
        <button onClick={fetchStudents} className="btn" disabled={loadingStudents || !courseID}>
          {loadingStudents ? 'Loading...' : 'Fetch Students'}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      <ul>
        {students.map(student => (
          <li key={student.id}>{student.studentNumber} - {student.firstName} {student.lastName}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListStudentsInCourses;
