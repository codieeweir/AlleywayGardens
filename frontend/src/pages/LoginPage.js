import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  let { loginUser } = useContext(AuthContext);
  let navigate = useNavigate();
  return (
    <div>
      <form onSubmit={loginUser}>
        <input type="text" name="username" placeholder="Enter Username" />
        <input type="password" name="password" placeholder="Enter Password" />
        <input type="submit" />
      </form>
      <p>
        Dont have an account?
        <button onClick={() => navigate("/register")}>Sign Up Now </button>
      </p>
    </div>
  );
};

export default AuthPage;
