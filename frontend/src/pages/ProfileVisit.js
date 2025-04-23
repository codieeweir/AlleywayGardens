import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./../styles/ProjectPage.css";
import ImageUpload from "../components/ImageUpload";
import UserImages from "../components/UserImages";
import { useNavigate } from "react-router-dom";
import ProjectImagePreviews from "../components/ImagePreview";
import { useParams } from "react-router-dom";

const ProfileVisit = () => {
  let { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/users/${id}/`)
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error("Error fetching projects :", error));

    fetch(`http://127.0.0.1:8000/api/users/${id}/projects/`)
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects :", error));

    fetch(`http://127.0.0.1:8000/api/users/${id}/comments/`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching projects :", error));

    fetch(`http://127.0.0.1:8000/api/users/${id}/posts/`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching projects :", error));

    fetch(`http://127.0.0.1:8000/api/user-images/${id}/`)
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) => console.error("Error fetching projects :", error));
  }, [id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <header className="text-center">
        <h3>
          {profile.first_name} {profile.last_name}'s Profile
        </h3>
        <h3>@{profile.username}</h3>
      </header>

      <div className="text-center mt-4">
        <UserImages user_id={id} />
        <div className="mt-3"></div>
      </div>

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
                    <b className="text-muted">{comment.body}</b>
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

export default ProfileVisit;
