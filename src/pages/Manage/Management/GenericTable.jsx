import React, { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import {
  COLLECTIONS_NAMES,
  convertToReadableKey,
  formatTimestamp,
} from "./manageConfig";
import { Button, Switch } from "../ManageShared";
import "./GenericTable.css";

import useNotification from "../../../hooks/useNotification";
import ExpanededRow from "./ExpanededRow";
import TablePagination from "./TablePagination";

function GenericTable({
  columns,
  data,
  pagination,
  onPageChange,
  deleteItems,
  updateItems,
  currentCollection,
  expand,
  hideAction,
  multiple,
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [rows, setRows] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    column: null,
    direction: "asc",
  });

  const { currentPage, totalPages } = pagination;
  const singleName = currentCollection;
  const pluralName = currentCollection + "s";
  const notification = useNotification();

  useEffect(() => {
    setSelectedRows([]);
    setExpandedRows([]);
  }, [currentCollection]);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const handleRowSelect = (row) => {
    if (selectedRows.includes(row)) {
      setSelectedRows(selectedRows.filter((r) => r !== row));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((row) => row._id));
    }
  };

  const handleRowExpand = (row) => {
    if (!expand) {
      return;
    }

    if (expandedRows.includes(row)) {
      setExpandedRows(expandedRows.filter((r) => r !== row));
    } else {
      setExpandedRows([...expandedRows, row]);
    }
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      onPageChange && onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange && onPageChange(currentPage + 1);
    }
  };

  const openDetails = (id) => {
    if (currentCollection === COLLECTIONS_NAMES.USER) {
      window.open(`/user/${id}`, "_blank");
    } else if (currentCollection === COLLECTIONS_NAMES.AD) {
      window.open(`/ad/${id}`, "_blank");
    }
  };

  const TopBar = () => (
    <div className="top_bar">
      <div className="top_bar_left">
        <div className="top_bar_left_item">
          <span>
            {selectedRows.length} {` `}
            {selectedRows.length === 1 ? singleName : pluralName} selected
          </span>
        </div>
        <div className="top_bar_left_item">
          <span>
            {expandedRows.length}
            {expandedRows.length === 1 ? " row" : " rows"} expanded
          </span>
        </div>
      </div>
      <div className="top_bar_right">
        <div className="top_bar_right_item">
          <Button
            className="error"
            onClick={() => {
              deleteItems &&
                deleteItems(selectedRows, currentCollection, () => {
                  setSelectedRows([]);
                });
            }}
          >
            Delete {selectedRows.length}{" "}
            {selectedRows.length === 1 ? singleName : pluralName}
          </Button>

          {/* <Button
            className="secondary"
            onClick={() => {
              
              // updateItems && deleteItems(selectedRows);
              // setSelectedRows([]);
            }}
          >
            Block {selectedRows.length}{" "}
            {selectedRows.length === 1 ? singleName : pluralName}
          </Button> */}
          {/* <Button
            className="error"
            onClick={() => {
              deleteItems && deleteItems(selectedRows);
              setSelectedRows([]);
            }}
          >
            Set Active {selectedRows.length}{" "}
            {selectedRows.length === 1 ? singleName : pluralName}
          </Button> */}
        </div>
        {/* <div className="top_bar_right_item">
          <Button
            className="error"
            onClick={() => {
              updateItems(selectedRows, {
                accountLocked: true,
              });
              setSelectedRows([]);
            }}
          >
            Lock {selectedRows.length}{" "}
            {selectedRows.length === 1 ? singleName : pluralName}
          </Button>
        </div> */}
      </div>
    </div>
  );

  const TableHeaders = () => {
    return (
      <tr>
        {multiple && (
          <th>
            <input
              type="checkbox"
              checked={selectedRows.length === rows.length}
              onChange={handleSelectAll}
            />
          </th>
        )}
        {columns.map((column, index) => (
          <th onClick={() => handleSort(column)} key={index}>
            <div className="th_cont">
              <div className="title_cont">{convertToReadableKey(column)}</div>
              <div className="icons_cont" onClick={() => handleSort(column)}>
                <KeyboardArrowUpIcon
                  className={`${
                    sortOrder.column === column &&
                    sortOrder.direction === "asc" &&
                    "active_icon"
                  }`}
                  fontSize="small"
                />
                <KeyboardArrowDownIcon
                  className={`down_arrow ${
                    sortOrder.column === column &&
                    sortOrder.direction === "desc" &&
                    "active_icon"
                  }`}
                  fontSize="small"
                />
              </div>
            </div>
            {/* {sortOrder.column === column && sortOrder.direction === "asc" && (
            )}
            {sortOrder.column === column && sortOrder.direction === "desc" && (
            )} */}
          </th>
        ))}

        {!hideAction && <th>Action</th>}
      </tr>
    );
  };

  const handleRowClick = (rowId, e) => {
    e.stopPropagation(); // Stop event propagation
    const currentTime = new Date().getTime();
    if (lastClickedRow === rowId && currentTime - lastClickTime < 300) {
      openDetails(rowId);
    } else {
      handleRowExpand(rowId);
    }
    setLastClickedRow(rowId);
    setLastClickTime(currentTime);
  };

  const handleSwitchChange = (row, column) => {
    if (
      currentCollection === COLLECTIONS_NAMES.AD ||
      currentCollection === COLLECTIONS_NAMES.DELETED_AD
    ) {
      if (column === "status") {
        if (row.meta.status === "expired") {
          notification.error("Expired ads cannot be paused/resumed");
          return;
        }
        delete row[column];

        updateItems &&
          updateItems(
            [row._id],
            {
              ...row,
              meta: {
                ...row.meta,
                status: row.meta.status === "active" ? "paused" : "active",
              },
            },
            currentCollection
          );
      }
    } else if (
      currentCollection === COLLECTIONS_NAMES.USER ||
      currentCollection === COLLECTIONS_NAMES.DELETED_USER
    ) {
      updateItems &&
        updateItems(
          [row],
          {
            [column]: !row[column],
          },
          currentCollection
        );
    }
  };

  const isChecked = (value) => {
    if (value === "inactive") {
      return false;
    } else if (value === "active") {
      return true;
    } else if (value === "paused") {
      return false;
    } else {
      return value;
    }
  };

  const TableRows = () => {
    return rows.map((row, rowIndex) => (
      <React.Fragment key={row._id}>
        <tr className="table_row" key={rowIndex}>
          {multiple && (
            <td>
              <input
                type="checkbox"
                checked={selectedRows.includes(row._id)}
                onChange={() => handleRowSelect(row._id)}
              />
            </td>
          )}

          {columns.map((column, columnIndex) => {
            const switchFields = [
              "accountLocked",
              "verified",
              "status",
              "active",
            ];

            const dateFields = [
              "created",
              "availableFrom",
              "availableTill",
              "createdAt",
              "updatedAt",
            ];

            if (dateFields.includes(column)) {
              return (
                <td key={columnIndex}>
                  {/* {new Date(row[column]).toLocaleString()} */}
                  {formatTimestamp(row[column])}
                </td>
              );
            }

            if (switchFields.includes(column)) {
              return (
                <td key={columnIndex}>
                  <Switch
                    onChange={(e) => {
                      // e.stopPropagation();

                      handleSwitchChange(row, column);
                    }}
                    checked={isChecked(row[column])}
                  />
                  {column === "status" && <span>{` ${row[column]}`}</span>}
                </td>
              );
            }
            return (
              <td onClick={(e) => handleRowClick(row._id, e)} key={columnIndex}>
                {row[column] || ""}
              </td>
            );
          })}
          {!hideAction && (
            <td>
              <RemoveRedEyeOutlinedIcon
                className="eye_icon"
                onClick={() => openDetails(row._id)}
              />
            </td>
          )}
        </tr>
        {expandedRows.includes(row._id) && (
          <tr className="expanded_tr">
            <td colSpan={columns.length + 2}>
              <div className="expanded_cont">
                <ExpanededRow type={currentCollection} row={row} />
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    ));
  };

  const Pagination = () => {
    return (
      <TablePagination
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={totalPages}
      />
    );
  };

  if (!rows.length || !columns.length) {
    return null;
  }

  const handleSort = (columnName) => {
    const isAsc =
      sortOrder.column === columnName && sortOrder.direction === "asc";
    const direction = isAsc ? "desc" : "asc";

    const sorted = [...rows].sort((a, b) => {
      if (typeof a[columnName] === "boolean") {
        return (a[columnName] - b[columnName]) * (isAsc ? 1 : -1);
      }
      if (typeof a[columnName] === "number") {
        return (a[columnName] - b[columnName]) * (isAsc ? 1 : -1);
      }
      if (a[columnName] === "true" || a[columnName] === "false") {
        return a[columnName].localeCompare(b[columnName]) * (isAsc ? 1 : -1);
      }

      if (!a[columnName] && !b[columnName]) {
        return 0;
      }
      if (!a[columnName] && b[columnName]) {
        return 1;
      }
      if (a[columnName] && !b[columnName]) {
        return -1;
      }

      return a[columnName].localeCompare(b[columnName]) * (isAsc ? 1 : -1);
    });

    setRows(sorted);
    setSortOrder({ column: columnName, direction });
  };

  return (
    <>
      {selectedRows.length > 0 ? <TopBar /> : null}
      <div className="generic_table_container">
        <table className="generic_table">
          <thead>
            <TableHeaders />
          </thead>
          <tbody>
            <TableRows />
          </tbody>
        </table>
      </div>
      <div className="pagination_cont">
        <Pagination />
      </div>
    </>
  );
}

export default GenericTable;
