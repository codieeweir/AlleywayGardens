import { useState } from "react";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/password-reset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setMessage(data.message);
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
              type="email"
              placeholder="Enter your email..."
              value={email}
              style={{ width: "100%" }}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>{" "}
          <button
            className="btn btn-success"
            type="submit"
            style={{ marginTop: "20px" }}
          >
            Send Reset Link
          </button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default PasswordReset;
