import React, { useState, useEffect } from "react";
import earnedIcon from "../../assets/Artisan Images/earned icon.png";
import withdrawerIcon from "../../assets/Artisan Images/withdrawal icon.png";
import pendingIcon from "../../assets/Artisan Images/pending icon.png";
import failedIcon from "../../assets/Artisan Images/failed icon.png";
import not from "../../assets/Artisan Images/not.png";
import profile from "../../assets/Artisan Images/adebayo.png";
import { useNavigate } from "react-router-dom";
import { getWithdrawalHistory } from "../../api/wallet";
import { resolveAccount } from "../../api/wallet";

import { initiateWithdrawal } from "../../api/wallet";
import { getAuthUser } from "../../utils/auth"


const activities = [
  {
    type: "earned",
    title: "You earned",
    amount: "+NGN 25,000.00",
    message: "Payment from job #FS - 12345 | Client: T. Adebayo | Keep up the great work",
    date: "October 20, 2025",
    icon: earnedIcon,
    color: "text-green-600",
  },
  {
    type: "withdraw",
    title: "Withdrawal update",
    amount: "-NGN 50000",
    message: "Fee for the job #FS - 12345 processed successfully",
    date: "October 19, 2025",
    icon: withdrawerIcon,
    color: "text-red-500",
  },
  {
    type: "fee",
    title: "Platform fee",
    amount: "-NGN 2500.00",
    message: "Funds sent to Zenith Bank - ****** 1234",
    date: "October 18, 2025",
    icon: withdrawerIcon,
    color: "text-red-500",
  },
  {
    type: "pending",
    title: "Withdrawal request of",
    amount: "NGN 15,000.00 is pending",
    message: "Funds sent to Zenith Bank - ****** 1234",
    date: "October 17, 2025",
    icon: pendingIcon,
    color: "text-yellow-500",
  },
  {
    type: "failed",
    title: "Payment for job #FS - 1232 failed",
    amount: "",
    message: "Please check the client S. Olawale or contact support.",
    date: "October 16, 2025",
    icon: failedIcon,
    color: "text-red-600",
  },
];

const Wallet = () => {

const user = getAuthUser();
const userId = user?.id;

  const [withdrawals, setWithdrawals] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!userId) return;
  fetchWithdrawals();
}, [page, userId]);


  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const data = await getWithdrawalHistory(userId, page, 10);
      setWithdrawals(data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


const itemsPerPage = 3;

const totalPages = Math.ceil(activities.length / itemsPerPage);

const currentData = activities.slice(
  (page - 1) * itemsPerPage,
  page * itemsPerPage
);

const [amount, setAmount] = useState("");
const [accountNumber, setAccountNumber] = useState("");
const [bankCode, setBankCode] = useState("");
const [pin, setPin] = useState("");
const [accountName, setAccountName] = useState("");


const [screen, setScreen] = useState("home");

const navigate = useNavigate();

const [agreed, setAgreed] = useState(false);

const canWithdraw =
  amount &&
  accountNumber.length === 10 &&
  bankCode &&
  accountName &&
  pin;


const withdrawalAmount = Number(amount || 0);

const [withdrawing, setWithdrawing] = useState(false);



const fee = 50;
const netAmount = withdrawalAmount - fee;

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");

//   if (!agreed) {
//     setError("You must agree to the Terms & Conditions");
//     return;
//   }

//   if (formData.password !== formData.confirmPassword) {
//     setError("Passwords do not match");
//     return;
//   }

//   try {
//     setLoading(true);

//     const payload = {
//       email: formData.email.trim(),
//       password: formData.password,
//       fullName: formData.fullName.trim(),
//       role: "ADMIN",
//       adminData: {
//         permissions: formData.permissions,
//       },
//     };

//     const res = await fetch(
//       "https://user-management-h4hg.onrender.com/api/users/register",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Registration failed");
//     }

//     // optional, safe
//     localStorage.setItem("fixserv_role", "ADMIN");

//     navigate("/admin-login");
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };
const handleResolveAccount = async () => {
  if (accountNumber.length !== 10 || !bankCode) return;

  try {
    const res = await resolveAccount({ accountNumber, bankCode });
    setAccountName(res?.data?.accountName);
  } catch (err) {
    setAccountName("");
    console.error("Account resolution failed");
  }
};

// const handleWithdraw = async () => {
//   try {
//     await initiateWithdrawal({
//       userId,
//       amount: Number(amount),
//       accountNumber,
//       bankCode,
//       pin,
//     });

