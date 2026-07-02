"use client";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const goPrev = () => currentPage > 1 && onPageChange(currentPage - 1);
  const goNext = () =>
    currentPage < totalPages && onPageChange(currentPage + 1);

  return (
    <div className="flex justify-between items-center mt-5 text-sm">
      <ul className="flex space-x-3 justify-center items-center">

        {/* Prev */}
        <li
          onClick={goPrev}
          className={`px-3 py-1 border rounded-md cursor-pointer flex items-center gap-1  dark:text-white ${
            currentPage === 1
              ? "opacity-40 pointer-events-none dark:text-white "
              : "hover:bg-gray-100 dark:hover:bg-gray-800 "
          }`}
        >
          Prev
        </li>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <li
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md cursor-pointer font-medium ${
                currentPage === page
                  ? "bg-[#465FFF] text-white"
                  : "text-gray-700 dark:text-gray-300 border hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {page}
            </li>
          );
        })}

        {/* Next */}
        <li
          onClick={goNext}
          className={`px-3 py-1 border rounded-md cursor-pointer flex items-center gap-1 dark:text-white ${
            currentPage === totalPages
              ? "opacity-40 pointer-events-none"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          Next
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
