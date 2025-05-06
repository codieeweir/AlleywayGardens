import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import jwtDecode from "jwt-decode";
import ImageUpload from "../components/ImageUpload";
import UserImages from "../components/UserImages";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import ConfirmModel from "../components/ConfirmModel";

const EditProfile = () => {
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { user, authTokens, updateToken, logoutUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/`, {
      headers: { Authorization: `Bearer ${authTokens?.access}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || "",
        });
      })
      .catch((error) => console.error("Error fetching profile :", error));
    fetch(`http://127.0.0.1:8000/api/user-images/${user.user_id}/`, {
      headers: { Authorization: `Bearer ${authTokens?.access}` },
    })
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) => console.error("Error fetching Images :", error));
  }, [user.user_id]);

  const refreshImage = async (e) => {
    try {
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to refresh image:", error);
    }
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Patch reuest to change user details
    const response = await fetch(
      `http://127.0.0.1:8000/api/users/${user.user_id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens?.access}`,
        },
        body: JSON.stringify(formData),
      }
    );
    console.log(formData);

    if (response.ok) {
      alert("Your profile information has been updated");
      navigate(`/profile`);
    } else {
      console.error("Failed to update profile");
    }
  };

  const deleteUser = async (e) => {
    e.preventDefault();
    const user_id = user.user_id;
    const token = authTokens?.access;
    // ensuring the user is logged out before the profile is deleted to stop a
    // page error as they will be on the profile which requires authentication
    logoutUser();

    setTimeout(async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${user_id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Your profile information has been deleted");
      } else {
        console.error("Failed to delete profile");
      }
    });
  };

  const handleUpdate = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("content_type", "user");
    formData.append("object_id", parseInt(user.user_id));

    console.log([...formData.entries()]);

    // PUT request for the users image
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user-images/${user.user_id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        alert("Image Uploaded Sucesssfully");
        refreshImage();
        setFile(null);
      } else {
        console.error("Upload Failed:", responseData);
        alert("Upload Failed");
      }
    } catch (error) {
      console.error("Error Uploading Image :", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Update Your Profile Information</h1>
      <UserImages key={refreshTrigger} user_id={user.user_id} />

      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        {images.length > 0 ? (
          <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
            <label htmlFor="post-image" className="mb-0">
              <input
                type="file"
                id="post-image"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="form-control"
                style={{ display: "inline-block", width: "auto" }}
              />
            </label>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={uploading}
              className="btn btn-secondary"
            >
              {uploading ? "Updating..." : "Edit your profile picture"}
            </button>
          </div>
        ) : (
          <ImageUpload
            contentType="user"
            objectId={user.user_id}
            refreshImage={refreshImage}
          />
        )}
        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            Forename:
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="form-control"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Surname:
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="form-control"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-25 mt-3 d-flex justify-content-center mx-auto"
        >
          Update Profile Information
        </button>
      </form>

      <div className="text-center mt-4">
        <p>Change Your Password?</p>
        <button
          className="btn btn-link p-0"
          onClick={() => navigate("/password-reset")}
        >
          Send Password Reset Link
        </button>
      </div>
      <div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-danger w-25 mt-3 d-flex justify-content-center mx-auto"
          style={{ marginBottom: "50px" }}
          variant="danger"
        >
          Delete Profile
        </Button>
        <ConfirmModel
          isOpen={isModalOpen}
          modelType="User"
          onClose={() => setIsModalOpen(false)}
          onConfirm={deleteUser}
        />
      </div>
    </div>
  );
};

export default EditProfile;
