import React from 'react';
import { Link } from 'react-router-dom';

const AdminMenu = () => {
  return (
    <div className="menu-container">
      <h2>Admin Menu</h2>
      <ul>
        <li><Link to="/admin/add-student">Add Student</Link></li>
        <li><Link to="/admin/create-courses">Create Courses</Link></li>
        <li><Link to="/admin/list-all-courses">List All Courses</Link></li>
        <li><Link to="/admin/list-all-students">List All Students</Link></li>
        <li><Link to="/admin/list-students-in-courses">List Students in Courses</Link></li>
      </ul>
    </div>
  );
};

export default AdminMenu;
