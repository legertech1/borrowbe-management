import React, { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import {
  COLLECTIONS_NAMES,
  convertToReadableKey,
  formatTimestamp,
} from "./manageConfig";
import { Button, Switch } from "../ManageShared";
import "./GenericTable.css";
import Checkbox from "../../../components/Shared/Checkbox";
import useNotification from "../../../hooks/useNotification";
import ExpanededRow from "./ExpanededRow";
import TablePagination from "./TablePagination";
import {
  ArrowDownward,
  ArrowUpward,
  BookmarkBorderRounded,
  BookmarkRounded,
  ContentCopy,
  Visibility,
} from "@mui/icons-material";
import PageControl from "../../../components/PageControl";
import useConfirmDialogue from "../../../hooks/useConfirmDialog";
import apis from "../../../services/api";
import axios from "axios";
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
  curr,
  size,
  ignorePagination,
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [lastClickedRow, setLastClickedRow] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [rows, setRows] = useState([]);
  const confirm = useConfirmDialogue();
  const [sortOrder, setSortOrder] = useState({
    ...curr.sort,
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
  const handleSort = () => {
    const isAsc = sortOrder.direction === "asc";

    if (!sortOrder.column) return;

    const sorted = [...data].sort((a, b) => {
      if (typeof sortOrder.column.path(a) === "boolean") {
        return (
          (sortOrder.column.path(a) - sortOrder.column.path(b)) *
          (isAsc ? 1 : -1)
        );
      }
      if (
        typeof sortOrder.column.path(a) === "number" ||
        typeof sortOrder.column.path(a) === "undefined"
      ) {
        return (
          (sortOrder.column.path(a) || 0 - sortOrder.column.path(b) || 0) *
          (isAsc ? 1 : -1)
        );
      }
      if (
        sortOrder.column.path(a) === "true" ||
        sortOrder.column.path(a) === "false"
      ) {
        return (
          sortOrder.column.path(a).localeCompare(sortOrder.column.path(b)) *
          (isAsc ? 1 : -1)
        );
      }

      if (!sortOrder.column.path(a) && !sortOrder.column.path(b)) {
        return 0;
      }
      if (!sortOrder.column.path(a) && sortOrder.column.path(b)) {
        return 1;
      }
      if (sortOrder.column.path(a) && !sortOrder.column.path(b)) {
        return -1;
      }

      return (
        sortOrder.column.path(a).localeCompare(sortOrder.column.path(b)) *
        (isAsc ? 1 : -1)
      );
    });

    setRows(sorted);

    // setSortOrder({ column: columnName, direction });
  };
  useEffect(() => {
    if (!data) return;
    handleSort();
  }, [sortOrder, data]);

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
      <div className="selected">
        <span> {selectedRows.length} </span>
        {selectedRows.length === 1 ? singleName : pluralName} selected
      </div>

      <Button
        className="error"
        onClick={() => {
          deleteItems(selectedRows, currentCollection, () => {
            setSelectedRows([]);
          });
        }}
      >
        Delete {selectedRows.length}{" "}
        {selectedRows.length === 1 ? singleName : pluralName}
      </Button>
    </div>
  );

  const TableHeaders = () => {
    return (
      <tr>
        {multiple && (
          <th>
            <Checkbox
              checked={selectedRows.length === rows.length}
              setChecked={handleSelectAll}
            />
          </th>
        )}
        {columns?.map((column, index) => (
          <th
            onClick={() =>
              setSortOrder({
                column,
                direction: sortOrder.direction == "asc" ? "desc" : "asc",
              })
            }
            key={index}
          >
            <div className="th_cont">
              {column?.label}
              <div className="icons_cont">
                {sortOrder.column.label === column.label &&
                  sortOrder.direction === "asc" && <ArrowUpward />}
                {sortOrder.column.label === column.label &&
                  sortOrder.direction === "desc" && <ArrowDownward />}
                {sortOrder.column.label !== column.label && (
                  <ArrowDownward style={{ opacity: 0 }} />
                )}
              </div>
            </div>
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
      if (column.label === "Status") {
        confirm.openDialog(
          selectedRows.length ? (
            <p>
              Are you sure you want to update <span>{column.label}</span> for{" "}
              <span>{selectedRows.length} ads</span>
            </p>
          ) : (
            <p>
              Are you sure you want to update <span>{column.label}</span> for Ad
              with title "<span>{row.title}</span>"
            </p>
          ),

          () => {
            updateItems(
              selectedRows.length ? [row._id, ...selectedRows] : [row._id],
              {
                meta: {
                  ...row.meta,
                  status: row.meta.status === "active" ? "inactive" : "active",
                },
              },
              currentCollection
            );
            setSelectedRows([]);
          }
        );
      }
    } else if (
      currentCollection === COLLECTIONS_NAMES.USER ||
      currentCollection === COLLECTIONS_NAMES.DELETED_USER
    ) {
      confirm.openDialog(
        selectedRows.length ? (
          <p>
            Are you sure you want to update{" "}
            <span>{column.label.slice(0, column.label.length - 1)}</span> status
            for <span>{selectedRows.length} users</span>
          </p>
        ) : (
          <p>
            Are you sure you want to update{" "}
            <span>{column.label.slice(0, column.label.length - 1)}</span> status
            for <span>{row.firstName + " " + row.lastName}</span>
          </p>
        ),
        () => {
          updateItems(
            selectedRows.length ? [row._id, ...selectedRows] : [row._id],

            column.update(row),
            currentCollection
          );
          setSelectedRows([]);
        }
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
              <Checkbox
                checked={selectedRows.includes(row._id)}
                setChecked={() => handleRowSelect(row._id)}
              />
            </td>
          )}

          {columns.map((column, columnIndex) => {
            const switchFields = ["Account Locked?", "Verified?", "Status"];

            const dateFields = ["Created", "Updated"];

            if (dateFields.includes(column.label)) {
              return (
                <td key={columnIndex}>
                  {/* {new Date(row[column]).toLocaleString()} */}
                  {formatTimestamp(column.path(row))}
                </td>
              );
            }
            if (column.label == "Price") {
              return (
                <td key={columnIndex}>
                  {row.priceHidden ? (
                    <span className="undisclosed">undisclosed </span>
                  ) : (
                    <span className="price">
                      {row["price"] == "0" ? "Free" : "$" + row["price"]}
                    </span>
                  )}
                </td>
              );
            }
            if (switchFields.includes(column.label)) {
              return (
                <td key={columnIndex} className={"switch_cell " + column}>
                  <span>
                    {" "}
                    <Switch
                      onChange={(e) => {
                        // e.stopPropagation();

                        handleSwitchChange(row, column);
                      }}
                      checked={column.path(row)}
                    />
                  </span>
                </td>
              );
            }
            return (
              <td
                onClick={(e) => handleRowClick(row._id, e)}
                key={columnIndex}
                className={column}
              >
                {column.path(row)?.length > 100
                  ? column.path(row)?.slice(0, 100) + "..."
                  : column.path(row)}
                <ContentCopy
                  className="__copy"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText(column.path(row));
                  }}
                />
              </td>
            );
          })}
          {!hideAction && (
            <td className="action">
              <Visibility
                className="eye_icon"
                onClick={() => openDetails(row._id)}
              />
              <span>
                {row.marked ? (
                  <BookmarkRounded
                    onClick={async () => {
                      try {
                        const { res } = await axios.get(
                          apis.unmarkDocument +
                            currentCollection +
                            "/" +
                            row._id
                        );
                        setRows((rows) =>
                          rows.map((r) =>
                            r._id == row._id ? { ...r, marked: false } : r
                          )
                        );
                      } catch (err) {
                        console.log(err);
                        notification.error(
                          err?.response?.data?.error ||
                            err?.response?.data ||
                            err?.message
                        );
                      }
                    }}
                  />
                ) : (
                  <BookmarkBorderRounded
                    onClick={async () => {
                      try {
                        const { res } = await axios.get(
                          apis.markDocument + currentCollection + "/" + row._id
                        );
                        setRows((rows) =>
                          rows.map((r) =>
                            r._id == row._id ? { ...r, marked: true } : r
                          )
                        );
                      } catch (err) {
                        console.log(err);
                        notification.error(
                          err?.response?.data?.error ||
                            err?.response?.data ||
                            err?.message
                        );
                      }
                    }}
                  />
                )}
              </span>
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
      <PageControl
        page={currentPage}
        setPage={onPageChange}
        count={pagination.totalResults}
        size={size}
      ></PageControl>
    );
  };

  if (!rows.length || !columns.length) {
    return null;
  }

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
      {!ignorePagination && (
        <div className="pagination_cont">
          <Pagination />
        </div>
      )}
    </>
  );
}

export default GenericTable;
