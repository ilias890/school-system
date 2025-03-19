import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.tsx";
import { FaSignOutAlt, FaHome, FaChalkboardTeacher, FaUserGraduate, FaUsers, FaBook } from 'react-icons/fa'; // Font Awesome Icons
import { BiLogIn } from 'react-icons/bi'; // Font Awesome Icons

const Sidebar: React.FC = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error: any) {
      console.error("Logout failed:", error.message);
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="sidebar bg-light p-3 vh-100 d-flex flex-column"
        style={{ width: "250px", position: "fixed" }}
      >
        <h4 className="fw-bold mb-4 text-black text-center">School</h4>
        
        {/* Menu lijst met flex-grow-1 zodat de knop naar beneden gaat */}
        <ul className="nav flex-column flex-grow-1">
          {!user ? (
            <li className="nav-item">
              <Link to="/" className="nav-link text-black">
                <BiLogIn className="me-2" /> Login
              </Link>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link text-black">
                  <FaHome className="me-2" /> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/students" className="nav-link text-black">
                  <FaUserGraduate className="me-2" /> Studenten
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/classes" className="nav-link text-black">
                  <FaChalkboardTeacher className="me-2" /> Klassen
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/lessons" className="nav-link text-black">
                  <FaBook className="me-2" /> Lessen
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/attendance" className="nav-link text-black">
                  <FaUserGraduate className="me-2" /> Aanwezigheid
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/teachers" className="nav-link text-black">
                  <FaUsers className="me-2" /> Docenten
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Uitloggen-knop onderaan */}
        {user && (
            <button
              className="btn btn-outline-danger btn-sm w-100"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" /> Uitloggen
            </button>
        )}
      </div>

      {/* Main content area */}
      <div className="content p-4" style={{ marginLeft: "250px", flex: 1 }}>
        {/* Voeg hier je hoofdinhoud toe */}
      </div>
    </div>
  );
};

export default Sidebar;
