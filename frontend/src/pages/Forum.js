import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

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
    <div>
      <h2>Community Forum</h2>

      <Link to={`/create-post`}>
        <button>Create A Post</button>
      </Link>

      <div>
        {posts.map((post) => {
          const user = users.find((user) => user.id === post.user);
          const timeago = formatDistanceToNow(new Date(post.created), {
            addSuffix: true,
          });
          return (
            <li key={post.id}>
              <Link to={`/forum-post/${post.id}`}>{post.title}</Link>
              <p>{post.body}</p>
              <h5>
                Posted by {user ? user.username : "Unknown"} - {timeago}{" "}
              </h5>
              <span>Zone</span>
              <h5>Total Comments: {post.comments.length} </h5>
              <button>Update Post</button>
              <hr />
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default Forum;
