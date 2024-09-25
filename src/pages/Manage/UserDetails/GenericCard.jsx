import React, { useState } from "react";
import { Button } from "../ManageShared";
import "./GenericCard.css";
import { Cancel, Close, Edit, Remove, Save } from "@mui/icons-material";

export default function GenericCard({
  hide,
  title,
  handleSave,
  children,
  isEditing,
  handleCancelClick,
  handleEditClick,
}) {
  return (
    <div className="manage_card">
      <div className="card_header">
        <div>
          <h1 className="title">{title}</h1>
        </div>
        {!hide && (
          <div>
            <div className="actions">
              {isEditing ? (
                <>
                  <Button
                    className="primary"
                    onClick={handleSave && handleSave}
                  >
                    <Save /> Save
                  </Button>
                  <Button
                    className="error"
                    onClick={handleCancelClick && handleCancelClick}
                  >
                    <Close /> Cancel
                  </Button>
                </>
              ) : (
                <Button
                  className="primary"
                  onClick={handleEditClick && handleEditClick}
                >
                  <Edit /> Edit
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
