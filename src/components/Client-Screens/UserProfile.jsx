import React, { useState, useEffect } from 'react'
import praiseImg from "../../assets/client images/client-home/PraiseAzobu.png";
import locationBlack from "../../assets/client images/client-home/location black.png";
import edit from "../../assets/client images/client-home/edit.png";
import wallet from "../../assets/client images/client-home/walletpay.png";
import coin from "../../assets/client images/client-home/Fixcoin.png";
import email from "../../assets/client images/client-home/mail.png";
import locationBlue from "../../assets/client images/client-home/location blue.png";
import phone from "../../assets/client images/client-home/phone.png";
import item from "../../assets/client images/client-home/items.png";
import iphone from "../../assets/client images/client-home/iphone.png";
import logOut from "../../assets/client images/client-home/logout.png";

import fund from "../../assets/client images/client-home/fund.png";
import secure from "../../assets/client images/client-home/secure.png";
import shieldBlue from "../../assets/client images/client-home/shield blue.png";
import shieldGreen from "../../assets/client images/client-home/shield green.png";
import success from "../../assets/client images/client-home/success.png";

import icon from "../../assets/client images/client-home/icon.png";
import current from "../../assets/client images/client-home/current.png";
import bank from "../../assets/client images/client-home/bank.png";
import card from "../../assets/client images/client-home/card.png";

import { useNavigate } from 'react-router-dom';


const UserProfile = () => {

  const navigate = useNavigate();

  const [showFundModal, setShowFundModal] = useState(false);
const [fundStep, setFundStep] = useState("form"); 

const [showWithdrawModal, setShowWithdrawModal] = useState(false);
const [withdrawStep, setWithdrawStep] = useState("form"); 

useEffect(() => {
  if (fundStep === "success") {
    const timer = setTimeout(() => {
      setShowFundModal(false);
      setFundStep("form"); 
    }, 1500); 

    return () => clearTimeout(timer);
  }
}, [fundStep]);

useEffect(() => {
  if (withdrawStep === "success") {
    const timer = setTimeout(() => {
      setShowWithdrawModal(false);
      setWithdrawStep("form"); 
    }, 1500); 

    return () => clearTimeout(timer);
  }
}, [withdrawStep]);



  return (
    <div className="w-full">
      


          <section className="w-full py-14 mt-4 overflow-hidden">
  <div className="max-w-7xl mx-auto px-2 md:px-6">
     <div className="flex justify-between items-start">

          {/* LEFT — Profile */}
          <div className="flex gap-4 items-center">

            {/* Bigger Profile Image */}
            <img
              src={praiseImg}
              alt="Praise Azobu"
              className="w-[270px] h-[270px] rounded-xl object-cover"
            />

            <div className="space-y-3">

              <h2 className="text-xl font-semibold text-black">
                Praise Azobu
              </h2>

              <div className="flex items-center gap-2 text-sm text-[#535353] mb-4">
                <img src={locationBlack} alt="" className="w-4 h-4" />
                <span>23, Allen Avenue, Ikeja, Lagos.</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => navigate("/settings")} className="flex items-center gap-2 bg-[#3E83C4] text-white px-5 py-2.5 rounded-md text-sm font-medium cursor-pointer">
                  Edit Profile
                  <img src={edit} alt="" className="w-4 h-4" />
                </button>

                <button onClick={() => navigate("/referral")} className="border border-[#3E83C4] text-[#3E83C4] px-5 py-2.5 rounded-md text-sm font-medium  hover:bg-[#3E83C4] hover:text-[#fff] transition  cursor-pointer">
                  Refer & Earn
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT — Wallet Container */}
          <div className="bg-[#F6FBFF] border border-[#3e83c4] rounded-xl p-5 w-[320px]">

            {/* Wallet Header */}
            <div className="flex items-center gap-2 mb-4">
              <img src={wallet} alt="" className="w-5 h-5" />
              <h3 className="font-semibold text-sm text-black">Wallet</h3>
            </div>

            {/* Wallet Inner Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-[#535353]">Balance</span>
                <span className="font-medium text-black">₦4000.00</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#535353]">Locked Balance</span>
                <span className="font-medium text-black">₦1000.00</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-[#535353] flex items-center gap-1">
                  <img src={coin} alt="" className="w-4 h-4" />
                  Fixedpoints
                </span>

                <div className="text-right">
                  <p className="font-medium text-black">850 pts</p>
                  <p className="text-xs text-[#535353]">₦1700.00</p>
                </div>
              </div>

            </div>

            {/* Wallet Buttons */}
            <div className="flex gap-3 mt-4">

              <button
  onClick={() => {
    setShowWithdrawModal(true);
    setWithdrawStep("form");
  }}
  className="border border-[#43A047] text-[#43A047] px-4 py-2 rounded-md text-sm w-full hover:bg-[#43A047] hover:text-white transition cursor-pointer"
