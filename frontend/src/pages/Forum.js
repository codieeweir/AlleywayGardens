import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import "./../styles/ProjectPage.css";

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
      <h2 className="mb-4">Community Forum</h2>

      {/* Create Post Button */}
      <Link to={`/create-post`}>
        <button className="btn btn-custom mb-4">Create A Post</button>
      </Link>

      {/* Forum Posts */}
      <div className="list-group">
        {posts.map((post) => {
          const user = users.find((user) => user.id === post.user);
          const timeago = formatDistanceToNow(new Date(post.created), {
            addSuffix: true,
          });
          return (
            <div key={post.id} className="list-group-item mb-3">
              <Link
                to={`/forum-post/${post.id}`}
                className="h4 text-decoration-none text-dark"
              >
                {post.title}
              </Link>
              <p>{post.body}</p>
              <h6>
                Posted by {user ? user.username : "Unknown"} - {timeago}
              </h6>
              <span className="badge bg-secondary">Zone</span>
              <h6 className="mt-2">
                <strong>Total Comments: {post.comments.length}</strong>
              </h6>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forum;
