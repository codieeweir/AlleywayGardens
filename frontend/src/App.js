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
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/forum-post/:id" element={<ForumPost />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/create-comment" element={<CreateComment />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
