import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

const PostImages = ({ postId }) => {
  const [images, setImages] = useState([]);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/post-images/${postId}/`,
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
  }, [postId, authTokens]);

  return (
    <div>
      <h3>Post Images</h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {images.length > 0 ? (
          images.map((image) => (
            <img
              key={images.id}
              src={`http://127.0.0.1:8000${image.image}`}
              alt="Project"
              style={{
                width: "150px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          ))
        ) : (
          <p> No Images yet for this post. </p>
        )}
      </div>
    </div>
  );
};

export default PostImages;
