import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import "./../styles/ProjectPage.css";
import ForumPostPreviews from "../components/ForumImagesPreviews";

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/posts/")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching Posts :", error));

    fetch("http://127.0.0.1:8000/api/users/")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching User :", error));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Community Forum</h2>

      <div className="text-center mb-4">
        <Link to={`/create-post`}>
          <button className="btn btn-success btn-lg">Create A Post</button>
        </Link>
      </div>

      <div className="forum-box shadow-sm p-4">
        {posts.map((post) => {
          const user = users.find((user) => user.id === post.user);
          const timeago = formatDistanceToNow(new Date(post.created), {
            addSuffix: true,
          });
          return (
            <div
              key={post.id}
              style={{ backgroundColor: "#edf8f0" }}
              className="forum-post mb-4 p-3 border rounded position-relative"
            >
              <h5 className="mb-2">
                <Link
                  to={`/forum-post/${post.id}`}
                  className="text-dark text-decoration-none"
                >
                  {post.title}
                </Link>
              </h5>
              <p>
                Posted By{" "}
                <a href="/profile">{user ? user.username : "Unknown"} </a>
                <small className="text-muted time-stamp">{timeago}</small>
              </p>
              <div
                className="post-body shadow-sm p-4"
                style={{ backgroundColor: "#c5dacb" }}
              >
                <p>{post.body}</p>
                <ForumPostPreviews postId={post.id} />
              </div>

              <div className="mt-2">
                <strong>{post.comments.length} Comments</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forum;
