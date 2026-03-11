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
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          Referred Users
        </h3>

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

      {/* Desktop Table */}
      <div className="border border-blue-100 rounded-xl overflow-hidden hidden md:block">
        <div className="grid grid-cols-[1.4fr_1.9fr_0.9fr_0.8fr] bg-blue-50 text-sm text-gray-600 px-5 py-3">
          <span>Name</span>
          <span>Email</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {paginatedUsers.length === 0 ? (
          <div className="px-5 py-6 text-sm text-gray-500 border-t border-blue-100">
            No referred users yet.
          </div>
        ) : (
          paginatedUsers.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.4fr_1.9fr_0.9fr_0.8fr] px-5 py-4 text-sm border-t border-blue-100 items-center"
            >
              <span className="text-gray-800 break-words">{row[0]}</span>
              <span className="text-gray-500 break-words">{row[1]}</span>
              <span className="text-gray-700 break-words">{row[2]}</span>

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
          ))
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.length === 0 ? (
          <div className="px-4 py-6 text-sm text-gray-500 border border-blue-100 rounded-xl">
            No referred users yet.
          </div>
        ) : (
          paginatedUsers.map((row, i) => (
            <div
              key={i}
              className="border border-blue-100 rounded-xl p-4 space-y-3"
            >
              <div>
                <p className="text-xs text-gray-400 mb-1">Name</p>
                <p className="text-sm text-gray-800 break-words">{row[0]}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="text-sm text-gray-500 break-words">{row[1]}</p>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Date</p>
                  <p className="text-sm text-gray-700 break-words">{row[2]}</p>
                </div>

                <div className="shrink-0">
                  <p className="text-xs text-gray-400 mb-1">Status</p>
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-5 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex gap-2 flex-wrap">
          {[...Array(totalPages)].map((_, index) => (
            <span
              key={index}
              onClick={() => handlePageClick(index + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer text-sm ${
                page === index + 1
                  ? "bg-[#3E83C4] text-white"
                  : "border hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </span>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={paginatedUsers.length === 0 || page === totalPages}
          className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          Next <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default ReferredUsersPanel;