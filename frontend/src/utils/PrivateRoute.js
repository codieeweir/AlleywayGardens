import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// logic inspired from https://www.youtube.com/watch?v=irbrtSs8Dpg

const PrivateRoute = () => {
  let { user } = useContext(AuthContext);
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
