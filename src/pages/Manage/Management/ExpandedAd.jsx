import React from "react";
import "./ExpandedUser.css";
import { dateFormatter } from "../../../utils/helpers";

export default function ExpandedUser({ ad }) {
  return (
    <div className="expand-page">
      <div className="more_info">
        <p>
          <span>Business:</span> {ad?.business ? "Yes" : "No"}
        </p>
        <p>
          <span>Highlighted:</span> {ad.highlighted ? "Yes" : "No"}
        </p>
        <p>
          <span>HomepageGallery:</span> {ad.homepageGallery ? "Yes" : "No"}
        </p>
        <p>
          <span>Show Precise Location:</span>{" "}
          {ad.showPreciseLocation ? "Yes" : "No"}
        </p>

        <p>
          <span>Website:</span> {ad.website ? "Yes" : "No"}
        </p>
        <p>
          <span>Youtube:</span> {ad.youtube ? "Yes" : "No"}
        </p>
        <p>
          <span>Customer ID:</span>
          {ad?.customerID}
        </p>
      </div>

      {Boolean(ad?.tags?.length) && (
        <div className="tags">
          {ad?.tags?.map((tag, index) => {
            return (
              <span className="tag" key={index}>
                {tag},{" "}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
