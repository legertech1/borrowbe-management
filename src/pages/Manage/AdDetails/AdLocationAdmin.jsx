import React, { useEffect, useState } from "react";
import GenericCard from "../UserDetails/GenericCard";
import { ALL_PERMISSIONS_OBJ, userCan } from "../../../utils/rbac";
import { adLocationTypesExcluded } from "../../../utils/constants";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import parseAdressComponents from "../../../utils/parseAdressComponents";

export default function AdLocationAdmin({ ad, handleSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState({
    ...ad.location,
  });
  const [locationToSave, setLocationToSave] = useState({
    ...ad.location,
  });

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const payload = {
      ...ad,
      location: locationToSave,
    };
    handleSave(payload, () => {
      setIsEditing(false);
    });
  };

  useEffect(() => {
    location &&
      geocodeByAddress(location.description || location.name).then(
        async (results) => {
          const { lat, lng } = await getLatLng(results[0]);
          let address_components = parseAdressComponents(
            results[0].address_components
          );
          setLocationToSave({
            formatted_address: results[0].formatted_address,
            types: results[0].types,
            name: location.description || location.name,
            place_id: location.place_id,
            coordinates: {
              lat: lat,
              long: lng,
            },
            components: address_components,
          });
        }
      );
  }, [location]);

  return (
    <GenericCard
      title={"Ad Location : "}
      handleSave={handleSaveClick}
      isEditing={isEditing}
      handleCancelClick={handleCancelClick}
      handleEditClick={handleEditClick}
    >
      <div className="ad_loction">{"----Need chnaged---"}</div>
    </GenericCard>
  );
}
