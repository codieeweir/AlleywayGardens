import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import placeholderImage from "../assets/placeholder-image.png";
import ImageEnlargeModal from "./ImageEnlargeModal";

const UserImages = ({ user_id }) => {
  const [images, setImages] = useState([]);
  const { authTokens } = useContext(AuthContext);
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
          `http://127.0.0.1:8000/api/user-images/${user_id}/`,
          {
            headers: {
              // Authorization: `Bearer ${authTokens?.access}`,
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
  }, [user_id]);

  return (
    <div>
      <div
        className="text-center mb-4"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {images.length > 0 ? (
          images.map((image) => (
            <img
              className="rounded-circle border img-fluid d-flex justify-content-center"
              key={images.id}
              src={`http://127.0.0.1:8000${image.image}`}
              alt="User"
              onClick={() => openModal(image.id)}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ))
        ) : (
          <img
            className="rounded-circle border img-fluid d-flex justify-content-center"
            src={placeholderImage}
            alt="Placeholder"
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
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

export default UserImages;
