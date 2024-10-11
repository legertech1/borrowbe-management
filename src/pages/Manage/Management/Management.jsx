import React, { useEffect, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import axios from "axios";
import Dropdown from "../../../components/Shared/Dropdown";
import Input from "../../../components/Shared/Input";
import Button from "../../../components/Shared/Button";
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
import GenericTable from "./GenericTable";

import { Link } from "react-router-dom";
import Modal from "../../../components/Modal";
import AddUserForm from "../AddUserForm/index";
import { useSelector } from "react-redux";
import { Add, ClearAll, Search } from "@mui/icons-material";
import useNotification from "../../../hooks/useNotification";
import useConfirmDialog from "../../../hooks/useConfirmDialog";

function UserManagement({ currentCollection }) {
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

  const setInitialFilters = () => {
    setFilters([
      {
        label: allKeys[currentCollection.key][0].label,
        condition: { text: conditions[0].label, value: conditions[0].key },
        value: "",
      },
    ]);
  };

  useEffect(() => {
    if (currentCollection.key) {
      setInitialFilters();
      handleSearch();
    }
  }, [currentCollection.key]);

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
      console.log(label, condition, value, conditions);
      return {
        key: allKeys[currentCollection.key].filter(
          (obj) =>
            obj.label == label ||
            obj.label?.toLowerCase() == label.text?.toLowerCase()
        )[0]?.key,
        condition: conditions.filter((c) => c.label == condition.text)[0]?.key,
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
      console.log(error);
      alert("Error searching data");
    }
  };
  const confirm = useConfirmDialog();
  const notification = useNotification();
  const deleteItems = async (ids, collection, cb) => {
    confirm.openDialog(
      "Are you sure you want to delete " +
        ids.length +
        (collection == "User" ? " users" : " ads"),
      async () => {
        try {
          setLoading(true);
          await axios.post(apis.manageDeleteItems, {
            ids,
            collectionName: currentCollection.key,
          });

          handleSearch();
          cb && cb();
        } catch (err) {
          setLoading(false);
          notification.error(
            err?.response?.data?.error || err?.response?.data || err?.message
          );
        }
      }
    );
  };

  const updateItems = async (ids, updates) => {
    try {
      setLoading(true);
      const { data } = await axios.post(apis.manageUpdateItems, {
        ids,
        collectionName: currentCollection.key,
        updates,
      });
      setRows((rows) =>
        rows.map((doc) => {
          let final = doc;
          for (let i = 0; i < data.length; i++) {
            if (data[i]._id == doc._id) final = data[i];
          }
          return final;
        })
      );
      // handleSearch(pagination.currentPage);
    } catch (err) {
      console.log(err);
      setLoading(false);
      notification.error(
        err?.response?.data?.error || err?.response?.data || err?.message
      );
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
        {currentCollection.key && (
          <div className="filter_section">
            <div className="filters">
              {filters.length > 0 &&
                filters.map((filter, index) => (
                  <div className="row" key={index}>
                    <div className="box1">
                      <Dropdown
                        value={filter.label}
                        setValue={(v) => setFieldKey(index, v)}
                        placeholder="Select Filter"
                        array={allKeys[currentCollection.key].map((k, i) => ({
                          text: k.label,
                          value: k.key,
                        }))}
                      ></Dropdown>
                    </div>
                    <div className="box2">
                      <Dropdown
                        value={filter.condition}
                        setValue={(v) => setCondition(index, v)}
                        placeholder="Select Condition"
                        array={conditions.map((condition) => ({
                          text: condition.label,
                          value: condition.key,
                        }))}
                      ></Dropdown>
                    </div>
                    <div className="box3">
                      <Input
                        value={filter.value}
                        onChange={(e) => setInput(index, e.target.value)}
                        placeholder="Enter Value"
                        onKeyDown={handleEnterPress}
                      ></Input>
                    </div>
                    <Button
                      className="box4"
                      onClick={() => removeFilter(index)}
                    >
                      <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
                    </Button>
                  </div>
                ))}
            </div>
            <div className="row actions">
              <Button
                onClick={() => handleSearch(1, filters)}
                className="primary"
              >
                <Search /> Search
              </Button>
              <Button onClick={handleClearAll} className="error">
                <ClearAll />
                Clear All
              </Button>
              <Button onClick={addNewFilterRow} className="secondary">
                <Add />
                Add New Filter
              </Button>
              {currentCollection.label == "Users" && (
                <Button
                  onClick={() => {
                    setShowAddUserModal(true);
                  }}
                  className="primary"
                >
                  <Add /> Add User
                </Button>
              )}
              <div className="num_results">
                Number of Results:{" "}
                <Input
                  value={qty}
                  onChange={(e) => {
                    if (isNaN(e.target.value)) return;
                    setQty(Math.min(500, e.target.value));
                  }}
                />
              </div>
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
              curr={currentCollection}
              deleteItems={deleteItems}
              updateItems={updateItems}
              size={qty}
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
