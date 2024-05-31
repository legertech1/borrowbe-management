import React, { useRef, useState } from "react";
import { Select, Input } from "../ManageShared";
import GenericCard from "./GenericCard";


const tempUser = {
  customerId: "",
  firstName: "",
  lastName: "",
  nickname: "",
  verified: false,
  accountLocked: false,

  authenticationRisk: 0,
};

export default function GeneralInfo({ user, handleSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...tempUser });
  const inputRefs = {
    firstName: useRef(),
    lastName: useRef(),
    nickname: useRef(),
    verified: useRef(),
    accountLocked: useRef(),
    authenticationRisk: useRef(),
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedUser({
      customerId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user?.info?.nickname || "",
      verified: user.verified,
      accountLocked: user.accountLocked,
      authenticationRisk: user.authenticationRisk,
    });
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

  const handleSaveClick = () => {
    if (validateInput(editedUser.firstName, "First Name")) {
      const payload = {
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        verified: editedUser.verified,
        accountLocked: editedUser.accountLocked,
        authenticationRisk: editedUser.authenticationRisk,
        info: {
          ...(user?.info || {}),
          nickname: editedUser.nickname,
        },
      };

      handleSave(payload, () => {
        setIsEditing(false);
      });
    }
  };
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedUser({ ...tempUser });
  };

  const saveData = (key, value) => {
    setEditedUser({ ...editedUser, [key]: value });
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

  return (
    <GenericCard

      title={"General Info : "}
      handleSave={handleSaveClick}
      isEditing={isEditing}
      handleCancelClick={handleCancelClick}
      handleEditClick={handleEditClick}
    >
      <div className="row">
        <div className="col">
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Customer Id:</label>
              <Input
                type="text"
                name="customerId"
                disabled
                value={editedUser.customerId}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Customer Number:</p>
              </div>
              <div className="value_col">{user?._id}</div>
            </div>
          )}
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">First Name:</label>
              <Input
                type="text"
                name="firstName"
                value={editedUser.firstName}
                onChange={(e) => saveData("firstName", e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "firstName")}
                ref={inputRefs.firstName}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">First Name:</p>
              </div>
              <div className="value_col">{user?.firstName}</div>
            </div>
          )}

          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Last Name:</label>
              <Input
                type="text"
                name="lastName"
                value={editedUser.lastName}
                onChange={(e) => saveData("lastName", e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "lastName")}
                ref={inputRefs.lastName}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Last Name:</p>
              </div>
              <div className="value_col">{user?.lastName}</div>
            </div>
          )}
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Nickname:</label>
              <Input
                type="text"
                name="nickname"
                value={editedUser.nickname}
                onChange={(e) => saveData("nickname", e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "nickname")}
                ref={inputRefs.nickname}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Nickname:</p>
              </div>
              <div className="value_col">{user?.info?.nickname}</div>
            </div>
          )}
        </div>
        <div className="col">
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Email Verified:</label>
              <Select
                name="verified"
                value={editedUser.verified}
                onChange={(e) => {
                  saveData("verified", e.target.value);
                }}
                ref={inputRefs.verified}
                onKeyPress={(e) => handleKeyPress(e, "verified")}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Email Verified:</p>
              </div>
              <div className="value_col">{user.verified ? "Yes" : "No"}</div>
            </div>
          )}

          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Account Locked:</label>
              <Select
                name="accountLocked"
                value={editedUser.accountLocked}
                onChange={(e) => {
                  saveData("accountLocked", e.target.value);
                }}
                ref={inputRefs.accountLocked}
                onKeyPress={(e) => handleKeyPress(e, "accountLocked")}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Account Locked:</p>
              </div>
              <div className="value_col">
                {user.accountLocked ? "Yes" : "No"}
              </div>
            </div>
          )}
          {isEditing ? (
            <div className="label_cont">
              <label className="label_heading">Authentication Risk:</label>
              <Input
                type="text"
                name="authenticationRisk"
                value={editedUser.authenticationRisk}
                onChange={(e) => saveData("authenticationRisk", e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "authenticationRisk")}
                ref={inputRefs.authenticationRisk}
              />
            </div>
          ) : (
            <div className="label_row">
              <div className="label_col">
                <p className="label_heading">Authentication Risk:</p>
              </div>
              <div className="value_col">{user?.authenticationRisk}</div>
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
