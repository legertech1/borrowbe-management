import React from "react";
import ExpandedUser from "./ExpandedUser";
import ExpandedAd from "./ExpandedAd";

export default function ExpanededRow({ type, row }) {
  if (type === "User") {
    return <ExpandedUser type={"user"} user={row} />;
  }

  if (type === "Ad") {
    return <ExpandedAd type={"user"} ad={row} />;
  }

  return <div>ExpanededRow</div>;
}
