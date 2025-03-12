import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

const UserImages = ({ user_id }) => {
  const [images, setImages] = useState([]);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/user-images/${user_id}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [user_id, authTokens]);

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {images.length > 0 ? (
          images.map((image) => (
            <img
              key={images.id}
              src={`http://127.0.0.1:8000${image.image}`}
              alt="User"
              style={{
                width: "150px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          ))
        ) : (
          <p> No profile image yet for this user </p>
        )}
      </div>
    </div>
  );
};

export default UserImages;
