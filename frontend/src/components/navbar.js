import { Link } from "react-router-dom";
import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    <nav>
      <h1>My Forum</h1>
      {user && <h3> Hello {user.username} </h3>}
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/forum">Forum</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>
          {user ? (
            <Link onClick={logoutUser}>Logout</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
