import React from "react";
import { Button } from "../ManageShared";
import "./TablePagination.css";

const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePreviousClick = () => {
    onPageChange(currentPage - 1);
  };

  const handleNextClick = () => {
    onPageChange(currentPage + 1);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Change this value to adjust the number of visible page numbers

    if (totalPages <= maxVisiblePages) {
      // If total pages are less than or equal to maxVisiblePages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <span
            key={i}
            onClick={() => onPageChange(i)}
            className={`page-number ${currentPage === i && "active"}`}
          >
            {i}
          </span>
        );
      }
    } else {
      // If total pages are greater than maxVisiblePages
      const leftBoundary = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const rightBoundary = Math.min(
        totalPages,
        leftBoundary + maxVisiblePages - 1
      );

      if (leftBoundary > 1) {
        pageNumbers.push(
          <span
            key="first"
            onClick={() => onPageChange(1)}
            className="page-number"
          >
            1
          </span>
        );
        if (leftBoundary > 2) {
          pageNumbers.push(
            <span
              onClick={() => onPageChange(2)}
              key="ellipsisLeft"
              className="page-number"
            >
              ...
            </span>
          );
        }
      }

      for (let i = leftBoundary; i <= rightBoundary; i++) {
        pageNumbers.push(
          <span
            key={i}
            onClick={() => onPageChange(i)}
            className={`page-number ${currentPage === i && "active"}`}
          >
            {i}
          </span>
        );
      }

      if (rightBoundary < totalPages) {
        if (rightBoundary < totalPages - 1) {
          pageNumbers.push(
            <span
              onClick={() => onPageChange(totalPages - 1)}
              key="ellipsisRight"
              className="page-number"
            >
              ...
            </span>
          );
        }
        pageNumbers.push(
          <span
            key="last"
            onClick={() => onPageChange(totalPages)}
            className={`page-number ${currentPage === totalPages && "active"}`}
          >
            {totalPages}
          </span>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div className="pagination-footer">
      <Button
        className="primary"
        onClick={handlePreviousClick}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span className="px-3">{renderPageNumbers()}</span>
      <Button
        className="primary"
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default TablePagination;
