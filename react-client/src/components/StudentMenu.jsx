import React from "react";
import { Link } from "react-router-dom";
import "../../src/StudentMenu.css"; // Ensure correct import path

const StudentMenu = () => {
  return (
    <div className="menu-container">
      <h2>Student Menu</h2>
      <ul>
        <li>
          <Link to="/student/show-courses">Show Courses</Link>
        </li>
        <li>
          <Link to="/student/add-courses">Add Courses</Link>
        </li>
        <li>
          <Link to="/student/modify-courses">Modify Courses</Link>
        </li>
      </ul>
    </div>
  );
};

export default StudentMenu;
