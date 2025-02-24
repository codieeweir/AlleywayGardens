import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const CreateComment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const post = searchParams.get("id");

  const [formData, setFormData] = useState({
    body: "",
    user: 2,
    post: post,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //Authorization: "Bearer your-token-here",
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
      <h1>Add a comment</h1>
      <form onSubmit={handleSubmit}>
        <label>Enter your text here... </label>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          required
        />
        <button type="submit">Comment on Post</button>
      </form>
    </div>
  );
};

export default CreateComment;
