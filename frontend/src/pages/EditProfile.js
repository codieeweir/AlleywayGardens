import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import jwtDecode from "jwt-decode";

const EditProfile = () => {
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { user, authTokens, updateToken } = useContext(AuthContext);

  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/`)
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
  }, [user.user_id]);

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

    const response = await fetch(
      `http://127.0.0.1:8000/api/users/${user.user_id}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    console.log(formData);

    if (response.ok) {
      navigate("/profile");
    } else {
      console.error("Failed to update profile");
    }
  };

  return (
    <div>
      <h1>Update Your Profile Information</h1>
      <form onSubmit={handleSubmit}>
        <label>Forename:</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />

        <label>
          Surname:
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Username:
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Profile Information</button>
      </form>
      <p>
        Change Your Password?
        <button
          className="btn btn-link p-0"
          onClick={() => navigate("/password-reset")}
        >
          Send Password Reset Link
        </button>
      </p>
    </div>
  );
};

export default EditProfile;
