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
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "75vh" }}
    >
      <div
        className="card shadow-md p-4 text-center mb-4"
        style={{ width: "100%", maxWidth: "800px", maxHeight: "600px" }}
      >
        <h3 className="text-center mb-4">Create a New Post</h3>
        <form onSubmit={handleSubmit}>
          <label>Post Title</label>
          <div className="mb-3">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Enter your text here... </label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="post-image">
              <input
                type="file"
                id="post-image"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
            </label>
          </div>
          <button type="submit">Post on Forum</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