//     fetchWithdrawals(); // refresh history
//     alert("Withdrawal initiated successfully");
//   } catch (err) {
//     alert("Withdrawal failed");
//   }
// };

const handleWithdraw = async () => {
  if (withdrawing) return;
  setWithdrawing(true);

  try {
    await initiateWithdrawal({
      userId,
      amount: Number(amount),
      accountNumber,
      bankCode,
      pin,
    });

    fetchWithdrawals();
    setScreen("success");
  } catch (err) {
    console.error(err);
    setScreen("failed");
  } finally {
    setWithdrawing(false);
  }
};






  return (
    <div className="w-full pr-4 bg-[#f7f7f7]">

      {screen === "home" && (
  <>
  {/* Header */}
      <div className="flex justify-between p-4 items-center mb-6">
        <h1 className="text-2xl text-black font-semibold">My Wallet</h1>
       <div className="flex items-center gap-4">
                 <img src={not} className="w-11 h-9 cursor-pointer" />
                 <img src={profile} className="w-9 h-9 rounded-full cursor-pointer" />
               </div>
      </div>
      <div className="border-t border-blue-200"></div>

      <div className="grid pl-6 mt-6 grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          <div className="bg-white p-6 rounded-xl">
            <p className="text-sm text-gray-500 mb-2">Available Balance</p>
            <h2 className="text-2xl font-bold">NGN 152,400.00</h2>
          </div>

          <div className="bg-white p-6 rounded-xl text-center">
            <p className="text-sm text-gray-500">Daily Earnings Streak</p>
            {/* <h2 className="text-5xl font-bold text-blue-600 my-2">7</h2>
            <p className="text-sm text-gray-400">days!</p> */}
            <div className="relative inline-block my-2">
  <span className="text-5xl font-bold text-blue-600">7</span>
  <span className="absolute bottom-1 left-full ml-1 text-sm text-gray-400">
    days!
  </span>
</div>

            <p className="text-xs text-gray-400 mt-2">Keep up the good work!</p>
          </div>

<button
  // onClick={() => setShowWithdraw(true)}
  onClick={() => setScreen("withdraw")}

  className="w-full bg-[#3E83C4] cursor-pointer text-white py-3 rounded-lg text-sm"
>
  Withdraw Funds
</button>



        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6">

          <h3 className="font-semibold mb-4">Activity Feed & Milestones</h3>
                <div className="border-t border-blue-200 mb-4"></div>

          {/* Filters */}
          <div className="flex justify-between gap-4 mb-4">
            <input
              placeholder="Search activities..."
              className="border border-blue-200 rounded-md px-3 py-2 text-sm w-full"
            />
            {/* <select className="border border-blue-200 rounded-md px-3 py-2 text-sm">
              <option>Last 30 Days</option>
            </select> */}
            <p className="border border-blue-200 rounded-md w-full px-4 py-2 text-sm">Last 30 Days</p>
          </div>

          {/* Activities */}
          <div className="space-y-4">
            {currentData.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 border border-blue-200 p-4 rounded-lg"
              >
                <img src={item.icon} className="w-8 h-8" />

                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{item.title}</span>{" "}
                    <span className={item.color}>{item.amount}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{item.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
                <div className="border-t border-blue-200 mt-6"></div>

          <div className="flex justify-between items-center mt-6 text-sm text-black">
  <p>
    Showing {(page - 1) * itemsPerPage + 1}–
    {Math.min(page * itemsPerPage, activities.length)} of {activities.length}
  </p>

  <div className="flex items-center gap-2">
    <button
  onClick={() => setPage(p => Math.max(1, p - 1))}
  disabled={page === 1}
  className={`px-3 py-1 border border-blue-200 rounded cursor-pointer
    ${page === 1 ? "opacity-40 cursor-not-allowed" : ""}`}
>
  Previous
</button>


    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => setPage(i + 1)}
        className={`px-3 py-1 border border-blue-200 rounded cursor-pointer ${
          page === i + 1 ? "bg-blue-100 text-[#3E83C4]" : ""
        }`}
      >
        {i + 1}
      </button>
    ))}

<button
  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
  disabled={page === totalPages}
  className={`px-3 py-1 border border-blue-200 rounded cursor-pointer
    ${page === totalPages ? "opacity-40 cursor-not-allowed" : ""}`}
>
  Next
</button>

  </div>
</div>


        </div>

      </div>

  </>
)}
{screen === "withdraw" && (
  <div className="w-full p-6">

    {/* Back */}
    <button
      onClick={() => setScreen("home")}
      className="text-[#3E83C4] cursor-pointer mb-6 flex items-center gap-2"
    >
      ← Back
    </button>

    <h1 className="text-2xl font-semibold mb-6">Withdraw Funds</h1>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Left */}
      <div className="lg:col-span-2 space-y-6">

        <div className="bg-white p-6 rounded-xl">
          <p className="text-sm text-gray-500">Available Balance</p>
          <h2 className="text-2xl font-bold">NGN 152,400.00</h2>
        </div>

        <div className="bg-white p-6 rounded-xl space-y-4">

          <h3 className="font-semibold">Make a withdrawal</h3>

          <div>
            <p className="text-sm text-gray-500 mb-1">Amount to withdraw</p>
            <div className="border border-blue-200 bg-[#E5EFF9] px-4 py-3 rounded-lg">NGN 50,000.00</div>
          </div>
          <input
  type="number"
  placeholder="Enter amount"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  className="w-full border border-blue-200 px-4 py-3 rounded-lg text-sm"
/>


          <div className="flex justify-between items-center">
            <p className="text-sm">Select Withdrawal Method</p>
            <span className="text-sm text-[#3E83C4] cursor-pointer">Manage Methods</span>
          </div>

          <div className="border border-[#3E83C4] rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">Bank Transfer</p>
              <p className="text-xs text-gray-500">Zenith Bank **** 1234</p>
            </div>
            <div className="w-4 h-4 rounded-full border-4 border-[#3E83C4]" />
          </div>

          <div className="border border-blue-200 rounded-lg p-4 flex justify-between items-center opacity-70">
            <div>
              <p className="font-medium">Bank Transfer</p>
              <p className="text-xs text-gray-500">Zenith Bank **** 1234</p>
            </div>
            <div className="w-4 h-4 rounded-full border" />
          </div>
          <div className="space-y-2">
  <input
    placeholder="Account Number"
    value={accountNumber}
    onChange={(e) => setAccountNumber(e.target.value)}
    onBlur={handleResolveAccount}
    className="w-full border border-blue-200 px-4 py-2 rounded-lg text-sm"
  />

<select
  value={bankCode}
  onChange={(e) => setBankCode(e.target.value)}
  className="w-full border border-blue-200 px-4 py-2 rounded-lg text-sm"
>
  <option value="">Select Bank</option>
  <option value="058">GTBank</option>
  <option value="057">Zenith Bank</option>
  <option value="033">UBA</option>
</select>

<input
  type="password"
  placeholder="Enter PIN"
  value={pin}
  onChange={(e) => setPin(e.target.value)}
  className="w-full border border-blue-200 px-4 py-2 rounded-lg text-sm"
/>



  {accountName && (
    <p className="text-green-600 text-sm">
      Account Name: {accountName}
    </p>
  )}
</div>

        </div>
      </div>

      {/* Right */}
      <div className="p-6 rounded-xl space-y-4">

        <div className="bg-white p-6 rounded-xl space-y-4">
          <h3 className="font-semibold">Transaction Summary</h3>
                  <div className="border-t border-blue-200 flex justify-between text-sm"></div>

        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Withdrawal Amount</span>
            {/* <span>NGN 50,000.00</span> */}
            <span>NGN {withdrawalAmount.toLocaleString()}.00</span>

          </div>
          <div className="flex justify-between">
            <span>Transaction Fee</span>
            {/* <span>NGN 50.00</span> */}
            <span>NGN {fee.toLocaleString()}.00</span>

          </div>
        </div>



        <div className="border-t  border-blue-200 pt-4 flex justify-between text-sm">
          <span>You will receive</span>
          {/* <span className="text-[#3E83C4] font-semibold">NGN 49,500.00</span> */}
          <span className="text-[#3E83C4] font-semibold">
  NGN {netAmount.toLocaleString()}.00
</span>

        </div>
        </div>

{/* <button

  onClick={() => setScreen("success")}

  className="w-full mt-4 bg-[#3E83C4] cursor-pointer text-white py-3 rounded-lg"
>
  Withdraw Now
</button> */}


<button
  onClick={handleWithdraw}
  disabled={!canWithdraw}
  className={`w-full mt-4 py-3 rounded-lg text-white
    ${canWithdraw ? "bg-[#3E83C4]" : "bg-gray-300 cursor-not-allowed"}`}
>
  Withdraw Now
</button>



      </div>
      

    </div>
    {/* Recent Withdrawals */}
<div className="mt-10 bg-white rounded-xl border border-blue-50 overflow-hidden">

  <div className="px-6 py-4 border-b border-blue-200 text-xl font-medium">
    Recent Withdrawals
  </div>

  {!withdrawals.length && !loading && (
  <p className="p-6 text-sm text-gray-400">
    No withdrawals yet
  </p>
)}

{withdrawals.map((item, i) => (
  <div
    key={i}
    className="grid grid-cols-4 px-6 py-4 text-sm border-t border-blue-200 items-center"
  >
    <span className="text-gray-600">
      {new Date(item.createdAt).toLocaleDateString()}
    </span>

    <span>NGN {Number(item.amount).toLocaleString()}</span>

    <span>{item.bankName || "—"}</span>

    <span
      className={`inline-block px-3 py-1 rounded-full text-xs w-fit
        ${item.status === "SUCCESS"
          ? "bg-green-100 text-green-600"
          : item.status === "PENDING"
          ? "bg-yellow-100 text-yellow-600"
          : "bg-red-100 text-red-600"}`}
    >
      {item.status}
    </span>
  </div>
))}

  
</div>

  </div>
)}