>
  Withdraw
</button>

            
              <button
  onClick={() => {
    setShowFundModal(true);
    setFundStep("form");
  }}
  className="bg-[#43A047] text-white px-4 py-2 rounded-md text-sm w-full transition cursor-pointer"
>
  Fund
</button>

            </div>

          </div>

          {showFundModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
)}

{showFundModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
    <div className="bg-white w-full max-w-[380px] rounded-xl shadow-2xl border border-gray-200 overflow-hidden">

{/* Fund Form */}
{fundStep === "form" && (
  <div className="p-6 space-y-6">

    {/* Header */}
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2">
        <img src={fund} alt="fund" className="w-8 h-8" />

        <div>
          <h3 className="font-semibold text-sm text-black">
            Fund Wallet
          </h3>
          <p className="text-xs text-[#535353] mt-0.5">
            Add money to your wallet securely
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowFundModal(false)}
        className="text-[#535353] hover:text-gray-600 transition cursor-pointer"
      >
        ✕
      </button>
    </div>

    {/* Progress */}
    <div className="flex items-center justify-between text-xs text-[#535353]">
      <span className="flex items-center gap-2 text-[#3E83C4]">
        <span className="w-2 h-2 bg-[#3E83C4] rounded-full"></span>
        Amount
      </span>
      <span>Verify</span>
    </div>

    {/* Amount Input */}
    <div className="space-y-1">
      <label className="text-sm text-[#535353]">Enter Amount</label>
      <input
        placeholder="₦ 0"
        className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none focus:border-[#3E83C4]"
      />
    </div>

    {/* Preset Buttons */}
    <div className="grid grid-cols-4 gap-2 text-xs">
      {["₦1,000","₦2,500","₦5,000","₦10,000"].map((amt) => (
        <button
          key={amt}
          className="bg-[#EEF6FF] text-[#3E83C4] py-2 rounded-md hover:bg-[#E2EFFF] transition"
        >
          {amt}
        </button>
      ))}
    </div>

    {/* Secure Info Box */}
    <div className="flex gap-3 bg-[#EEF7FF] border border-[#CFE3F8] p-3 rounded-md text-xs text-gray-600">
      <img src={secure} alt="secure" className="w-8 h-8" />

      <p>
        <span className="font-medium text-black">Secure Payment</span><br />
        Your payment will be processed securely through our payment gateway. 
        You'll receive a verification code to complete the transaction.
      </p>
    </div>

    {/* CTA */}
    <button
      onClick={() => {
        setFundStep("processing");
        // setTimeout(() => setFundStep("success"), 2000);
      }}
      className="w-full bg-[#3E83C4] hover:bg-[#2D75B8] text-white py-2.5 rounded-md text-sm font-medium transition cursor-pointer"
    >
      Continue
    </button>
    

    {/* Cancel */}
    <button
      onClick={() => setShowFundModal(false)}
      className="w-full text-sm text-[#3E83C4] hover:underline cursor-pointer"
    >
      Cancel
    </button>
  </div>
)}

{/* Fund Processing */}
{fundStep === "processing" && (
  <div className="p-6 space-y-6">

    {/* Header */}
    <div className="flex items-start justify-between">
      <button
        onClick={() => setFundStep("form")}
        className="text-sm text-[#3E83C4] flex items-center gap-1"
      >
        ← Back
      </button>

      <button
        onClick={() => setShowFundModal(false)}
        className="text-[#535353] hover:text-gray-600"
      >
        ✕
      </button>
    </div>

    {/* Title */}
    <div className="flex items-start gap-3">
      <img src={shieldBlue} className="w-10 h-10" />

      <div>
        <h3 className="font-semibold text-base text-black">
          Payment Verification
        </h3>
        <p className="text-xs text-[#535353] leading-relaxed mt-0.5">
          Enter the verification code sent to your email to complete payment
        </p>
      </div>
    </div>

    {/* Progress Bar */}
    <div className="flex items-center justify-between text-xs text-[#535353]">
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 bg-[#3E83C4] rounded-full"></span>
        Amount
      </span>

      <div className="flex-1 h-[2px] bg-[#3E83C4] mx-2 rounded"></div>

      <span className="flex items-center gap-2 text-[#3E83C4]">
        <span className="w-2 h-2 bg-[#3E83C4] rounded-full"></span>
        Verify
      </span>
    </div>

    {/* Verification Box */}
    <div className="flex gap-3 bg-[#EEF7FF] border border-[#CFE3F8] p-3 rounded-md text-xs text-gray-600">
      <img src={shieldGreen} className="w-8 h-8" />

      <div>
        <p className="font-medium text-black">
          Enter Verification Code
        </p>
        <p>
          Check your email or SMS for the verification code sent to complete this transaction
        </p>
      </div>
    </div>

    {/* Code Input */}
    <input
      placeholder="Enter Code"
      className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none focus:border-[#3E83C4]"
    />

    {/* Transaction Summary */}
    <div className="bg-[#EEF7FF] rounded-md p-4 text-sm flex justify-between">
      <span className="text-[#535353]">Transaction Amount</span>
      <span className="font-semibold text-black">₦10,000</span>
      {/* <span className="text-gray-600">Reference:</span> */}
    </div>

    {/* CTA */}
    <button
      onClick={() => setFundStep("success")}
      className="w-full bg-[#3E83C4] hover:bg-[#2D75B8] text-white py-2.5 rounded-md text-sm font-medium transition cursor-pointer"
    >
      Complete Payment
    </button>

    {/* Cancel */}
    <button
      onClick={() => setShowFundModal(false)}
      className="w-full text-sm text-[#3E83C4] hover:underline cursor-pointer"
    >
      Cancel
    </button>
  </div>
)}


{/* Fund Success */}
{fundStep === "success" && (
  <div className="p-8 text-center space-y-4">

    <img src={success} className="w-14 mx-auto" />

    <h3 className="font-semibold text-black">Payment Successful</h3>

    <p className="text-sm text-[#535353]">
      Your wallet has been successfully funded your Fixserv wallet.
    </p>

    {/* <button
      onClick={() => {
        setShowFundModal(false);
        setFundStep("form");
      }}
      className="w-full bg-[#3E83C4] text-white py-2 rounded-md text-sm"
    >
      Done
    </button> */}
  </div>
)}
    </div>
  </div>
)}

{showWithdrawModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
)}

{showWithdrawModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
    <div className="bg-white w-full max-w-[380px] rounded-xl shadow-2xl border border-gray-200 overflow-hidden">

{/* Withdraw Form */}
{withdrawStep === "form" && (
  <div className="p-6 space-y-8">

    {/* Header */}
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2">
        <img src={icon} className="w-8" />
        <div>
          <h3 className="text-sm font-semibold text-black">
            Withdraw Funds
          </h3>
          <p className="text-xs text-[#535353] leading-tight">
            Withdraw money securely
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowWithdrawModal(false)}
        className="text-[#535353] hover:text-black transition cursor-pointer"
      >
        ✕
      </button>
    </div>

    {/* Progress Bar */}
    <div className="flex items-center justify-between text-xs text-[#535353]">
      <div className="flex items-center gap-2 text-[#3E83C4]">
        <span className="w-2 h-2 bg-[#3E83C4] rounded-full" />
        <span>Account Details</span>
      </div>

      <span>Withdraw</span>
    </div>

    {/* Current Balance */}
    <div className="flex items-center justify-between bg-[#EEF7FF] border border-[#CFE3F8] rounded-lg px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        <img src={current} className="w-8" />
        <span className="text-[#535353]">Current Balance</span>
      </div>

      <span className="font-semibold text-black">₦10,000</span>
    </div>

    {/* Bank */}
    <div className="space-y-4">

      <div>
        <label className="text-sm text-[#535353] flex items-center gap-2 mb-1">
          <img src={bank} className="w-8" />
          Bank
        </label>

        <select className="w-full border border-[#87AACB] rounded-md px-3 py-2 text-sm outline-none cursor-pointer">
          <option>Select Bank</option>
          <option>Access Bank</option>
          <option>GTBank</option>
          <option>UBA</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-[#535353] flex items-center gap-2 mb-1">
          <img src={card} className="w-8" />
          Account Number
        </label>

        <input
          className="w-full border border-[#87AACB] rounded-md px-3 py-2 text-sm outline-none"
          placeholder="Enter Account Number"
        />
      </div>

    </div>

    {/* CTA */}
    <button
      onClick={() => setWithdrawStep("amount")}
      className="w-full bg-[#3E83C4] hover:bg-[#2D75B8] text-white py-1.5 rounded-md text-sm font-medium transition cursor-pointer"
    >
      Verify & Continue
    </button>

    {/* Cancel */}
    <button
      onClick={() => setShowWithdrawModal(false)}
      className="w-full text-sm text-[#3E83C4] hover:underline cursor-pointer"
    >
      Cancel

    </button>

  </div>
)}

{/* Withdraw Amount */}
{withdrawStep === "amount" && (
  <div className="px-6 pt-5 pb-7">

    {/* Top Bar */}
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => setWithdrawStep("form")}
        className="flex items-center gap-1 text-sm text-[#3E83C4] hover:underline cursor-pointer"
      >
        ← Back
      </button>

      <button
        onClick={() => setShowWithdrawModal(false)}
        className="text-[#535353] hover:text-black transition cursor-pointer"
      >
        ✕
      </button>
    </div>

    {/* Title Block */}
    <div className="flex items-center gap-3 mb-4">
      <img src={icon} className="w-8 h-8" />
      <div>
        <h3 className="text-sm font-semibold text-black leading-tight">
          Enter Amount
        </h3>
        <p className="text-xs text-[#535353] leading-tight">
          Withdraw money securely
        </p>
      </div>
    </div>

    {/* Progress Bar */}
    <div className="flex items-center justify-between text-xs text-[#535353] mb-6">
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 bg-[#3E83C4] rounded-full" />
        Account Details
      </span>

      <div className="flex-1 mx-3 h-[2px] bg-[#3E83C4]/40 rounded" />

      <span className="flex items-center gap-2 text-[#3E83C4]">
        Withdraw
        <span className="w-2 h-2 bg-[#3E83C4] rounded-full" />
      </span>
    </div>

    {/* Amount Input */}
    <div className="mb-4">
      <label className="block text-sm text-[#535353] mb-1">
        Enter Amount
      </label>

      <input
        placeholder="₦ 0"
        className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none focus:border-[#3E83C4]"
      />
    </div>

    {/* Preset Buttons */}
    <div className="grid grid-cols-4 gap-2 mb-10 text-xs">
      {["₦1,000","₦2,500","₦5,000","₦10,000"].map((amt) => (
        <button
          key={amt}
          className="bg-[#EEF6FF] text-[#3E83C4] py-2 rounded-md hover:bg-[#E2EFFF] transition cursor-pointer"
        >
          {amt}
        </button>
      ))}
    </div>

    {/* Withdraw Button */}
    <div className="flex justify-center mb-3">
      <button
        onClick={() => setWithdrawStep("success")}
        className="bg-[#3E83C4] hover:bg-[#2D75B8] text-white w-56 py-2.5 rounded-md text-sm font-medium transition cursor-pointer"
      >
        Withdraw
      </button>
    </div>

    {/* Cancel */}
    <div className="text-center">
      <button
        onClick={() => setShowWithdrawModal(false)}
        className="text-sm text-[#3E83C4] hover:underline cursor-pointer"
      >
        Cancel
      </button>
    </div>

  </div>
)}

{/* Withdraw success */}
{withdrawStep === "success" && (
  <div className="p-8 text-center space-y-4">

    <img src={success} className="w-14 mx-auto" />

    <h3 className="font-semibold text-black">Withdraw Successful</h3>

    <p className="text-sm text-[#535353]">
      Your funds have been successfully transferred to your bank account..
    </p>

    
  </div>
)}

    </div>
  </div>
)}




        </div>
        </div>

      </section>



    <section className="w-full overflow-hidden">
  <div className="max-w-7xl mx-auto px-2 md:px-6">
      <div className="grid grid-cols-[1fr_2fr] gap-8">

    {/* LEFT — Contact Info */}
    <div className="border border-[#3E83C4] rounded-xl p-6 bg-[#F6FBFF]">
      <h3 className="font-semibold text-black text-xl mb-4">
        Contact Info
      </h3>

      <div className="bg-white rounded-lg shadow-lg p-4 space-y-4 text-lg text-gray-600">

        <div className="flex items-center gap-2">
          <img src={email} alt="" className="w-5 h-5" />
          <span>praiseoluwazob@gmail.com</span>
        </div>

        <div className="flex items-center gap-2">
          <img src={locationBlue} alt="" className="w-5 h-4" />
          <span>23, Allen Avenue, Ikeja, Lagos.</span>
        </div>

        <div className="flex items-center gap-2">
          <img src={phone} alt="" className="w-5 h-5" />
          <span>07082240158</span>
        </div>

      </div>
    </div>

    {/* RIGHT — Items Uploaded */}
    <div className="border border-[#3E83C4] rounded-xl bg-[#F6FBFF] p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-black text-xl flex items-center gap-2">
          <img src={item} alt="" className="w-9 h-8" />
          Items Uploaded
        </h3>

        <button onClick={() => navigate("/upload-item")} className="border border-[#3E83C4] text-[#3E83C4] px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-[#3E83C4] hover:text-white transition">
          + Upload Item
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4 max-h-[230px] overflow-y-auto">

        {/* Item */}
        <div className="flex gap-4 border-b border-[#C1DAF3] pb-4">
          <img
            src={iphone}
            alt=""
            className="w-28 h-28 rounded-md object-cover"
          />

          <div className="text-lg">
            <h4 className="font-medium text-black">
              Iphone 12
            </h4>
            <p className="text-[#535353]">
              Subject: Screen Repair
            </p>
            <p className="text-[#535353] text-sm mt-1 leading-relaxed">
              Description :The screen is cracked and unresponsive in some areas.
              Needs replacement and full display calibration.
            </p>
          </div>
        </div>

    {/* Item 2 */}
        <div className="flex gap-4 border-b border-[#C1DAF3] pb-4">
          <img
            src={iphone}
            alt=""
            className="w-28 h-28 rounded-md object-cover"
          />

          <div className="text-lg">
            <h4 className="font-medium text-black">
              Iphone 12
            </h4>
            <p className="text-[#535353]">
              Subject: Screen Repair
            </p>
            <p className="text-[#535353] text-sm mt-1 leading-relaxed">
              Description :The screen is cracked and unresponsive in some areas.
              Needs replacement and full display calibration.
            </p>
          </div>
        </div>

  

      </div>
    </div>

  </div>
