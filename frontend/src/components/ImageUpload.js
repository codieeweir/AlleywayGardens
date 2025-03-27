import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ImageUpload = ({ contentType, objectId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const { authTokens } = useContext(AuthContext);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    setUploading(true);

    if (!authTokens?.access) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("content_type", contentType);
    formData.append("object_id", parseInt(objectId));

    console.log([...formData.entries()]);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload-image/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("Image Uploaded Sucesssfully");
        setFile(null);
      } else {
        console.error("Upload Failed:", responseData);
        alert("Upload Failed");
      }
    } catch (error) {
      console.error("Error Uploading Image :", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading ..." : "Upload"}
      </button>
    </div>
  );
};

export default ImageUpload;
