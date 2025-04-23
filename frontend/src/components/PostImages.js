import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import ImageEnlargeModal from "./ImageEnlargeModal";

const PostImages = ({ postId, RefreshTrigger }) => {
  const [images, setImages] = useState([]);
  const { authTokens } = useContext(AuthContext);
  let { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageID, setSelectedImageID] = useState(null);

  const openModal = (imageID) => {
    setSelectedImageID(imageID);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageID(null);
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/post-images/${postId}/`,
          {
            headers: {},
          }
        );
        const data = await response.json();
        console.log("Fetched images:", data);
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [postId, RefreshTrigger]);

  const handleDelete = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image")) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/delete-image/${imageId}/`,
        {
          method: "DELETE",
          headers: {},
        }
      );

      if (response.ok) {
        setImages(images.filter((image) => image.id != imageId));
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      console.error("Error delete image", error);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image.id} style={{ position: "relative" }}>
              <img
                key={image.id}
                src={`http://127.0.0.1:8000${image.image}`}
                alt="Project"
                onClick={() => openModal(image.id)}
                style={{
                  width: "300px",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              />
              {user?.user_id && user.user_id === image.user && (
                <>
                  <button
                    onClick={() => handleDelete(image.id)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "rgba(39, 31, 31, 0.7)",
                      border: "none",
                      borderRadius: "50%",
                      padding: "5px 8px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    X
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p> No Images yet for this post. </p>
        )}
      </div>
      <ImageEnlargeModal
        isOpen={isModalOpen}
        imageID={selectedImageID}
        onClose={closeModal}
      />
    </div>
  );
};

export default PostImages;
