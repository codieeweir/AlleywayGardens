import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ActivatePage = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/activate/${uid}/${token}/`
      );
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate("/login");
      } else {
        alert("Activation failed: " + data.message);
      }
    };

    activateAccount();
  }, [uid, token, navigate]);

  return <div>Activating your account...</div>;
};

export default ActivatePage;
