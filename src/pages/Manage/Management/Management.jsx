import React, { useEffect, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import axios from "axios";
import Dropdown from "../../../components/Shared/Dropdown";
// import Input from "../../../components/Shared/Input";
// import Button from "../../../components/Shared/Button";
import apis from "../../../services/api";
import "./Management.css";
import {
  COLLECTIONS_NAMES,
  allKeys,
  buildFilterQuery,
  collections,
  conditions,
  prepareDataForTable,
} from "./manageConfig";
import Spinner from "../../../components/Loader";
import GenericTable from "./GenericTable";
import { Select, Input, Button } from "../ManageShared";
import { Link } from "react-router-dom";
import Modal from "../../../components/Modal";
import AddUserForm from "../AddUserForm/index";
import { useSelector } from "react-redux";

function UserManagement() {
  const [filters, setFilters] = useState([]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const user = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(20);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    totalResults: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const [currentCollection, setCurrentCollection] = useState({
    label: "",
    key: "",
  });

  const setInitialFilters = () => {
    if (
      currentCollection.key === COLLECTIONS_NAMES.USER ||
      currentCollection.key === COLLECTIONS_NAMES.DELETED_USER
    ) {
      setFilters([
        {
          label: allKeys[collections[0].key][0].label,
          condition: conditions[0].label,
          value: "",
        },
        {
          label: allKeys[collections[0].key][1].label,
          condition: conditions[0].label,
          value: "",
        },
        {
          label: allKeys[collections[0].key][2].label,
          condition: conditions[0].label,
          value: "",
        },
        {
          label: allKeys[collections[0].key][3].label,
          condition: conditions[0].label,
          value: "",
        },
        // {
        //   label: allKeys[collections[0].key][4].label,
        //   condition: conditions[0].label,
        //   value: "",
        // },
      ]);
    }
  };

  useEffect(() => {
    if (currentCollection.key) {
      setInitialFilters();
      handleSearch();
    }
  }, [currentCollection.key]);

  useEffect(() => {
    setCurrentCollection(collections[0]);
  }, []);

  const handleSetCollection = (name) => {
    name = name || currentCollection.label;

    const collection = collections.find((item) => item.label === name);

    setCurrentCollection(collection);
    if (
      collection.key === COLLECTIONS_NAMES.USER ||
      collection.key === COLLECTIONS_NAMES.DELETED_USER
    ) {
      setInitialFilters();
    } else {
      setFilters([
        {
          label: allKeys[collection.key][0].label,
          condition: conditions[0].label,
          value: "",
        },
      ]);
    }
    reset();
  };

  const reset = () => {
    setRows([]);
    setColumns([]);
    setPagination({
      totalResults: 0,
      totalPages: 1,
      currentPage: 1,
    });
  };

  const setCondition = (index, value) => {
    const newFilters = [...filters];
    newFilters[index].condition = value;
    setFilters(newFilters);
  };

  const setFieldKey = (index, value) => {
    const newFilters = [...filters];
    newFilters[index].label = value;
    setFilters(newFilters);
  };

  const setInput = (index, value) => {
    const newFilters = [...filters];
    newFilters[index].value = value;
    setFilters(newFilters);
  };

  const prepareFilters = (f) => {
    let tempFilters = f || filters || [];
    const filteredArray = tempFilters.filter((filter) => filter.value !== "");
    const newFilteredArray = filteredArray.map((filter) => {
      const { label, condition, value } = filter;

      return {
        key: allKeys[currentCollection.key].find((k) => k.label === label).key,
        condition: conditions.find((c) => c.label === condition).key,
        value,
      };
    });

    return buildFilterQuery(newFilteredArray);
  };

  const addNewFilterRow = () => {
    const newFilters = [...filters];
    newFilters.push({
      label: allKeys[currentCollection.key][0].label,
      condition: conditions[0].label,
      value: "",
    });
    setFilters(newFilters);
  };

  const handleClearAll = () => {
    // empty filters
    // empty filters
    let emptyFilters = filters.map((f) => {
      return {
        ...f,
        value: "",
      };
    });
    setFilters(emptyFilters);
    handleSearch(1, emptyFilters);
  };

  const removeFilter = (index) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    handleSearch(newPage);
  };

  const handleSearch = async (newPage = 1, filters) => {
    try {
      // Clear the table
      // setRows([]);
      // setColumns([]);
      // setPagination({
      //   totalResults: 0,
      //   totalPages: 1,
      //   currentPage: newPage,
      // });
      setLoading(true);

      const filterQuery = prepareFilters(filters);

      const response = await axios.post(apis.manageSearch, {
        filters: filterQuery,
        count: Number(qty),
        collectionName: currentCollection.key,
        page: newPage,
      });

      const { data, pagination } = response.data;
      const { rows, columns } = prepareDataForTable(
        data,
        currentCollection.key
      );

      setPagination(pagination);
      setColumns(columns);

      setRows(rows);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Error searching data");
    }
  };

  const deleteItems = async (ids, collection, cb) => {
    try {
      setLoading(true);
      await axios.post(apis.manageDeleteItems, {
        ids,
        collectionName: currentCollection.key,
      });

      handleSearch();
      cb && cb();
    } catch (error) {
      setLoading(false);
      alert("Error deleting items");
    }
  };

  const updateItems = async (ids, data) => {
    try {
      setLoading(true);
      await axios.post(apis.manageUpdateItems, {
        ids,
        collectionName: currentCollection.key,
        updates: data,
      });
      handleSearch();
    } catch (error) {
      setLoading(false);
      alert("Error updating items");
    }
  };

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const updateLocations = async () => {
    // prompt user
    const confirm = window.confirm(
      "Are you sure you want to update locations in db?"
    );
    if (!confirm) return;

    try {
      await axios.post(apis.forceUpdateLocationInDB);
      //
      //
      // localStorage.setItem("locations", JSON.stringify(r.data));
    } catch (error) {}
  };

  return (
    <div className="global_mangement">
      <div className="main">
        <div className="header_row">
          <div>
            <Link to="/">Back to home</Link>
          </div>
          <div>
            <p>
              User: {user?.email} ({user?.accountType})
            </p>
          </div>
          <div>
            Select Collection:
            <Select
              value={currentCollection.label}
              onChange={(e) => handleSetCollection(e.target.value)}
              placeholder="Select Collection"
              style={{ width: "200px", marginLeft: "10px" }}
            >
              {collections.map((collection) => (
                <option key={collection.key} value={collection.label}>
                  {collection.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {currentCollection.key && (
          <div className="filter_section">
            {filters.length > 0 &&
              filters.map((filter, index) => (
                <div className="row" key={index}>
                  <div className="box1">
                    <Select
                      value={filter.label}
                      onChange={(e) => setFieldKey(index, e.target.value)}
                      placeholder="Select Filter"
                    >
                      {allKeys[currentCollection.key].map((k, i) => (
                        <option key={k.label + i} value={k.label}>
                          {k.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="box2">
                    <Select
                      value={filter.condition}
                      onChange={(e) => setCondition(index, e.target.value)}
                      placeholder="Select Condition"
                    >
                      {conditions.map((condition) => (
                        <option value={condition.label} key={condition.key}>
                          {condition.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="box3">
                    <Input
                      value={filter.value}
                      onChange={(e) => setInput(index, e.target.value)}
                      placeholder="Enter Value"
                      onKeyDown={handleEnterPress}
                    ></Input>
                  </div>
                  <div className="box4" onClick={() => removeFilter(index)}>
                    <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
                  </div>
                </div>
              ))}
            <div className="row">
              <div className="box1">
                <Button onClick={handleSearch} className="primary">
                  Search
                </Button>

                <Button onClick={handleClearAll} className="error">
                  Clear All
                </Button>
              </div>
              <div className="box2">
                <Button onClick={addNewFilterRow} className="secondary">
                  Add New Filter
                </Button>
                <Button
                  onClick={() => {
                    setShowAddUserModal(true);
                  }}
                  className="primary"
                >
                  Add User
                </Button>
                {/* <Button onClick={updateLocations} className="error">
                    Update Locations (Dangerous)
                  </Button> */}
                {/* <Button onClick={addDummyAds} className="error">
                    Add Dummy Ads
                  </Button> */}
              </div>
              <div className="box3 qty_cont">
                <div className="flex">
                  <label className="qty_label">Max Number of Results:</label>
                  <Input
                    value={qty}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (isNaN(val)) return;
                      if (val < 0) return;
                      if (val > 10000) return;

                      setQty(val);
                    }}
                    placeholder="Enter Value"
                    onKeyDown={handleEnterPress}
                    type="number"
                  ></Input>
                </div>
                <span>
                  Showing {rows.length} of {pagination.totalResults}{" "}
                </span>
              </div>
              <div className="box4"></div>
            </div>
          </div>
        )}
        <div className="table_cont">
          {rows.length === 0 ? (
            <div>No record found</div>
          ) : (
            <GenericTable
              multiple={true}
              expand={true}
              columns={columns}
              data={rows}
              pagination={pagination}
              onPageChange={handlePageChange}
              currentCollection={currentCollection.key}
              deleteItems={deleteItems}
              updateItems={updateItems}
            />
          )}
        </div>
      </div>
      {showAddUserModal && (
        <Modal closeOutside={false} close={() => setShowAddUserModal(false)}>
          <AddUserForm />
        </Modal>
      )}
    </div>
  );
}

export default UserManagement;
