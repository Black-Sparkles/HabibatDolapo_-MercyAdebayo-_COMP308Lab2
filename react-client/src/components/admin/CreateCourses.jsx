import React, { useState } from 'react';
import NavigateBack from '../route/navigate';

const CreateCourses = () => {
  const [course, setCourse] = useState({
    courseCode: '',
    courseName: '',
    section: '',
    semester: '',
    students: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    try {
      // Define GraphQL mutation
      const mutation = `
        mutation {
          createCourse(
            courseCode: "${course.courseCode}", 
            courseName: "${course.courseName}", 
            section: "${course.section}", 
            semester: "${course.semester}"
          ) {
            id
            courseCode
            courseName
            section
            semester
          }
        }
      `;

      // Make the fetch request to the GraphQL endpoint
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: mutation })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Course was created successfully:', result);
        setLoading(false);
        setSuccess(true);
        setCourse({
          courseCode: '',
          courseName: '',
          section: '',
          semester: '',
          students: []
        });
      } else {
        const error = await response.json();
        console.error('Error creating course:', error);
        setLoading(false);
        setError(true);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="container">
      <NavigateBack />
      <h2>Create Course</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course Code:</label>
          <input
            type="text"
            name="courseCode"
            value={course.courseCode}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Course Name:</label>
          <input
            type="text"
            name="courseName"
            value={course.courseName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Section:</label>
          <input
            type="text"
            name="section"
            value={course.section}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Semester:</label>
          <input
            type="text"
            name="semester"
            value={course.semester}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? <div className="loader"></div> : 'Create Course'}
        </button>
        {error && <p className="error">An error occurred while creating the course. Please try again.</p>}
        {success && <p className="success">Course created successfully!</p>}
      </form>
    </div>
  );
};

export default CreateCourses;
