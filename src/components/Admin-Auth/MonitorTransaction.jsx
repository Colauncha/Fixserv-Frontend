import React, { useEffect, useState } from "react";
import exportImg from "../../assets/Admin Images/export.png";
import eye from "../../assets/Admin Images/preview.png";
import recycle from "../../assets/Admin Images/recycle.png";

import { getAuthToken } from "../../utils/auth";

const MonitorTransaction = () => {

  const [transactions, setTransactions] = useState([]);

const [loading, setLoading] = useState(false);

const [page, setPage] = useState(1);

const [pagination, setPagination] = useState({
  totalPages: 1,
  total: 0,
});

const [status, setStatus] = useState("");

const [purpose, setPurpose] = useState("");

const [startDate, setStartDate] = useState("");

const [endDate, setEndDate] = useState("");

const [selectedTransaction, setSelectedTransaction] =
  useState(null);

const [showModal, setShowModal] = useState(false);

const [refundLoading, setRefundLoading] =
  useState(false);

const limit = 10;

useEffect(() => {
  fetchTransactions();
}, [
  page,
  status,
  purpose,
  startDate,
  endDate,
]);

const fetchTransactions = async () => {
  try {
    setLoading(true);

    const token = getAuthToken();

    let endpoint =
      `/api/wallet/admin/monitor-transactions?page=${page}&limit=${limit}`;

    if (status) {
      endpoint += `&status=${status}`;
    }

    if (purpose) {
      endpoint += `&purpose=${purpose}`;
    }

    if (startDate) {
      endpoint += `&startDate=${startDate}`;
    }

    if (endDate) {
      endpoint += `&endDate=${endDate}`;
    }

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log("TRANSACTIONS:", data);

    if (data.success) {

      setTransactions(
        data?.data?.transactions || []
      );

      setPagination({
        total:
          data?.data?.total || 0,

        totalPages:
          data?.data?.pagination?.totalPages || 1,
      });
    }

  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const handleRefund = async (transaction) => {
  try {
    setRefundLoading(true);

    const token = getAuthToken();

    const response = await fetch(
      `/api/wallet/admin/refund/${transaction.reference}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          reason: "Admin initiated refund",
        }),
      }
    );

    const data = await response.json();

    console.log("REFUND:", data);

    if (data.success) {

      alert("Refund successful");

      fetchTransactions();

    } else {

      alert(
        data.message || "Refund failed"
      );
    }

  } catch (error) {

    console.log(error);

    alert("Something went wrong");

  } finally {

    setRefundLoading(false);
  }
};

  return (
    <>
    {showModal && selectedTransaction && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">

    <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden">

      <div className="flex justify-between items-center px-6 py-4 border-b">

        <div>
          <h2 className="text-lg font-semibold">
            Transaction Details
          </h2>

          <p className="text-sm text-gray-500">
            Full transaction information
          </p>
        </div>

        <button
          onClick={() => setShowModal(false)}
          className="text-2xl text-gray-500"
        >
          ×
        </button>

      </div>

      <div className="p-6 grid grid-cols-2 gap-4">

        <div className="border rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">
            Transaction ID
          </p>

          <p className="text-sm font-medium">
            {selectedTransaction.transactionId}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">
            Amount
          </p>

          <p className="text-sm font-medium">
            ₦{selectedTransaction.amount?.toLocaleString()}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">
            Purpose
          </p>

          <p className="text-sm font-medium">
            {selectedTransaction.purpose}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">
            Status
          </p>

          <p className="text-sm font-medium">
            {selectedTransaction.status}
          </p>
        </div>

        <div className="border rounded-xl p-4 col-span-2">
          <p className="text-xs text-gray-500 mb-1">
            Description
          </p>

          <p className="text-sm font-medium">
            {selectedTransaction.description}
          </p>
        </div>

      </div>

    </div>

  </div>
)}
    <div className="w-full bg-white">
      <section className="w-full py-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-black">
                Monitor Transactions
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track and manage all marketplace transactions
              </p>
            </div>

            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-sm">
              <img src={exportImg} className="w-4" />
              Export
            </button>
          </div>

          {/* Filters */}
<div className="flex flex-wrap items-center gap-4 mb-6">

  {/* STATUS */}
  <select
    value={status}
    onChange={(e) => {
      setStatus(e.target.value);
      setPage(1);
    }}
    className="border border-gray-300 px-4 py-2 text-sm rounded-lg bg-white"
  >
    <option value="">
      All Statuses
    </option>

    <option value="SUCCESS">
      Success
    </option>

    <option value="PENDING">
      Pending
    </option>

    <option value="FAILED">
      Failed
    </option>
  </select>

  {/* PURPOSE */}
  <select
    value={purpose}
    onChange={(e) => {
      setPurpose(e.target.value);
      setPage(1);
    }}
    className="border border-gray-300 px-4 py-2 text-sm rounded-lg bg-white"
  >
    <option value="">
      All Purposes
    </option>

    <option value="LOCKED_ESCROW">
      Locked Escrow
    </option>

    <option value="REFUND">
      Refund
    </option>

    <option value="PAYMENT_COMPLETED">
      Payment Completed
    </option>

    <option value="PAYMENT_RECEIVED">
      Payment Received
    </option>

    <option value="TOP_UP">
      Top Up
    </option>

    <option value="BONUS">
      Bonus
    </option>
  </select>

  {/* START DATE */}
  <input
    type="date"
    value={startDate}
    onChange={(e) => {
      setStartDate(e.target.value);
      setPage(1);
    }}
    className="border border-gray-300 px-4 py-2 text-sm rounded-lg"
  />

  {/* END DATE */}
  <input
    type="date"
    value={endDate}
    onChange={(e) => {
      setEndDate(e.target.value);
      setPage(1);
    }}
    className="border border-gray-300 px-4 py-2 text-sm rounded-lg"
  />

</div>

          {/* Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">

            {/* Header Row */}
            <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 text-xs text-gray-500 font-medium border-b">
              <div className="col-span-2">Transaction ID</div>
              <div className="col-span-1">Client</div>
              <div className="col-span-1">Artisan</div>
              <div className="col-span-3">Item</div>
              <div className="col-span-1">Amount</div>
              <div className="col-span-1">Fee</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Rows */}

              {loading ? (
  <div className="py-20 text-center text-gray-500">
    Loading transactions...
  </div>
) : transactions.length === 0 ? (
  <div className="py-20 text-center text-gray-500">
    No transactions found
  </div>
) : (
  transactions.map((row, i) => (
             <div
  key={i}
  className="grid grid-cols-12 px-5 py-4 border-b text-sm items-center"
>


  <div className="col-span-2 truncate">
    {row.transactionId}
  </div>

  <div className="col-span-1">
    {row.client?.fullName || "-"}
  </div>

  <div className="col-span-1">
    {row.artisan?.fullName || "-"}
  </div>

  <div className="col-span-3 truncate">
    {row.order?.item || row.description}
  </div>

  <div className="col-span-1">
    ₦{row.amount?.toLocaleString()}
  </div>

  <div className="col-span-1">
    ₦{row.fee?.toLocaleString()}
  </div>

  <div className="col-span-1">

    {row.status === "SUCCESS" && (
      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md">
        Success
      </span>
    )}

    {row.status === "PENDING" && (
      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-md">
        Pending
      </span>
    )}

    {row.status === "FAILED" && (
      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-md">
        Failed
      </span>
    )}

  </div>

  <div className="col-span-1 text-xs text-gray-500">
    {new Date(row.date).toLocaleDateString()}
  </div>

  <div className="col-span-1 flex justify-end gap-2">

    <button
      onClick={() => {
        setSelectedTransaction(row);
        setShowModal(true);
      }}
      className="flex items-center gap-1 text-xs border border-gray-300 px-2 py-1 rounded-md hover:bg-gray-50"
    >
      <img src={eye} className="w-3 h-3" />
      Details
    </button>

    {row.status === "SUCCESS" && (
      <button
  onClick={() => handleRefund(row)}
  disabled={refundLoading}
  className="flex items-center gap-1 text-xs text-red-600 border border-red-200 px-2 py-1 rounded-md hover:bg-red-50 disabled:opacity-50"
>
  <img src={recycle} className="w-3 h-3" />

  {refundLoading
    ? "Processing..."
    : "Refund"}
</button>
    )}

  </div>

</div>
            )))}
          </div>

          <div className="flex items-center justify-between mt-6">

  <p className="text-sm text-gray-500">
    Total Transactions: {pagination.total}
  </p>

  <div className="flex items-center gap-2">

    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="px-4 py-2 border rounded-lg disabled:opacity-40"
    >
      Prev
    </button>

    {[...Array(pagination.totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => setPage(i + 1)}
        className={`w-10 h-10 rounded-lg ${
          page === i + 1
            ? "bg-[#3E83C4] text-white"
            : "border"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={
        page === pagination.totalPages
      }
      onClick={() => setPage(page + 1)}
      className="px-4 py-2 border rounded-lg disabled:opacity-40"
    >
      Next
    </button>

  </div>

</div>

        </div>
      </section>
    </div>
    </>
  );
};

export default MonitorTransaction;
