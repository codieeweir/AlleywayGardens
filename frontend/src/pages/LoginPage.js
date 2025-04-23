import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const AuthPage = () => {
  const location = useLocation();
  const Params = new URLSearchParams(location.search);
  const activated = Params.get("activated");
  const error = Params.get("error");

  let { loginUser } = useContext(AuthContext);
  let navigate = useNavigate();
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow-md p-4 text-center mb-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <div>
          {activated && (
            <strong style={{ color: "green" }}>
              Your account has been activated!
              <p style={{ color: "grey" }}>Please log in below </p>
            </strong>
          )}
          {error && (
            <p style={{ color: "red" }}>
              There was an Error with your link, Please Register Again
            </p>
          )}
        </div>
        <form onSubmit={loginUser}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="form-control"
              placeholder="Enter Username"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              placeholder="Enter Password"
            />
          </div>
          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: "green", borderColor: "green" }}
            >
              Log In
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <p>
            Forgotten your password?
            <button
              className="btn btn-link p-0"
              onClick={() => navigate("/password-reset")}
            >
              Send Password Reset Link
            </button>
          </p>
          <p>
            Don't have an account?
            <button
              className="btn btn-link p-0"
              onClick={() => navigate("/register")}
            >
              Sign Up Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
