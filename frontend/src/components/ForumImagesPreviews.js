import { useState, useEffect } from "react";
import ImageEnlargeModal from "./ImageEnlargeModal";

const ForumPostPreviews = ({ postId }) => {
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageID, setSelectedImageID] = useState(null);

  //  ## Gathering Images for Forum Posts

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
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [postId]);

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {images.length > 0
          ? images.map((image) => (
              <div key={image.id} style={{ position: "relative" }}>
                {/* Display specifics for the images */}
                <img
                  key={image.id}
                  src={`http://127.0.0.1:8000${image.image}`}
                  alt="Project"
                  onClick={() => openModal(image.id)}
                  style={{
                    width: "300px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            ))
          : ""}
      </div>
      <ImageEnlargeModal
        isOpen={isModalOpen}
        imageID={selectedImageID}
        onClose={closeModal}
      />
    </div>
  );
};

export default ForumPostPreviews;