</div>
</section>

<section className="w-full py-8 overflow-hidden">
  <div className="max-w-7xl mx-auto px-2 md:px-6">

    {/* Booking History Card */}
    <div className="border border-[#5F8EBA] rounded-xl p-6 bg-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <img src={item} alt="item" className="w-9 h-8" />
          <h3 className="font-semibold text-lg text-black">
            Booking History
          </h3>
        </div>

        <button onClick={() => navigate("/repair")} className="text-[#3E83C4] text-lg hover:underline cursor-pointer">
          View All History
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-lg">
          <thead>
            <tr className="bg-[#ECF0F5] text-[#656565] text-left rounded-lg">
              <th className="py-3 px-4 font-medium">Booking ID</th>
              <th className="py-3 px-4 font-medium">Device</th>
              <th className="py-3 px-4 font-medium">Technician</th>
              <th className="py-3 px-4 font-medium">Payment Status</th>
              <th className="py-3 px-4 font-medium">Cost</th>
              <th className="py-3 px-4 font-medium">Progress</th>
            </tr>
          </thead>

          <tbody className="text-[#535353] text-lg">
            {[
              {
                status: "Paid",
                color: "bg-[#C9E8CA] text-[#43A047]",
                progress: "Received",
              },
              {
                status: "Pending",
                color: "bg-[#FFF0D9] text-[#F99F10]",
                progress: "Not Started",
              },
              {
                status: "Pending",
                color: "bg-[#FFF0D9] text-[#F99F10]",
                progress: "Not Started",
              },
              {
                status: "Paid",
                color: "bg-[#C9E8CA] text-[#43A047]",
                progress: "Received",
              },
              {
                status: "Paid",
                color: "bg-[#C9E8CA] text-[#43A047]",
                progress: "Received",
              },
            ].map((row, i) => (
              <tr key={i}>
                <td className="py-4 px-4">#FX1230</td>
                <td className="py-4 px-4">iPhone 12</td>
                <td className="py-4 px-4">John Adewale</td>

                {/* Payment Status */}
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 w-fit ${row.color}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {row.status}
                  </span>
                </td>

                {/* Cost */}
                <td className="py-4 px-4 font-semibold">
                  ₦45,000
                </td>

                {/* Progress */}
                <td className="py-4 px-4">
                  {row.progress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Logout Button */}
    <div className="mt-10">
      <button className="flex items-center gap-2 bg-[#ED3528] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition cursor-pointer">
        <img src={logOut} alt="logout" className="w-4 h-4" />
        Log Out
      </button>
    </div>

  </div>
</section>


    </div>
  );
};

export default UserProfile;
