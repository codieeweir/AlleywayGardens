import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./../styles/ProjectPage.css";
import ImageUpload from "../components/ImageUpload";
import UserImages from "../components/UserImages";

const Profile = () => {
  let { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/`)
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error("Error fetching projects :", error));

    fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/projects/`)
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects :", error));

    fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/comments/`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching projects :", error));

    fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/posts/`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching projects :", error));
  }, [user.user_id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header>
        <h3 className="text-center mb-4">
          <h3>
            {" "}
            Hello {user.firstname} {user.surname}{" "}
          </h3>
          <h3>@{user.username}</h3>
        </h3>
      </header>
      <div>
        <p>
          <UserImages user_id={user.user_id} /> Edit your profile picture
          <ImageUpload contentType="user" objectId={user.user_id} />
        </p>
        <Link to={`/profileInformation`} className="btn btn-primary">
          Edit profile information
        </Link>
      </div>
      <div className="projects">
        <div className="container">
          <h2 className="text-center mb-4">Project List</h2>
          <div className="row">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="col-md-4 mb-4">
                  <div className="card shadow-sm">
                    <img
                      src="https://via.placeholder.com/350x200"
                      className="card-img-top"
                      alt={project.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{project.name}</h5>
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
              <p>No projects yet</p>
            )}
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-center mb-4">Recent Activity</h2>
        <div className="row">
          {posts && posts.length > 0 ? (
            posts.map((posts) => (
              <div key={posts.id} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <p>
                      {user.firstname} posted in the community forum :{" "}
                      <Link
                        to={`/posts/${posts.id}`}
                        className="btn btn-primary"
                      >
                        {posts.title}
                      </Link>{" "}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No Posts yet</p>
          )}
        </div>
        <div className="row">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <p>
                      {user.firstname} commented on a post :{" "}
                      <b>{comment.body}</b>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No Comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
