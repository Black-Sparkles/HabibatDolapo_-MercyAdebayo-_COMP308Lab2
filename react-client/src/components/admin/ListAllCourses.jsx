import React, { useEffect, useState } from 'react';
import NavigateBack from '../route/navigate';
import { useNavigate } from 'react-router-dom';

const ListAllCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseID) => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseID}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      const updatedCourses = courses.filter(course => course._id !== courseID);
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
          <li key={course._id}>
            {course.courseCode} - {course.courseName} - {course.section} - {course.semester}
            <button onClick={() => handleDelete(course._id)} className="btn btn-delete">
              Delete
            </button>
            <button onClick={() => handleModify(course._id)} className="btn btn-modify">
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

// import React, { useEffect, useState } from 'react';
// import NavigateBack from '../route/navigate';
// import ModifyCourses from "./components/student/ModifyCourses";
// import { useNavigate } from 'react-router-dom';

// const ListAllCourses = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/courses');
//         if (!response.ok) {
//           throw new Error('Error fetching courses');
//         }
//         const data = await response.json();
//         setCourses(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   const handleDelete = async (courseID) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/courses/${courseID}`, {
//         method: 'DELETE'
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete course');
//       }

//       const updatedCourses = courses.filter(course => course._id !== courseID);
//       setCourses(updatedCourses);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   let content;

//   if (loading) {
//     content = <div>Loading...</div>;
//   } else if (error) {
//     content = <div className="error">{error}</div>;
//   } else {
//     content = (
//       <ul>
//         {courses.map(course => (
//           <li key={course._id}>
//             {course.courseCode} - {course.courseName} - {course.section} - {course.semester}
//             <button onClick={() => handleDelete(course._id)} className="btn btn-delete">
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     );
//   }

//   return (
//     <div className="container">
//       <NavigateBack />
//       <h2>All Courses</h2>
//       {content}
//     </div>
//   );
// };

// export default ListAllCourses;
