import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import PostImages from "../components/PostImages";
import ImageUpload from "../components/ImageUpload";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

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
  const [imageRefreshTrigger, setImageRefreshTrigger] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/posts/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
        setEditedPost({ title: data.title, body: data.body });
      })
      .catch((error) => console.error("Error fetching Posts :", error));
  }, [id]);

  const handleDelete = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
      method: "DELETE",
    });

    if (response.ok) {
      navigate("/forum");
    } else {
      console.error("Failed to delete post");
    }
  };

  const handleChange = async (e) => {
    setEditedPost({ ...editedPost, [e.target.name]: e.target.value });
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("content_type", "post");
      formData.append("object_id", parseInt(id));

      await fetch("http://127.0.0.1:8000/api/upload-image/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
        body: formData,
      });
      setImageRefreshTrigger((prev) => !prev);
    }

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
        // Authorization:
      },
      body: JSON.stringify({
        body: newComment,
        post: id,
        user: user.user_id,
      }),
    });

    if (response.ok) {
      const commentData = await response.json();
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
        headers: { "Content-Type": "application/json" },
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
      {isEditing ? (
        <div className="edit-post-form">
          <h2>Edit Post</h2>
          <input
            type="text"
            name="title"
            className="form-control mb-3"
            value={editedPost.title}
            onChange={handleChange}
          />
          <textarea
            name="body"
            className="form-control mb-3"
            rows="6"
            value={editedPost.body}
            onChange={handleChange}
          />
          <PostImages postId={post.id} refreshTrigger={imageRefreshTrigger} />
          <div className="form-group mb-3">
            <label htmlFor="post-image" className="btn btn-secondary btn-sm">
              Upload Image
            </label>
            <input
              type="file"
              id="post-image"
              accept="image/*"
              className="d-none"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </div>
          <button onClick={handleSave} className="btn btn-primary mb-3">
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-danger mb-3"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="post-details mb-4">
          <h1 className="mb-3">{post.title}</h1>
          <p>{post.body}</p>
          <PostImages postId={post.id} refreshTrigger={imageRefreshTrigger} />
        </div>
      )}

      <div className="comments-section mt-4">
        <h4>Comments</h4>
        <div className="list-group">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((cmt) => {
              const createdAt = new Date(cmt.created);
              const timeLaspsed = (new Date() - createdAt) / (1000 * 60);
              const canEdit = timeLaspsed <= 5;

              return (
                <div
                  key={cmt.id}
                  className="list-group-item d-flex flex-column mb-3 p-3 border rounded"
                >
                  <div className="d-flex justify-content-between">
                    <strong className="font-weight-bold">
                      @{cmt.users.username}
                    </strong>
                    <small className="text-muted">
                      {timeLaspsed <= 60
                        ? `${Math.floor(timeLaspsed)} mins ago`
                        : `${Math.floor(timeLaspsed / 60)} hours ago`}
                    </small>
                  </div>
                  {editingCommentID === cmt.id ? (
                    <div className="edit-comment">
                      <textarea
                        value={editedComment.body}
                        onChange={(e) => setEditedComment(e.target.value)}
                        className="form-control mb-2"
                      />
                      <button
                        onClick={() => handleCommentEdit(cmt.id)}
                        className="btn btn-primary btn-sm mb-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommentID(null)}
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p>{cmt.body}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        {user.user_id === cmt.user && (
                          <div>
                            {canEdit && (
                              <button
                                onClick={() =>
                                  handleCommentEdit(cmt.id, cmt.body)
                                }
                                className="btn btn-warning btn-sm mr-2"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => handleCommentDelete(cmt.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-muted">No Comments Yet</p>
          )}
        </div>
      </div>

      {user?.user_id && (
        <div className="new-comment mt-4">
          <h6>Comment on this post?</h6>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              id="message-input"
              className="form-control mb-3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              rows="4"
              style={{ maxWidth: "500px", width: "100%", height: "30px" }}
            />
            <button type="submit" className="btn btn-success">
              Post Comment
            </button>
          </form>
        </div>
      )}

      {user?.user_id && user.user_id === post.user && (
        <div className="post-actions mt-4">
          <button onClick={handleDelete} className="btn btn-danger mr-2">
            Delete Post
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-warning"
          >
            Edit Post
          </button>
        </div>
      )}
    </div>
  );
};

export default ForumPost;
