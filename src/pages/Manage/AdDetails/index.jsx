import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "../../../components/Loader";
import AdGeneralInfo from "./AdGeneralInfo";
import { ALL_PERMISSIONS_OBJ, userCan } from "../../../utils/rbac";
import apis from "../../../services/api";
import axios from "axios";
import AdImages from "./AdImages";
import { COLLECTIONS_NAMES } from "../Management/manageConfig";
import AdLocationAdmin from "./AdLocationAdmin";
import AdFieldMapAdmin from "./AdFieldMapAdmin";
import useConfirmDialog from "../../../hooks/useConfirmDialog";
import "../UserDetails/index.css";

const AdDetails = () => {
  const [loading, setLoading] = useState(false);
  const [ad, setAd] = useState(null);
  const confirm = useConfirmDialog();

  const handleSave = async (fields, cb) => {
    confirm.openDialog(
      "Are you sure you want to update?",
      async () => {
        try {
          setLoading(true);
          await axios.post(apis.manageUpdateItems, {
            ids: [ad._id],
            collectionName: COLLECTIONS_NAMES.AD,
            updates: {
              ...fields,
            },
          });
          fetchAd();
          setLoading(false);
          cb && cb();
        } catch (error) {
          setLoading(false);
          alert("Error updating items");
        }
      },
      () => {}
    );
  };

  const params = useParams();

  const fetchAd = async () => {
    try {
      setLoading(true);
      const adUrl = apis.manageGetUserAd + "/" + params.id;

      const response = await axios.get(adUrl);

      setAd(response.data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const init = async () => {
    await fetchAd();
  };

  useEffect(() => {
    if (params.id) {
      init();
    }
  }, [params.id]);

  return (
    <Spinner loading={loading}>
      <div className="manage_profile">
        <div className="user_profile">
          <div>
            <Link to="/">Back to home</Link>
          </div>
          {ad && <AdGeneralInfo ad={ad} handleSave={handleSave} />}
          {ad && <AdImages ad={ad} handleSave={handleSave} />}
          {ad && <AdLocationAdmin ad={ad} handleSave={handleSave} />}
          {ad && <AdFieldMapAdmin ad={ad} handleSave={handleSave} />}
        </div>
      </div>
    </Spinner>
  );
};

export default AdDetails;
