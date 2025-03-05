import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import PostImages from "../components/PostImages";
import ImageUpload from "../components/ImageUpload";

const ForumPost = () => {
  const [post, setPost] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/posts/${id}/`)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching Posts :", error));
  }, [id]);

  return (
    <div>
      <h1> {post.title} </h1>
      <p>{post.body}</p>
      <ul>
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((cmt) => <li key={cmt.id}>{cmt.body}</li>)
        ) : (
          <li>No comments yet</li>
        )}

        <Link to={`/create-comment?id=${post.id}`}>
          <button>Comment on this post?</button>
        </Link>
        <PostImages postId={post.id} />
        <ImageUpload contentType="post" objectId={id} />
      </ul>
    </div>
  );
};

export default ForumPost;
