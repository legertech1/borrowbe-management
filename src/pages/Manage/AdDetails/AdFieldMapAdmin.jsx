import React, { useEffect, useState } from "react";
import GenericCard from "../UserDetails/GenericCard";
import Dropdown from "../../../components/Shared/Dropdown";
import { Checkbox, Input, Select } from "../ManageShared";
import { useSelector } from "react-redux";

export default function AdFieldMapAdmin({ ad, handleSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const categories = useSelector((state) => state.categories);
  const [categoryIndex, setCategoryIndex] = useState(-1);

  const [subCategoryIndex, setSubCategoryIndex] = useState(-1);

  const [editedAd, setEditedAd] = useState({ ...ad });

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedAd({
      ...ad,
    });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    const payload = {
      ...ad,
      extraFields: editedAd.extraFields,
    };
    handleSave(payload, () => {
      setIsEditing(false);
    });
  };

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
      title={"Extra Fields : "}
      handleSave={handleSaveClick}
      isEditing={isEditing}
      handleCancelClick={handleCancelClick}
      handleEditClick={handleEditClick}
    >
      <div>
        {editedAd.extraFields ? (
          <div className="field_map_cont">
            {categories[categoryIndex]?.fields?.map((field) => (
              <FieldMap
                disabled={isEditing ? false : true}
                field={field}
                state={editedAd}
                setState={(newState) => {
                  setEditedAd(newState);
                }}
              />
            ))}
            {categories[categoryIndex]?.subCategories[
              subCategoryIndex
            ]?.fields?.map((field) => (
              <FieldMap
                disabled={isEditing ? false : true}
                field={field}
                state={editedAd}
                setState={(newState) => {
                  setEditedAd(newState);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="center">No extra fields</div>
        )}
      </div>
    </GenericCard>
  );
}

const FieldMap = ({ field, state, setState, disabled }) => {
  return (
    <div className="mobile_field_container">
      {field.inputType == "text" && (
        <Input
          info={field.info}
          required={field.required}
          label={field.name}
          placeholder={field.placeholder}
          onChange={(e) =>
            setState({
              ...state,
              extraFields: {
                ...state.extraFields,
                [field.name]: e.target.value,
              },
            })
          }
          value={state.extraFields[field.name] || ""}
          type={"number"}
          disabled={disabled}
        />
      )}
      {field.inputType == "number" && (
        <Input
          info={field.info}
          required={field.required}
          label={field.name}
          placeholder={field.placeholder}
          onChange={(e) =>
            setState({
              ...state,
              extraFields: {
                ...state.extraFields,
                [field.name]: e.target.value,
              },
            })
          }
          value={state.extraFields[field.name] || ""}
          type={"text"}
          disabled={disabled}
        />
      )}
      {field.inputType == "dropdown" && (
        <Dropdown
          value={state.extraFields[field.name] || ""}
          onChange={(e) => {
            setState({
              ...state,
              extraFields: {
                ...state.extraFields,
                [field.name]: e.target.value,
              },
            });
          }}
          disabled={disabled}
        ></Dropdown>
      )}
      {field.inputType == "checkbox" && (
        <div className="checkbox_container">
          <Checkbox
            required={field.required}
            label={field.name}
            checked={state.extraFields[field.name] || false}
            onChange={(e) => {
              setState({
                ...state,
                extraFields: {
                  ...state.extraFields,
                  [field.name]: e.target.checked,
                },
              });
            }}
            disabled={disabled}
          ></Checkbox>
          <label className="mobile_input_label">{field.name}</label>
        </div>
      )}
      {field.inputType == "date" && (
        <Input
          info={field.info}
          required={field.required}
          placeholder={field.placeholder}
          onChange={(e) =>
            setState({
              ...state,
              extraFields: {
                ...state.extraFields,
                [field.name]: e.target.value,
              },
            })
          }
          value={state.extraFields[field.name] || ""}
          type={"date"}
          disabled={disabled}
        />
      )}
      {field.inputType == "radio" && (
        <>
          <label className="mobile_input_label">
            {field.name}
            {field.required && <span className="required"> *(Required)</span>}
          </label>
          <div className="options">
            {field.options?.map((option) => (
              <div
                className={
                  "radio_option " +
                  (state.extraFields[field.name] == option ? "active" : "")
                }
                onClick={() =>
                  !disabled &&
                  setState(
                    state.extraFields[field.name] == option
                      ? {
                          ...state,
                          extraFields: {
                            ...state.extraFields,
                            [field.name]: "",
                          },
                        }
                      : {
                          ...state,
                          extraFields: {
                            ...state.extraFields,
                            [field.name]: option,
                          },
                        }
                  )
                }
              >
                {option}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
