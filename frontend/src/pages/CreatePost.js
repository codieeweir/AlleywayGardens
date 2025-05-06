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
        Authorization: `Bearer ${authTokens?.access}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const postData = await response.json();

      // Image upload component isnt used here to allow image upload with submit button so need to set it here if present
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
        className="card shadow p-4 text-center mb-4"
        style={{ width: "100%", maxWidth: "800px", maxHeight: "600px" }}
      >
        <h3 className="text-center mb-4">Create a New Post</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label">Post Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Enter your text here...</label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              className="form-control"
              rows="5"
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label" htmlFor="post-image">
              Upload an Image
            </label>
            <input
              type="file"
              id="post-image"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files[0])}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-success w-100 mt-3">
            Post on Forum
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
