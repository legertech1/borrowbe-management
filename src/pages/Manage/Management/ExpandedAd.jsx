import React from "react";
import "./ExpandedUser.css";
import { dateFormatter } from "../../../utils/helpers";

export default function ExpandedUser({ ad }) {
  return (
    <div className="expand-page">
      <div>
        <div className="expanded-user-details">
          <div className="user-address">
            <h2>Ad Details:</h2>
            <div className="user-detail">
              <p>
                <strong>Business:</strong> {ad?.business ? "Yes" : "No"}
              </p>
              <p>
                <strong>Highlighted:</strong> {ad.highlighted ? "Yes" : "No"}
              </p>
              <p>
                <strong>HomepageGallery:</strong>{" "}
                {ad.homepageGallery ? "Yes" : "No"}
              </p>
              <p>
                <strong>Show Precise Location:</strong>{" "}
                {ad.showPreciseLocation ? "Yes" : "No"}
              </p>
              <p>
                <strong>Created At:</strong> {dateFormatter(ad.createdAt)}
              </p>
            </div>
          </div>
          <div className="user-other-details">
            <h2>Other Details</h2>
            <div className="user-detail">
              <p>
                <strong>Website:</strong> {ad.website ? "Yes" : "No"}
              </p>
              <p>
                <strong>Youtube:</strong> {ad.youtube ? "Yes" : "No"}
              </p>
              <p>
                <strong>Tags:</strong>{" "}
                <span className="tags_cont">
                  {ad.tags.map((tag, index) => {
                    return (
                      <span className="tag" key={index}>
                        {tag},{" "}
                      </span>
                    );
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
