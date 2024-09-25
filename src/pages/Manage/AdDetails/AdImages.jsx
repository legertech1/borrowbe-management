import React, { useState } from "react";
import GenericCard from "../UserDetails/GenericCard";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function AdImages({ ad, handleSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [thumbs, setThumbs] = useState([...ad.thumbnails]);
  const [images, setImages] = useState([...ad.images]);

  const deleteImage = (index) => {
    const newImages = thumbs.filter((_, i) => i !== index);
    const newThumbs = images.filter((_, i) => i !== index);
    setImages(newImages);
    setThumbs(newImages);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const payload = {
      ...ad,
      images,
      thumbnails: thumbs,
    };
    handleSave(payload, () => {
      setIsEditing(false);
    });
  };

  return (
    <GenericCard
      title={"Ad Images : "}
      handleSave={handleSaveClick}
      isEditing={isEditing}
      handleCancelClick={handleCancelClick}
      handleEditClick={handleEditClick}
    >
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {thumbs.map((thumbnail, index) => (
          <div key={index} className="admin_image_cont">
            {isEditing && (
              <div
                onClick={() => deleteImage(index)}
                className="carousel_delete_icon"
              >
                <DeleteOutlineOutlinedIcon />
              </div>
            )}
            <img
              loading="eager"
              src={thumbnail ? thumbnail : "https://via.placeholder.com/150"}
              alt="thumbnail"
              style={{
                margin: "10px",
                minWidth: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "4px",
                boxShadow: "0px 0px 4px #1114",
              }}
            />
          </div>
        ))}
      </div>
    </GenericCard>
  );
}
