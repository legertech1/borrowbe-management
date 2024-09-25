import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import apis from "../../../services/api";
import GeneralInfo from "./GeneralInfo";
import "./index.css";
import GenericCard from "./GenericCard";
import AddressInfo from "./AddressInfo";
import ContactDetails from "./ContactDetails";
import {
  collections,
  COLLECTIONS_NAMES,
  prepareDataForTable,
  prepareSearchesData,
} from "../Management/manageConfig";
import GenericTable from "../Management/GenericTable";

const UserDetails = () => {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  const [ads, setAds] = useState([]);
  const [userAdsColumns, setUserAdsColumns] = useState([]);

  const [favtAds, setFavtAds] = useState([]);

  const [favtAdsColumns, setFavtAdsColumns] = useState([]);

  const [pagination, setPagination] = useState({
    totalResults: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const params = useParams();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apis.manageGetUser + params.id);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchFavoritesAds = async () => {
    try {
      const response = await axios.get(
        apis.manageGetUserFavtAds + "/" + params.id
      );

      let { rows, columns } = prepareDataForTable(response.data, "FavoriteAds");
      rows = rows.map((row) => {
        return {
          ...row,
          ...row.meta,
        };
      });

      setFavtAds(rows);
      setFavtAdsColumns(columns);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchAds = async (newPage = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(apis.manageSearch, {
        filters: {
          user: params.id,
        },
        count: 20,
        collectionName: COLLECTIONS_NAMES.AD,
        page: newPage,
      });

      let data = prepareDataForTable(response.data.data, COLLECTIONS_NAMES.AD);
      console.log(data);
      setAds(data.rows);
      setUserAdsColumns(data.columns);
      setLoading(false);
      setPagination(response.data.pagination);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSave = async (fields, cb) => {
    try {
      setLoading(true);
      await axios.post(apis.manageUpdateItems, {
        ids: [user._id],
        collectionName: COLLECTIONS_NAMES.USER,
        updates: {
          ...fields,
        },
      });
      fetchUser();
      setLoading(false);
      cb && cb();
    } catch (error) {
      setLoading(false);
      alert("Error updating items");
    }
  };

  const updateItems = async (ids, data, currentCollection) => {
    try {
      setLoading(true);
      await axios.post(apis.manageUpdateItems, {
        ids,
        collectionName: COLLECTIONS_NAMES.AD,
        updates: data,
      });
      await fetchAds();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Error updating items");
    }
  };

  const deleteItems = async (ids, collection, cb) => {
    if (collection === "FavoriteAds") {
      try {
        let updatedWishlist = user.data.wishlist.filter(
          (adId) => !ids.includes(adId)
        );

        setLoading(true);
        await axios.post(apis.manageUpdateItems, {
          ids,
          collectionName: COLLECTIONS_NAMES.USER,
          updates: {
            "data.wishlist": updatedWishlist,
          },
        });
        await fetchUser();
        await fetchFavoritesAds();
        cb && cb();
      } catch (error) {
        setLoading(false);
        alert("Error deleting items");
      }
    } else {
      try {
        setLoading(true);
        await axios.post(apis.manageDeleteItems, {
          ids,
          collectionName: collection,
        });
        fetchAds();
        cb && cb();
      } catch (error) {
        setLoading(false);
        alert("Error deleting items");
      }
    }
  };

  const init = async () => {
    await fetchUser();
    await fetchAds();
    await fetchFavoritesAds();
  };

  useEffect(() => {
    if (params.id) {
      init();
    }
  }, [params.id]);

  if (!user) {
    return null;
  }

  const handlePageChange = (newPage) => {
    fetchAds(newPage);
  };

  return (
    <div className="manage_profile">
      <div className="user_profile">
        <GenericCard
          hide={true}
          title={`Customer : ${user.firstName} ${user.lastName} / ${user.email} / ${user._id}`}
        ></GenericCard>
        <GeneralInfo user={user} handleSave={handleSave} />
        <AddressInfo user={user} handleSave={handleSave} />
        <ContactDetails user={user} handleSave={handleSave} />
        <GenericCard hide={true} title={`User's Listings:`}>
          <div className="table_cont">
            <GenericTable
              multiple={true}
              columns={userAdsColumns}
              data={ads}
              // pagination={{
              //   currentPage: 1,
              //   totalPages: 1,
              // }}
              pagination={pagination}
              onPageChange={handlePageChange}
              expand={false}
              hideAction={false}
              currentCollection={COLLECTIONS_NAMES.AD}
              updateItems={updateItems}
              deleteItems={deleteItems}
              curr={collections[1]}
            />
          </div>
        </GenericCard>
        <GenericCard hide={true} title={`My Favorite:`}>
          <div className="table_cont">
            <GenericTable
              multiple={true}
              columns={favtAdsColumns}
              data={favtAds}
              pagination={{
                currentPage: 1,
                totalPages: 1,
              }}
              expand={false}
              hideAction={false}
              currentCollection={"FavoriteAds"}
              updateItems={updateItems}
              deleteItems={deleteItems}
              curr={collections[1]}
            />
          </div>
        </GenericCard>
      </div>
    </div>
  );
};

export default UserDetails;