{screen === "success" && (
  <div className="w-full p-6">

    <button
      // onClick={() => {
      //   setShowSuccess(false);
      //   setShowWithdraw(false);
      // }}
      onClick={() => setScreen("withdraw")}

      className="text-[#3E83C4] mb-6 flex items-center gap-2 cursor-pointer"
    >
      ← Back
    </button>

    <div className="max-w-3xl mx-auto bg-white rounded-xl p-10 text-center">

      <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6">
        <span className="text-white text-4xl">✓</span>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Withdrawal Successful</h2>
      <p className="text-gray-500 mb-8">
        Your withdrawal request has been processed. The funds should reflect in your account within 1–2 business days
      </p>

      <div className="text-sm text-left max-w-md mx-auto space-y-3 mb-8">
        <div className="flex justify-between">
          <span>Amount Withdrawn</span>
          <span>NGN 49,500.00</span>
        </div>
        <div className="flex justify-between">
          <span>Destination Account</span>
          <span>Zenith Bank **** 1234</span>
        </div>
        <div className="flex justify-between">
          <span>Transaction ID</span>
          <span>TXN 344424</span>
        </div>
        <div className="flex justify-between">
          <span>Date & Time</span>
          <span>October 26, 2025 10:45 AM</span>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setScreen("withdraw")}
          className="bg-[#3E83C4] cursor-pointer text-white px-8 py-3 rounded-lg"
        >
          Return to Wallet
        </button>

        <button
        // onClick={"/artisan"}
        onClick={() => navigate("/artisan")}
          className="border border-blue-200 text-[#3E83C4] cursor-pointer px-8 py-3 rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>

      <p className="text-sm text-gray-400 mt-8">
        If you have any questions, please <span className="text-[#3E83C4]">contact support</span>
      </p>

    </div>
  </div>
)}
{screen === "failed" && (
  <div className="w-full p-6 flex justify-center">
    <div className="bg-white rounded-xl p-10 w-full max-w-lg text-center space-y-6 border">

      <div className="flex justify-center">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl">
          ✕
        </div>
      </div>

      <h2 className="text-xl font-semibold">Withdrawal Unsuccessful</h2>

      <p className="text-gray-500 text-sm">
        We couldn't process your withdrawal of <b>NGN 49,500</b>.  
        Your bank has declined your transaction.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 text-left text-sm space-y-2">
        <p className="font-medium">What can you do</p>
        <ul className="list-disc list-inside text-gray-500 space-y-1">
          <li>Retry the withdrawal in a few moments</li>
          <li>Verify your bank account information is correct in your settings</li>
          <li>Contact our support team if the problem persists</li>
        </ul>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={() => setScreen("withdraw")}
          className="flex-1 bg-[#3E83C4] text-white py-3 rounded-lg"
        >
          Try again
        </button>

        <button className="flex-1 border border-blue-200 py-3 rounded-lg text-sm">
          Contact Support
        </button>
      </div>
    </div>
  </div>
)}




    </div>
  );
};

export default Wallet;
