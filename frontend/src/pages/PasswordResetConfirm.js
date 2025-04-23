import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `http://127.0.0.1:8000/api/password-reset-confirm/${uid}/${token}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "75vh" }}
    >
      <div
        className="card shadow-md p-4 text-center mb-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <strong className="text-center mb-4">Reset Your Password</strong>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="password"
              placeholder="Enter your new Password..."
              value={password}
              style={{ width: "100%" }}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="btn btn-success"
            type="submit"
            style={{ marginTop: "20px" }}
          >
            Reset Password
          </button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
