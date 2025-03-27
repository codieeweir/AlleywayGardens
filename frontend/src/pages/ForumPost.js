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
    <div>
      {isEditing ? (
        <>
          <input
            type="text"
            name="title"
            value={editedPost.title}
            onChange={handleChange}
          />
          <textarea
            name="body"
            value={editedPost.body}
            onChange={handleChange}
          />
          <PostImages postId={post.id} refreshTrigger={imageRefreshTrigger} />
          <label htmlFor="post-image">
            <input
              type="file"
              id="post-image"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </label>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          <PostImages postId={post.id} refreshTrigger={imageRefreshTrigger} />
        </>
      )}
      <div className="chat-box">
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((cmt) => {
            const createdAt = new Date(cmt.created);
            const timeLaspsed = (new Date() - createdAt) / (1000 * 60);
            const canEdit = timeLaspsed <= 5;

            return (
              <div key={cmt.id}>
                <p>{cmt.user.username} </p>
                {editingCommentID === cmt.id ? (
                  <>
                    <textarea
                      value={editedComment.body}
                      onChange={(e) => setEditedComment(e.target.value)}
                    />
                    <button onClick={() => handleCommentEdit(cmt.id)}>
                      Save
                    </button>
                    <button onClick={() => setEditingCommentID(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p>{cmt.body}</p>
                    <div>
                      {user.user_id === cmt.user && (
                        <>
                          {canEdit && (
                            <button
                              onClick={() =>
                                handleCommentEdit(cmt.id, cmt.body)
                              }
                            >
                              Edit Comment
                            </button>
                          )}
                          <button onClick={() => handleCommentDelete(cmt.id)}>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p>No Comments Yet</p>
        )}
      </div>
      {user?.user_id && (
        <>
          <form onSubmit={handleCommentSubmit}>
            <label htmlFor="message-input">Type your Comment:</label>
            <textarea
              id="message-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit" className="send-message-button">
              Post
            </button>
          </form>
        </>
      )}
      {user?.user_id && user.user_id === post.user && (
        <>
          <button onClick={handleDelete}>Delete Post</button>
          <button onClick={() => setIsEditing(true)}>Edit Post</button>
        </>
      )}
    </div>
  );
};
export default ForumPost;
