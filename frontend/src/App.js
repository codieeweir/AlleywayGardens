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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<Projects />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/forum-post/:id" element={<ForumPost />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/create-comment" element={<CreateComment />} />
      </Routes>
    </Router>
  );
}

export default App;
