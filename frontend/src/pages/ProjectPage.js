import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ProjectMap from "../components/ProjectMap";
import ImageUpload from "../components/ImageUpload";
import ProjectImages from "../components/ProjectImages";
import ProjectPostImages from "../components/ProjectPostImages";
import WeatherMetrics from "../components/WeatherMetrics";
import "./../styles/ProjectPage.css";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ConfirmModel from "../components/ConfirmModel";

const Projects = () => {
  let { user } = useContext(AuthContext);
  const [project, setProjects] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [newPost, setNewPost] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/projects/${id}/`)
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects :", error));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const response = await fetch("http://127.0.0.1:8000/api/messages/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization:
      },
      body: JSON.stringify({
        body: newMessage,
        project: id,
        user: user.user_id,
      }),
    });

    if (response.ok) {
      const messageData = await response.json();
      setProjects((prevProject) => ({
        ...prevProject,
        messages: [...(prevProject.message || []), messageData],
      }));
      setNewMessage("");
    } else {
      console.error("Failed to send message");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `http://127.0.0.1:8000/api/projects/delete/${id}/`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      navigate("/");
    } else {
      console.error("Failed to delete project");
    }
  };

  if (!project) return <h2>Loading...</h2>;

  const handleMessageDelete = async (messageID) => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/messages/${messageID}/`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      navigate(`/projects/${id}`);
    } else {
      console.error("Failed to delete project");
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const response = await fetch("http://127.0.0.1:8000/api/projectposts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization:
      },
      body: JSON.stringify({
        body: newPost,
        project: id,
        user: user.user_id,
      }),
    });

    if (response.ok) {
      const postData = await response.json();

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("content_type", "projectpost");
        formData.append("object_id", parseInt(postData.id));

        await fetch("http://127.0.0.1:8000/api/upload-image/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
          body: formData,
        });
      }

      setProjects((prevProject) => ({
        ...prevProject,
        posts: [...(prevProject.post || []), postData],
      }));
      setNewPost("");
      setSelectedImage(null);
    } else {
      console.error("Failed to Post");
    }
  };

  const handlePostDelete = async (postID) => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/projectposts/${postID}/`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      navigate(`/projects/${id}`);
    } else {
      console.error("Failed to delete project");
    }
  };

  const followProjectSubmit = async (user_id) => {
    await fetch(`http://127.0.0.1:8000/api/projects/update/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authTokens?.access}`,
      },
    });
  };

  return (
    <div className="project-page">
      <h1 className="project-title">{project.name}</h1>
      <p className="project-description">{project.description}</p>

      <div className="project-map">
        <ProjectMap project={project} />
      </div>

      <div className="image-upload-section">
        <h3>Upload Project Image</h3>
        <ImageUpload contentType="project" objectId={id} />
        <ProjectImages projectId={project.id} />
      </div>

      <div className="chat-box">
        <h3>Project Participants</h3>
        {project.participants && project.participants.length > 0 ? (
          project.participants.map((ptp) => (
            <div key={ptp.id}>
              <p>{ptp.username}</p>
            </div>
          ))
        ) : (
          <p>No Participants yet</p>
        )}
        <button
          onClick={() => {
            followProjectSubmit(user.id);
          }}
        >
          Follow project
        </button>
      </div>

      <div className="chat-box-section">
        <h3>Project Chat Box</h3>
        <div className="chat-box">
          {project.message && project.message.length > 0 ? (
            project.message.map((msg) => (
              <div key={msg.id} className="chat-message">
                <p>{msg.body}</p>
                <button onClick={() => handleMessageDelete(msg.id)}>
                  Delete Message
                </button>
              </div>
            ))
          ) : (
            <p>No messages yet</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="chat-form">
          <label htmlFor="message-input">Type your message:</label>
          <textarea
            id="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            required
          />
          <button type="submit" className="send-message-button">
            Send
          </button>
        </form>
      </div>
      <div className="image-upload-section">
        <h3>Project Posts</h3>
        <div>
          {project.post && project.post.length > 0 ? (
            project.post.map((post) => (
              <div key={post.id} className="chat-message">
                <p>{post.body}</p>
                <ProjectPostImages PostId={post.id} />
                <button onClick={() => handlePostDelete(post.id)}>
                  Delete Post
                </button>
              </div>
            ))
          ) : (
            <p>No Posts yet</p>
          )}
        </div>

        <form onSubmit={handlePostSubmit}>
          <label htmlFor="post-input">
            Type your Post:
            <textarea
              id="post-input"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              required
            />
          </label>
          <label htmlFor="post-image">
            <input
              type="file"
              id="post-image"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </label>
          <button type="submit" className="send-message-button">
            Send
          </button>
        </form>
      </div>

      {/* Weather Metrics Section */}

      <div className="weather-metrics-section">
        {project.shape && project.shape.length > 0 ? (
          <WeatherMetrics project_id={project.id} />
        ) : (
          <p>No Weather data yet</p>
        )}
      </div>
      <Link to={`/projects-update?id=${project.id}`}>
        <button>Update this Project?</button>
      </Link>
      <button onClick={() => setIsModalOpen(true)}>Delete Project</button>

      <ConfirmModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Projects;
