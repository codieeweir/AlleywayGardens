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
    <div>
      <h2>Reset your password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter your new Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default PasswordResetConfirm;
