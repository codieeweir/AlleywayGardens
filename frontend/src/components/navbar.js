import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./../styles/Navbar.css";

const Navbar = () => {
  let { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand bold-header" to="/">
          Alleyway Gardens
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/forum">
                Forum
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/projects">
                Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/garden-hub">
                Garden Hub
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact Us
              </Link>
            </li>
            <li className="nav-item">
              {user ? (
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              ) : (
                ""
              )}
            </li>
            <li className="nav-item">
              {user ? (
                <button className="btn btn-outline-danger" onClick={logoutUser}>
                  Logout
                </button>
              ) : (
                <Link className="btn btn-outline-primary" to="/login">
                  Log in
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
