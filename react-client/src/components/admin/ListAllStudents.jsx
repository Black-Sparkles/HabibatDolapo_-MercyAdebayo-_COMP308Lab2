import React, { useEffect, useState } from 'react';
import NavigateBack from '../route/navigate';

const ListAllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students');
        if (!response.ok) {
          throw new Error('Error fetching students');
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="container">
      <NavigateBack />
      <h2>All Students</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <ul>
          {students.map(student => (
            <li key={student._id}>{student.studentNumber} - {student.firstName} {student.lastName}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListAllStudents;
