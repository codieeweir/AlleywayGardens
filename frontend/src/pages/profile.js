import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./../styles/ProjectPage.css";
import UserImages from "../components/UserImages";
import ProjectImagePreviews from "../components/ImagePreview";

const Profile = () => {
  let { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);

  // Use of the fk_views, pulling back data or each user

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/`)
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error("Error fetching Profile :", error));

    fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/projects/`)
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects :", error));

    fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/comments/`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching Comments :", error));

    fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/messages/`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error fetching Messages :", error));

    fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/posts/`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching Posts :", error));
  }, [user.user_id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <header className="text-center">
        <h3>
          Hello {profile.first_name} {profile.last_name}
        </h3>
        <h3>@{profile.username}</h3>
      </header>

      <div className="text-center mt-4">
        <UserImages user_id={user.user_id} />

        <div className="mt-3">
          <Link
            to={`/profileInformation?id=${user.user_id}`}
            className="btn btn-primary"
          >
            Edit profile information
          </Link>
        </div>
      </div>
      {/* Recent activit section  */}
      <div className="row mt-5 align-items-start">
        <div className="col-md-8">
          <h2 className="text-center mb-4">Project List</h2>
          <div className="projects">
            <div className="row">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.id} className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                      <ProjectImagePreviews projectId={project.id} />
                      <div className="card-body">
                        <strong className="project-title">
                          {project.name}
                        </strong>
                        <p className="card-text">{project.description}</p>
                        <Link
                          to={`/projects/${project.id}`}
                          className="btn btn-primary"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No projects yet</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h2 className="text-center mb-3">Recent Activity</h2>
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="mb-3">
                  <p className="m-0">
                    {profile.first_name} posted:{" "}
                    <Link
                      to={`/forum-post/${post.id}`}
                      className="btn btn-link p-0"
                    >
                      {post.title}
                    </Link>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center">No posts yet</p>
            )}

            <hr />
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="mb-3">
                  <p className="m-0">
                    {profile.first_name} commented:{" "}
                    <Link
                      to={`/forum-post/${comment.post}`}
                      className="btn btn-link p-0"
                    >
                      {comment.body}
                    </Link>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center">No comments yet</p>
            )}

            <hr />
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="mb-3">
                  <p className="m-0">
                    {profile.first_name} added message:
                    <Link
                      to={`/projects/${msg.project}`}
                      className="btn btn-link p-0"
                    >
                      {msg.body}
                    </Link>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
