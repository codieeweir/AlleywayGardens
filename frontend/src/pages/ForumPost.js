import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import PostImages from "../components/PostImages";
import ImageUpload from "../components/ImageUpload";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Button, Card, CardBody, FormLabel, Form } from "react-bootstrap";
import { Container, Row, Col, Tab, Tabs } from "react-bootstrap";

const ForumPost = () => {
  let { user } = useContext(AuthContext);
  const [post, setPost] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({ title: "", body: "" });

  const [newComment, setNewComment] = useState("");
  const [editingCommentID, setEditingCommentID] = useState(null);
  const [editedComment, setEditedComment] = useState({ body: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const { authTokens } = useContext(AuthContext);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [uploadImageId, setUploadImageId] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/posts/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
        setEditedPost({ title: data.title, body: data.body });
      })
      .catch((error) => console.error("Error fetching Posts :", error));
  }, [id]);

  const refreshImage = async (e) => {
    try {
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to refresh image:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authTokens?.access}` },
    });

    if (response.ok) {
      navigate("/forum");
    } else {
      console.error("Failed to delete post");
    }
  };

  const handleChange = async (e) => {
    setEditedPost({ ...editedPost, [e.target.name]: e.target.value });
    refreshImage();
  };

  // Experimental chaneg to how images are edited, if uploaded in edit mode it is added to model and displayed, if the user closes out
  // of the edit ode without cliking save, the image is then deleted (found in handleCancelEdit fucntion belwo this)
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("content_type", "post");
    formData.append("object_id", parseInt(id));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload-image/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
        body: formData,
      });

      if (response.ok) {
        const imageData = await response.json();
        console.log("Upload successful:", imageData);
        setUploadImageId(imageData.id);
        setRefreshTrigger((prev) => prev + 1);
      } else {
        console.error("Failed to update image");
      }
    } catch (err) {
      console.error("Upload Error", err);
    }
  };

  // If user has uploaded image then leaves edit mode witout saving, delete the added image'
  const handleCancelEdit = async (e) => {
    if (uploadImageId) {
      try {
        await fetch(
          `http://127.0.0.1:8000/api/delete-image/${uploadImageId}/`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${authTokens?.access}` },
          }
        );
        setUploadImageId(null);
        setRefreshTrigger((prev) => prev + 1);
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const updatedData = {
      title: editedPost.title,
      body: editedPost.body,
      user: post.user,
      project: post.project,
      zone: post.zone,
    };

    const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens?.access}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      setPost(updatedPost);
      setIsEditing(false);
      setSelectedImage(null);
    } else {
      console.error("Failed to update post");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!authTokens?.access) {
      navigate("/login");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens?.access}`,
      },
      body: JSON.stringify({
        body: newComment,
        post: id,
        user: user.user_id,
      }),
    });

    if (response.ok) {
      const commentData = await response.json();
      // append the comment list to immediatly update the page without a re-render
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...(prevPost.comments || []), commentData],
      }));
      setNewComment("");
    } else {
      console.error("Failed to post comment");
    }
  };

  const handleCommentEdit = async (commentID, originalBody) => {
    if (!editingCommentID) {
      setEditingCommentID(commentID);
      setEditedComment({ body: originalBody });
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:8000/api/comments/${commentID}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`,
        },
        body: JSON.stringify({
          body: editedComment,
          post: id,
          user: user.user_id,
        }),
      }
    );
    console.log({ body: editedComment, user_id: user.id });

    if (response.ok) {
      const updatedComment = await response.json();
      setPost((prevPost) => ({
        ...prevPost,
        comments: prevPost.comments.map((comment) =>
          comment.id === commentID ? updatedComment : comment
        ),
      }));
      setEditingCommentID(null);
      setEditedComment("");
    } else {
      console.error("Failed to update comment");
      console.log(editedComment);
    }
  };

  const handleCommentDelete = async (commentID) => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/comments/${commentID}/`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authTokens?.access}` },
      }
    );

    if (response.ok) {
      setPost((prevPost) => ({
        ...prevPost,
        comments: prevPost.comments.filter(
          (comment) => comment.id !== commentID
        ),
      }));
    } else {
      console.error("Failed to delete post");
    }
  };

  return (
    <div className="container mt-5">
      {/* Is it in editing mode? display as an input field, if not, just display the data appropriatly  */}
      {isEditing ? (
        <Card className="edit-post-form">
          <CardBody>
            <h2>Edit Post</h2>
            <Form.Group className="mb-3">
              <FormLabel>Title</FormLabel>
              <Form.Control
                type="text"
                name="title"
                value={editedPost.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <FormLabel>Your Post</FormLabel>
              <Form.Control
                type="text"
                name="body"
                value={editedPost.body}
                onChange={handleChange}
              />
            </Form.Group>
            <PostImages postId={post.id} key={refreshTrigger} />

            <Form.Group className="mb-3">
              <FormLabel
                htmlFor="post-image"
                className="bt btnisecondary btn-sm"
              >
                Upload Image
              </FormLabel>
              <Form.Control
                type="file"
                id="post-image"
                accept="image/*"
                className="d-none"
                onChange={handleImageChange}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button varient="primary" onClick={handleSave}>
                Save Changes
              </Button>
              <Button onClick={handleCancelEdit} varient="danger">
                Cancel
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        // No edit mode so disply as normal
        <Card className="mb-4 shadow-sm">
          <CardBody>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <PostImages postId={post.id} key={refreshTrigger} />
          </CardBody>
        </Card>
      )}

      <section className="comments-section my-5">
        <div className="mx-auto bg-light p-4 rounded shadow-sm">
          <h4 className="mb-3">Comments</h4>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((cmt) => {
              const timeago = formatDistanceToNow(new Date(cmt.created), {
                addSuffix: true,
              });
              // Make sure the comment isnt older than 5 mins and if it is, dont display edit
              const canEdit = timeago <= 5;

              return (
                <Card key={cmt.id} className="mb-3 shadow-sm">
                  <CardBody>
                    <div className="d-flex mb-2">
                      <strong>@{cmt.users.username}</strong> {"  "}
                      <small className="text-muted"> {timeago}</small>
                    </div>
                    {editingCommentID === cmt.id ? (
                      <>
                        <Form.Control
                          value={editedComment.body}
                          onChange={(e) => setEditedComment(e.target.value)}
                          className="mb-2"
                        />
                        <div className="d-felx gap-2">
                          <Button
                            onClick={() => handleCommentEdit(cmt.id)}
                            varient="primary"
                            size="sm"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditingCommentID(null)}
                            varient="secondary"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>{cmt.body}</p>
                        {user?.user_id === cmt.user && (
                          <div className="d-flex gap-2">
                            {canEdit && (
                              <Button
                                onClick={() =>
                                  handleCommentEdit(cmt.id, cmt.body)
                                }
                                variant="warning"
                                size="sm"
                              >
                                Edit
                              </Button>
                            )}{" "}
                            <button
                              onClick={() => handleCommentDelete(cmt.id)}
                              className="btn-close position-absolute top-0 end-0 m-2"
                              aria-label="Delete"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </CardBody>
                </Card>
              );
            })
          ) : (
            <p className="text-muted">No Comments Yet</p>
          )}
          {user?.user_id && (
            <CardBody style={{ maxWidth: "450px" }}>
              <p className="mb-3 bg-light">Comment on this post?</p>
              <Form onSubmit={handleCommentSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    style={{
                      resize: "none",
                      fontSize: "0.9rem",
                      maxHeight: "100px",
                    }}
                  />
                </Form.Group>
                <Button type="submit" variant="success">
                  Post Comment
                </Button>
              </Form>
            </CardBody>
          )}
        </div>
      </section>

      {user?.user_id && user.user_id === post.user && (
        <div className="mt-4 d-felx gap-2">
          <Button onClick={handleDelete} variant="danger">
            Delete Post
          </Button>
          <Button onClick={() => setIsEditing(true)} variant="warning">
            Edit Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForumPost;
