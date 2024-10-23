import React, { useState, useEffect, useCallback } from 'react';
import NavigateBack from '../route/navigate';

const ListStudentsInCourses = () => {
  const [courseID, setCourseID] = useState('');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');
        if (!response.ok) {
          throw new Error('Error fetching courses');
        }
        const data = await response.json();
        setCourses(data);
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

  const fetchStudents = useCallback(async () => {
    if (!courseID) return;
  
    setLoadingStudents(true);
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseID}/students`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data);
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
        <select value={courseID} onChange={handleChange}>
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>{course.courseName}</option>
          ))}
        </select>
        <button onClick={fetchStudents} className="btn" disabled={loadingStudents}>
          {loadingStudents ? 'Loading...' : 'Fetch Students'}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      <ul>
        {students.map(student => (
          <li key={student._id}>{student.studentNumber} - {student.firstName} {student.lastName}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListStudentsInCourses;
