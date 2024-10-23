import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

import AdminLogin from "./components/AdminLogin";
import AdminSignUp from "./components/AdminSignUp";
import StudentLogin from "./components/StudentLogin";
import StudentSignUp from "./components/StudentSignUp";
import AdminMenu from "./components/AdminMenu";
import StudentMenu from "./components/StudentMenu";
import AddStudent from "./components/admin/AddStudent";
import CreateCourses from "./components/admin/CreateCourses";
import ListAllCourses from "./components/admin/ListAllCourses";
import ListAllStudents from "./components/admin/ListAllStudents";
import ListStudentsInCourses from "./components/admin/ListStudentsInCourses";
import ShowCourses from "./components/student/ShowCourses";
import AddCourses from "./components/student/AddCourses";
import ModifyCourses from "./components/student/ModifyCourses";
import UpdateCourse from "./components/admin/UpdateCourse";
import Home from "./components/Home";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState(null); // 'admin' or 'student'

  return (
    <Router>
      <Navbar className="navbar" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Student Course Management System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/student-login">
                Student Login
              </Nav.Link>
              <Nav.Link as={Link} to="/admin-login">
                Admin Login
              </Nav.Link>
              <Nav.Link as={Link} to="/student-signup">
                Student Sign Up
              </Nav.Link>
              <Nav.Link as={Link} to="/admin-signup">
                Admin Sign Up
              </Nav.Link>
              <Nav.Link as={Link} to="/admin-menu">
                Admin Menu
              </Nav.Link>
              <Nav.Link as={Link} to="/student-menu">
                Student Menu
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="app">
        <Routes>
          <Route
            path="/admin-login"
            element={
              <AdminLogin
                setIsAuthenticated={setIsAuthenticated}
                setUserRole={setUserRole}
              />
            }
          />
          <Route
            path="/student-login"
            element={
              <StudentLogin
                setIsAuthenticated={setIsAuthenticated}
                setUserRole={setUserRole}
              />
            }
          />
          <Route path="/student-signup" element={<StudentSignUp />} />
          <Route path="/admin-signup" element={<AdminSignUp />} />
          <Route
            path="/admin-menu"
            element={
              isAuthenticated && userRole === "admin" ? (
                <AdminMenu />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/student-menu"
            element={
              isAuthenticated && userRole === "student" ? (
                <StudentMenu />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/add-student"
            element={
              isAuthenticated && userRole === "admin" ? (
                <AddStudent />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/create-courses"
            element={
              isAuthenticated && userRole === "admin" ? (
                <CreateCourses />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/list-all-courses"
            element={
              isAuthenticated && userRole === "admin" ? (
                <ListAllCourses />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/list-all-students"
            element={
              isAuthenticated && userRole === "admin" ? (
                <ListAllStudents />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/list-students-in-courses"
            element={
              isAuthenticated && userRole === "admin" ? (
                <ListStudentsInCourses />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/student/show-courses"
            element={
              isAuthenticated && userRole === "student" ? (
                <ShowCourses />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/student/add-courses"
            element={
              isAuthenticated && userRole === "student" ? (
                <AddCourses />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/student/modify-courses"
            element={
              isAuthenticated && userRole === "student" ? (
                <ModifyCourses />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/update-courses/:courseID"
            element={<UpdateCourse />}
          />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>

      <footer>
        <p>
          &copy; {new Date().getFullYear()} Student Course Management System.
          All rights reserved.
        </p>
      </footer>
    </Router>
  );
};

export default App;
