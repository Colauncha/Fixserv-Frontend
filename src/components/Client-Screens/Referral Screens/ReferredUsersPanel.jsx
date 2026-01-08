const ReferredUsersPanel = ({
  sortOption,
  toggleSort,
  paginatedUsers,
  totalPages,
  page,
  handlePageClick,
  handleNext,
}) => {
  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Referred Users</h3>

        <div className="text-sm text-gray-500 flex items-center gap-1">
          Sort By:
          <span
            onClick={toggleSort}
            className="text-gray-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            {sortOption}
            <span className="text-xs">▾</span>
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-blue-100 rounded-xl overflow-hidden">
        {/* Header Row */}
        {/* <div className="grid grid-cols-4 bg-blue-50 text-sm text-gray-600 px-5 py-3"> */}
        <div className="grid grid-cols-[1.4fr_1.9fr_0.9fr_0.8fr] bg-blue-50 text-sm text-gray-600 px-5 py-3">

          <span>Name</span>
          <span>Email</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {/* Data Rows */}
        {paginatedUsers.map((row, i) => (
          // <div
          //   key={i}
          //   className="grid grid-cols-4 px-5 py-4 text-sm border-t border-blue-100 items-center"
          // >
          <div
  key={i}
  className="grid grid-cols-[1.4fr_1.9fr_0.9fr_0.8fr] px-5 py-4 text-sm border-t border-blue-100 items-center"
>

            <span className="text-gray-800">{row[0]}</span>
            <span className="text-gray-500">{row[1]}</span>
            <span className="text-gray-700">{row[2]}</span>

            <span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  row[3] === "Successful"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {row[3]}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="relative mt-5">
        {/* Page Numbers */}
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          {[...Array(totalPages)].map((_, index) => (
            <span
              key={index}
              onClick={() => handlePageClick(index + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${
                page === index + 1
                  ? "bg-blue-500 text-white"
                  : "border hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </span>
          ))}
        </div>

        {/* Next Button */}
        <div className="absolute right-0 top-0">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition"
          >
            Next <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferredUsersPanel;
