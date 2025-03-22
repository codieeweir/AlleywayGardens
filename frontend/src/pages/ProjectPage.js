import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ProjectMap from "../components/ProjectMap";
import ImageUpload from "../components/ImageUpload";
import ProjectImages from "../components/ProjectImages";
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        messages: [...(prevProject.messages || []), messageData],
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

  return (
    <div className="project-page">
      <h1 className="project-title">{project.name}</h1>
      <p className="project-description">{project.description}</p>

      {/* Project Map */}
      <div className="project-map">
        <ProjectMap project={project} />
      </div>

      {/* Image Upload Section */}
      <div className="image-upload-section">
        <h3>Upload Project Image</h3>
        <ImageUpload contentType="project" objectId={id} />
        <ProjectImages projectId={project.id} />
      </div>

      {/* Chat Box Section */}
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

        {/* Message Input Form */}
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
