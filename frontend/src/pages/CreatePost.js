import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const CreatePost = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  let { user } = useContext(AuthContext);
  const { authTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    user: user.user_id,
    project: null,
    zone: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://127.0.0.1:8000/api/posts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //Authorization: "Bearer your-token-here",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const postData = await response.json();

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("content_type", "post");
        formData.append("object_id", parseInt(postData.id));

        await fetch("http://127.0.0.1:8000/api/upload-image/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
          body: formData,
        });
      }
      navigate(`/forum-post/${postData.id}`);
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
        <label htmlFor="post-image">
          <input
            type="file"
            id="post-image"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
        </label>
        <button type="submit">Post on Forum</button>
      </form>
    </div>
  );
};

export default CreatePost;
