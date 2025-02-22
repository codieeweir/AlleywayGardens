import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    user: 1,
    project: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your-token-here",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      navigate("/");
    } else {
      console.error("Failed to create post");
    }
  };

  return (
    <div>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <label>Post Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Enter your text here... </label>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          required
        />
        <button type="submit">Post on Forum</button>
      </form>
    </div>
  );
};

export default CreatePost;
