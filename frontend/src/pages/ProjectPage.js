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
import WeatherAverages from "../components/WeatherAverages";
import { formatDistanceToNow } from "date-fns";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const Projects = () => {
  let { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [participant, setParticipant] = useState("");
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
      navigate("/projects");
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
        Authorization: `Bearer ${authTokens?.access}`,
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
      setProject((prevProject) => ({
        ...prevProject,
        post: prevProject.post.filter((post) => post.id !== postID),
      }));
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
      const refresh = await fetch(`http://127.0.0.1:8000/api/projects/${id}/`);
      const updatedProject = await refresh.json();
      alert(`Welcome to ' ${project.name} ' `);
      console.log("Response:", updatedProject);
    } else {
      console.error(
        "Failed to update project participants",
        await response.json()
      );
    }
  };

  const deleteParticipants = async (user_id) => {
    const participantData = { participants: [user_id] };

    const response = await fetch(
      `http://127.0.0.1:8000/api/projects/update/${id}/`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(participantData),
      }
    );
    console.log(participantData);

    if (response.ok) {
      const refresh = await fetch(`http://127.0.0.1:8000/api/projects/${id}/`);
      const updatedProject = await refresh.json();
      alert(`You are no longer involved with '${project.name}' `);
      console.log("Response:", updatedProject);
    } else {
      console.error(
        "Failed to update project participants",
        await response.json()
      );
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h3>{project.name} </h3>
              <p>Hosted By @{project.user.username}</p>
              <p>{project.description}</p>
              <div className="mb-3">
                <ProjectMap project={project} />
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5>Project Images</h5>
              <ProjectImages projectId={project.id} showSingle={false} />
              {user?.user_id === project?.host && (
                <>
                  <ImageUpload contentType="project" objectId={project.id} />
                </>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5>Project Posts</h5>
              {project.post?.length > 0 ? (
                project.post.map((post) => (
                  <div key={post.id} className="border p-2 rounded mb-2">
                    {editingPostID === post.id ? (
                      <>
                        <textarea
                          value={editedPost.body}
                          onChange={(e) => setEditedPost(e.target.value)}
                          className="form-control mb-2"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control mb-2"
                          onChange={(e) => setSelectedImage(e.target.files[0])}
                        />
                        <ProjectPostImages PostId={post.id} />
                        <Button
                          onClick={() => handlePostEdit(post.id, post.body)}
                          variant="success"
                          className="me-2"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingPostID(null)}
                          variant="secondary"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <small className="text-muted">
                          Posted by {post.users.username}{" "}
                          {formatDistanceToNow(new Date(post.created), {
                            addSuffix: true,
                          })}
                        </small>
                        <p>{post.body}</p>
                        <ProjectPostImages PostId={post.id} />
                        {user?.user_id === post.users.id && (
                          <div className="mt-2">
                            <Button
                              onClick={() => handlePostDelete(post.id)}
                              variant="danger"
                              className="me-2"
                            >
                              Delete
                            </Button>
                            <Button
                              onClick={() => handlePostEdit(post.id, post.body)}
                              variant="warning"
                            >
                              Update
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p>No posts yet</p>
              )}
              {user?.user_id && (
                <Form onSubmit={handlePostSubmit} className="mt-3">
                  <Form.Group>
                    <Form.Label>Type your Post:</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="post-image" className="mt-2">
                    <Form.Label>Upload an Image:</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                  </Form.Group>
                  <Button type="submit" className="mt-2">
                    Send
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5>Project Participants</h5>
              {project.participants?.length > 0 ? (
                project.participants.map((ptp) => (
                  <p key={ptp.id}>
                    {" "}
                    <a href={`/profile/${ptp.id}`}>@{ptp.username}</a>
                  </p>
                ))
              ) : (
                <p>{project.host}</p>
              )}
              {user?.user_id && (
                <div>
                  {project.participants?.some(
                    (ptp) => ptp.id === user?.user_id
                  ) ? (
                    <Button
                      onClick={() => deleteParticipants(user.user_id)}
                      className="mt-2"
                      variant="danger"
                    >
                      Leave Project?
                    </Button>
                  ) : (
                    <Button
                      onClick={() => addParticipants(user.user_id)}
                      className="mt-2"
                      variant="success"
                    >
                      Join Project?
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5>Weather Metrics ☀️</h5>
              <WeatherMetrics project_id={project.id} />
            </Card.Body>
          </Card>

          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <WeatherAverages project_id={project.id} />
            </Card.Body>
          </Card>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h5>Project Chat Box</h5>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {project.message?.length > 0 ? (
                  project.message.map((msg) => (
                    <div key={msg.id} className="border p-2 rounded mb-2">
                      <bold className="text-muted">@{msg.users.username}</bold>
                      <small className="text-muted">
                        {" "}
                        {formatDistanceToNow(new Date(msg.created), {
                          addSuffix: true,
                        })}
                      </small>
                      <p>{msg.body}</p>

                      {user?.user_id === msg.users.id && (
                        <Button
                          onClick={() => handleMessageDelete(msg.id)}
                          variant="danger"
                          size="sm"
                          className="mt-2"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No messages yet</p>
                )}
              </div>
              {user?.user_id ? (
                <Form onSubmit={handleMessageSubmit} className="mt-3">
                  <Form.Group>
                    <Form.Label>Type your message:</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      required
                      rows="3"
                    />
                  </Form.Group>
                  <Button type="submit" className="mt-2">
                    Send
                  </Button>
                </Form>
              ) : (
                <h6>
                  {" "}
                  To Message, please <a href="/login"> Log in</a>{" "}
                </h6>
              )}
            </Card.Body>
          </Card>

          {user?.user_id === project.host && (
            <>
              <Link to={`/projects-update?id=${project.id}`}>
                <Button className="w-100 mb-2" variant="warning">
                  Update this Project
                </Button>
              </Link>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-100"
                variant="danger"
              >
                Delete Project
              </Button>
              <ConfirmModel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
              />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Projects;
