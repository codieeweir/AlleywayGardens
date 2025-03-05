import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectMap from "../components/ProjectMap";
import ImageUpload from "../components/ImageUpload";
import ProjectImages from "../components/ProjectImages";
import WeatherMetrics from "../components/WeatherMetrics";

const Projects = () => {
  const [project, setProjects] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const { id } = useParams();

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
        // Authorization: "Bearer your-token-here",
      },
      body: JSON.stringify({
        body: newMessage,
        project: id,
        user: 2,
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

  if (!project) return <h2>Loading...</h2>;

  return (
    <div>
      <h1> {project.name} </h1>
      <p>{project.description}</p>
      <ProjectMap project={project} />

      <h3> Upload Project Image?</h3>
      <ImageUpload contentType="project" objectId={id} />
      <ProjectImages projectId={project.id} />
      <ul>
        <h3>Project Chat Box </h3>
        {project.messages && project.messages.length > 0 ? (
          project.messages.map((msg) => <li key={msg.id}>{msg.body}</li>)
        ) : (
          <li>No messages yet</li>
        )}
      </ul>
      <form onSubmit={handleSubmit}>
        <label>Type message here...</label>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
        />
        <button type="submit"> Send Message </button>
      </form>
      <WeatherMetrics project_id={project.id} />
    </div>
  );
};

export default Projects;
