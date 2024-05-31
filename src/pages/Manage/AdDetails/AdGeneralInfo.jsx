import React, { useEffect, useRef, useState } from "react";
import { Select, Input, TextArea } from "../ManageShared";
import GenericCard from "../UserDetails/GenericCard";
import { PriceOptions } from "../../../utils/constants";
import { useSelector } from "react-redux";
const statuses = ["active", "inactive", "expired", "paused"];

const tempAd = {
  title: "",
  description: "",
  meta: {
    category: "",
    subCategory: "",
    status: "",
    featured: "",
    highlighted: "",
    homePageGallery: "",
  },
  price: "",
  term: "",
  tags: "",
};

export default function AdGeneralInfo({ ad, handleSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAd, setEditedAd] = useState({ ...tempAd });
  const categories = useSelector((state) => state.categories);
  const [categoryIndex, setCategoryIndex] = useState(-1);
  const [subCategoryIndex, setSubCategoryIndex] = useState(-1);

  const inputRefs = {
    title: useRef(),
    description: useRef(),
    price: useRef(),
    term: useRef(),
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedAd({
      ...ad,
    });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedAd({ ...tempAd });
  };

  const saveData = (key, value) => {
    if (key.includes(".")) {
      const [parentKey, childKey] = key.split(".");
      setEditedAd({
        ...editedAd,
        [parentKey]: {
          ...editedAd[parentKey],
          [childKey]: value,
        },
      });
    } else {
      setEditedAd({
        ...editedAd,
        [key]: value,
      });
    }
  };

  const handleKeyPress = (event, field) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (field === "firstName") {
        inputRefs.lastName.current.focus();
      } else if (field === "lastName") {
        inputRefs.nickname.current.focus();
      } else if (field === "nickname") {
        inputRefs.verified.current.focus();
      } else if (field === "verified") {
        inputRefs.accountLocked.current.focus();
      } else if (field === "accountLocked") {
        inputRefs.authenticationRisk.current.focus();
      }
    }
  };

  const handleSaveClick = () => {
    handleSave(
      {
        ...ad,
        ...editedAd,
      },
      () => {
        setIsEditing(false);
      }
    );
  };

  function validateInput(input, fieldName) {
    const pattern = /^[a-zA-Z0-9\s]*$/;

    if (!input.trim()) {
      alert(`${fieldName} is required`);
      return false;
    }

    if (!pattern.test(input)) {
      alert(`${fieldName} cannot contain special characters`);
      return false;
    }

    return true;
  }

  useEffect(() => {
    ad &&
      categories &&
      categories.forEach((c, i) => {
        if (c.name == ad.meta.category) {
          setCategoryIndex(i);
          c.subCategories.forEach(
            (sc, i) => sc.name == ad.meta.subCategory && setSubCategoryIndex(i)
          );
        }
      });
  }, [categories, ad]);

  return (
    <GenericCard
      
      title={"Ad General Info : "}
      handleSave={handleSaveClick}
      isEditing={isEditing}
      handleCancelClick={handleCancelClick}
      handleEditClick={handleEditClick}
    >
      <div className="row">
        <div className="col">
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Listing ID:</label>
              <Input
                type="text"
                name="listingID"
                disabled
                value={editedAd.listingID}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Listing ID:</p>
              </div>
              <div className="value_col">{ad?.listingID}</div>
            </div>
          )}
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Title:</label>
              <Input
                type="text"
                name="title"
                value={editedAd.title}
                onChange={(e) => saveData("title", e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "title")}
                ref={inputRefs.title}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Title:</p>
              </div>
              <div className="value_col">{ad?.title}</div>
            </div>
          )}

          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Description:</label>
              <TextArea
                numRows={8}
                type="text"
                name="description"
                value={editedAd.description}
                onChange={(e) => saveData("description", e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "description")}
                ref={inputRefs.description}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Description:</p>
              </div>
              <div className="value_col">
                {ad?.description.length > 100
                  ? ad?.description.substring(0, 100) + "..."
                  : ad?.description}
              </div>
            </div>
          )}

          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Price:</label>
              <Input
                type="number"
                name="price"
                value={editedAd.price}
                onChange={(e) => saveData("price", e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "price")}
                ref={inputRefs.price}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Price:</p>
              </div>
              <div className="value_col">${ad?.price}</div>
            </div>
          )}
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Term:</label>
              <Select
                name="term"
                value={editedAd.term}
                onChange={(e) => {
                  saveData("term", e.target.value);
                }}
                ref={inputRefs.term}
                onKeyPress={(e) => handleKeyPress(e, "term")}
              >
                {PriceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Term:</p>
              </div>
              <div className="value_col">{ad?.term}</div>
            </div>
          )}
        </div>
        <div className="col">
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Status :</label>
              <Select
                name="status"
                value={editedAd?.meta?.status}
                onChange={(e) => {
                  saveData("meta.status", e.target.value);
                }}
                onKeyPress={(e) => handleKeyPress(e, "meta.status")}
              >
                {statuses.map((status, index) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Status :</p>
              </div>
              <div className="value_col">{ad?.meta?.status}</div>
            </div>
          )}

          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Category :</label>
              <Select
                name="category"
                value={editedAd?.meta?.category}
                onChange={(e) => {
                  saveData("meta.category", e.target.value);
                  setCategoryIndex(
                    categories.findIndex((c) => c.name === e.target.value)
                  );
                  setSubCategoryIndex(-1);
                }}
                ref={inputRefs.category}
                onKeyPress={(e) => handleKeyPress(e, "meta.category")}
              >
                {categories.map((category, index) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Category :</p>
              </div>
              <div className="value_col">{ad?.meta?.category}</div>
            </div>
          )}
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Sub Category :</label>
              <Select
                name="subCategory"
                value={editedAd?.meta?.subCategory}
                onChange={(e) => {
                  saveData("meta.subCategory", e.target.value);
                }}
                ref={inputRefs.category}
                onKeyPress={(e) => handleKeyPress(e, "meta.subCategory")}
              >
                {categories[categoryIndex]?.subCategories.map(
                  (subCategory, index) => (
                    <option key={subCategory.name} value={subCategory.name}>
                      {subCategory.name}
                    </option>
                  )
                )}
              </Select>
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Sub Category :</p>
              </div>
              <div className="value_col">{ad?.meta?.subCategory}</div>
            </div>
          )}

          {/* {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Profile Type:</label>
              <Select
                name="profileType"
                // value={profileType}
                // onChange={(e) => setProfileType(e.target.value)}
              >
                <option value="personal">Personal</option>
                <option value="premium">Premium</option>
              </Select>
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Profile Type:</p>
              </div>
              <div className="value_col">{"Personal"}</div>
            </div>
          )} */}
          {/* {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Date of Birth:</label>
              <Input
                type="date"
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Date of Birth:</p>
              </div>
              <div className="value_col">{user?.info?.dob}</div>
            </div>
          )} */}
        </div>
      </div>
    </GenericCard>
  );
}
