import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Projects from "./pages/ProjectPage";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import CreateProject from "./pages/CreateProject";
import Forum from "./pages/Forum";
import Profile from "./pages/profile";
import ForumPost from "./pages/ForumPost";
import CreatePost from "./pages/CreatePost";
import CreateComment from "./pages/CreateComment";
import AuthPage from "./pages/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterUser";
import PasswordReset from "./pages/PasswordReset";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import ProjectsPage from "./pages/Projects";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  const isAuthenticated = true;

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/projects/:id" element={<Projects />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forum-post/:id" element={<ForumPost />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/create-comment" element={<CreateComment />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route
            path="/password-reset-confirm/:uid/:token"
            element={<PasswordResetConfirm />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
