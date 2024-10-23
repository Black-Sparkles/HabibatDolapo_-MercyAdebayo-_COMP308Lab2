import React, { useEffect, useState } from 'react';
import NavigateBack from '../route/navigate';
import { useNavigate } from 'react-router-dom';

const ListAllCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses using GraphQL query
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const query = `
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
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Delete course using GraphQL mutation
  const handleDelete = async (courseID) => {
    try {
      const mutation = `
        mutation {
          deleteCourseById(id: "${courseID}")
        }
      `;

      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: mutation }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      const updatedCourses = courses.filter(course => course.id !== courseID);
      setCourses(updatedCourses);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleModify = (courseID) => {
    navigate(`/admin/update-courses/${courseID}`);
  };

  let content;

  if (loading) {
    content = <div>Loading...</div>;
  } else if (error) {
    content = <div className="error">{error}</div>;
  } else {
    content = (
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            {course.courseCode} - {course.courseName} - {course.section} - {course.semester}
            <button onClick={() => handleDelete(course.id)} className="btn btn-delete">
              Delete
            </button>
            <button onClick={() => handleModify(course.id)} className="btn btn-modify">
              Modify
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="container">
      <NavigateBack />
      <h2>All Courses</h2>
      {content}
    </div>
  );
};

export default ListAllCourses;
