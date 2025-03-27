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
  const [project, setProject] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [newPost, setNewPost] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editedPost, setEditedPost] = useState({ body: "" });
  const [editingPostID, setEditingPostID] = useState(null);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/projects/${id}/`)
      .then((response) => response.json())
      .then((data) => setProject(data))
      .catch((error) => console.error("Error fetching projects :", error));
  }, [id]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    if (!authTokens?.access) {
      navigate("/login");
      return;
    }

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
      setProject((prevProject) => ({
        ...prevProject,
        message: [...(prevProject.message || []), messageData],
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

    if (!authTokens?.access) {
      navigate("/login");
      return;
    }

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

      setProject((prevProject) => ({
        ...prevProject,
        post: [...(prevProject.post || []), postData],
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

  const handlePostEdit = async (postId, originalBody) => {
    if (!editingPostID) {
      setEditingPostID(postId);
      setEditedPost({ body: originalBody });
      console.log(originalBody);
      return;
    }
    if (editedPost.body !== originalBody) {
      const response = await fetch(
        `http://127.0.0.1:8000/api/projectposts/${postId}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: editedPost,
            project: id,
            user: user.user_id,
          }),
        }
      );

      console.log({ body: editedPost, user_id: user.user_id });

      if (response.ok) {
        const updatedPost = await response.json();
        setProject((prevProject) => ({
          ...prevProject,
          post: prevProject.post.map((post) =>
            post.id === postId ? updatedPost : post
          ),
        }));
        setEditingPostID(null);
        setEditedPost("");
        setSelectedImage(null);
      } else {
        console.error("Failed to update post");
        console.log(editedPost.body);
        console.log("body:", originalBody);
      }
    }
    setEditingPostID(null);
    setEditedPost("");

    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("content_type", "projectpost");
      formData.append("object_id", parseInt(postId));

      await fetch("http://127.0.0.1:8000/api/upload-image/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
        body: formData,
      });
      setSelectedImage(null);
    }
  };

  const addParticipants = async (user_id) => {
    const participantData = { participants: [user_id] };

    const response = await fetch(
      `http://127.0.0.1:8000/api/projects/update/${id}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(participantData),
      }
    );
    console.log(participantData);

    if (response.ok) {
      const updatedProject = await response.json();
      console.log("Response:", updatedProject);
    } else {
      console.error(
        "Failed to update project participants",
        await response.json()
      );
    }
  };

  return (
    <div className="project-page">
      <h1 className="project-title">{project.name}</h1>
      <p className="project-description">{project.description}</p>
      <p></p>
      <div className="project-map">
        <ProjectMap project={project} />
      </div>

      <div className="image-upload-section">
        {user?.user_id === project?.host && (
          <>
            <h3>Upload Project Image</h3>
            <ImageUpload contentType="project" objectId={id} />
          </>
        )}
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
          <p>{project.host}</p>
        )}
        <button onClick={() => addParticipants(user.user_id)}>
          Join Project?
        </button>
      </div>

      <div className="chat-box-section">
        <h3>Project Chat Box</h3>
        <div className="chat-box">
          {project.message && project.message.length > 0 ? (
            project.message.map((msg) => (
              <div key={msg.id} className="chat-message">
                <p>{msg.body}</p>
                {user?.user_id && user.user_id === msg.user && (
                  <>
                    <button onClick={() => handleMessageDelete(msg.id)}>
                      Delete Message
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No messages yet</p>
          )}
        </div>

        <form onSubmit={handleMessageSubmit} className="chat-form">
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
                {editingPostID === post.id ? (
                  <>
                    <textarea
                      value={editedPost.body}
                      onChange={(e) => setEditedPost(e.target.value)}
                    />
                    <ProjectPostImages PostId={post.id} />
                    <label htmlFor="post-image">
                      <input
                        type="file"
                        id="post-image"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                      />
                    </label>
                    <button onClick={() => handlePostEdit(post.id, post.body)}>
                      Save
                    </button>
                    <button onClick={() => setEditingPostID(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>{post.body}</p>
                    <ProjectPostImages PostId={post.id} />
                    <p>Posted by {post.user.username}</p>
                    {user?.user_id && user.user_id === post.user && (
                      <>
                        <button onClick={() => handlePostDelete(post.id)}>
                          Delete Post
                        </button>
                        <button
                          onClick={() => handlePostEdit(post.id, post.body)}
                        >
                          Update Post
                        </button>
                      </>
                    )}
                  </>
                )}
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
      {user?.user_id && user.user_id === project.host && (
        <>
          <Link to={`/projects-update?id=${project.id}`}>
            <button>Update this Project?</button>
          </Link>
          <button onClick={() => setIsModalOpen(true)}>Delete Project</button>

          <ConfirmModel
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default Projects;
