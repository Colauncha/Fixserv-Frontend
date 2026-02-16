// import React,{ useState, useEffect } from "react";
// import PraiseImg from "../../assets/client images/client-home/PraiseAzobu.jpg";
// import camera from "../../assets/client images/client-home/capture.png";
// import profile from "../../assets/client images/client-home/person.png";
// import home from "../../assets/client images/client-home/home.png";
// import wallet from "../../assets/client images/client-home/walletpay.png";
// import mCard from "../../assets/client images/client-home/m-card.png";
// import visa from "../../assets/client images/client-home/vvisa.png";
// import lock from "../../assets/client images/client-home/lock.png";
// import passwordIcon from "../../assets/client images/client-home/password.png";
// import bell from "../../assets/client images/client-home/bell.png";
// import luck from "../../assets/client images/client-home/luck.png"
// import unlock from "../../assets/client images/client-home/unlock.png";
// import card from "../../assets/client images/client-home/blurCard.png";
// import success from "../../assets/client images/client-home/success.png";
// import fund from "../../assets/client images/client-home/fundlock.png";

// import { useNavigate } from "react-router-dom";
// import { getAuthUser, getAuthToken } from "../../utils/auth";


// const ProfileSettings = () => {

//   const [profileImage, setProfileImage] = useState(PraiseImg);
// const [uploading, setUploading] = useState(false);

// const [formData, setFormData] = useState({
//   fullName: "",
//   email: "",
//   phone: "",
// });


// const handleProfileUpload = async (file) => {
//   if (!file) return;

//   if (file.size > 1024 * 1024) {
//     alert("Image must not be more than 1MB");
//     return;
//   }

//   const user = getAuthUser();
//   const token = getAuthToken();

//   if (!user?.id) {
//     alert("User not found");
//     return;
//   }

//   const uploadData = new FormData();
//   uploadData.append("profilePicture", file);

//   try {
//     setUploading(true);

//     const res = await fetch(
//       `https://user-management-h4hg.onrender.com/api/upload/${user.id}/profile-picture`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: uploadData,
//       }
//     );

// const data = await res.json();

// if (!res.ok) {
//   throw new Error(data.message || "Upload failed");
// }

// const imageUrl = data?.imageUrl || data?.user?.profilePicture;

// if (imageUrl) {
//   setProfileImage(imageUrl);

//   const storedUser = JSON.parse(localStorage.getItem("fixserv_user") || "{}");
//   storedUser.profilePicture = imageUrl;
//   localStorage.setItem("fixserv_user", JSON.stringify(storedUser));
// }


//   } catch (err) {
//     console.error(err);
// alert(err.message || "Something went wrong");

//   } finally {
//     setUploading(false);
//   }
// };

// const handleProfileUpdate = async () => {
//   const user = getAuthUser();
//   const token = getAuthToken();

//   if (!user?.id) return;

//   try {
//     const res = await fetch(
//       `https://user-management-h4hg.onrender.com/api/admin/user/${user.id}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Update failed");
//     }

//     alert("Profile updated successfully");

//     // update localStorage
//     const storedUser = JSON.parse(localStorage.getItem("fixserv_user") || "{}");
//     localStorage.setItem(
//       "fixserv_user",
//       JSON.stringify({ ...storedUser, ...formData })
//     );

//   } catch (err) {
//     alert(err.message);
//   }
// };



// // const [profileData, setProfileData] = useState({
// //   fullName: "",
// //   email: "",
// //   phone: "",
// // });

// const handleChange = (e) => {
//   const { name, value } = e.target;
//   setFormData((prev) => ({
//     ...prev,
//     [name]: value,
//   }));
// };


// useEffect(() => {
//   const fetchProfile = async () => {
//     const user = getAuthUser();
//     const token = getAuthToken();

//     if (!user?.id) return;

//     try {
//       const res = await fetch(
//         `https://user-management-h4hg.onrender.com/api/admin/user/${user.id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const data = await res.json();

//       const profile = data?.data;

//       setFormData({
//         fullName: profile?.fullName || "",
//         email: profile?.email || "",
//         phone: profile?.phone || "",
//       });

//       if (profile?.profilePicture) {
//         setProfileImage(profile.profilePicture);
//       }

//     } catch (err) {
//       console.log(err);
//     }
//   };

//   fetchProfile();
// }, []);


// useEffect(() => {
//   const user = getAuthUser();
//   if (user?.profilePicture) {
//     setProfileImage(user.profilePicture);
//   }
// }, []);




//   const navigate = useNavigate();

//   const notifications = [
//     {
//       title: "News",
//       desc: "News about products and feature updates",
//     },
//     {
//       title: "Updates",
//       desc: "Feature updates",
//     },
//     {
//       title: "User Research",
//       desc: "Get involved in our beta testing program or participate in paid product user research",
//     },
//     {
//       title: "Reminders",
//       desc: "These are notifications to remind you of updates and repair progress",
//     },
//   ];

//   const min = 0;
//   const max = 10000;

//   const [enabled, setEnabled] = useState(
//     notifications.map(() => false)
//   );

//   const [value, setValue] = useState(10000);

//   const percentage = ((value - min) / (max - min)) * 100;

//   // const [pendingAction, setPendingAction] = useState(null);
//   const [showLockModal, setShowLockModal] = useState(false);
// const [showUnlockModal, setShowUnlockModal] = useState(false);
// const [showSuccess, setShowSuccess] = useState(null); 
  

//   const toggleItem = (index) => {
//     setEnabled((prev) =>
//       prev.map((item, i) => (i === index ? !item : item))
//     );
//   };

//   const [showAddCard, setShowAddCard] = useState(false);
// const [showAddSuccess, setShowAddSuccess] = useState(false);


//   return (
//     <div className="w-full">
//       {/* <section className="w-full px-24 md:px-60 py-14"> */}
//         <section className="w-full py-14 overflow-hidden">
//   <div className="max-w-7xl mx-auto px-2 md:px-6">

//         {/* Back */}
//         <button onClick={() => navigate("/profile")} className="text-sm text-[#3E83C4] mb-10 flex items-center gap-1 hover:underline">
//           ← Back
//         </button>

//        {/* Center Container */}
// <div className="flex flex-col items-center text-center gap-3">

//   {/* Image + upload icon */}
//   <div className="relative w-[200px] h-[200px]">
//     {/* <img
//       src={PraiseImg}
//       alt="Profile"
//       className="w-full h-full object-cover"
//     />

    
//     <label className="absolute bottom-0 right-0 p-2 cursor-pointer">
//       <img src={camera} alt="Upload" className="w-12 h-12" />
//       <input type="file" className="hidden" />
//     </label> */}
//     <img
//   src={profileImage}
//   alt="Profile"
//   className="w-full h-full object-cover rounded-2xl"
// />

// <label className="absolute bottom-0 right-0 p-2 cursor-pointer">
//   {uploading && (
//   <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl text-white text-sm">
//     Uploading...
//   </div>
// )}

//   <img src={camera} alt="Upload" className="w-12 h-12" />
//   <input
//     type="file"
//     accept="image/*"
//     className="hidden"
//     onChange={(e) => handleProfileUpload(e.target.files[0])}
//   />
// </label>

//   </div>

//   {/* Profile Picture Title */}
//   <h2 className="text-lg font-semibold">
//     Profile Picture
//   </h2>

//   {/* Description */}
//   <p className="text-sm text-[#656565]">
//     This will be displayed on your profile
//   </p>

//   {/* Image note */}
//   <p className="text-xs text-[#3E83C4]">
//     Image must not be more than 1 mb
//   </p>
// </div>

//       </div>
//       </section>


// {/* <section className="max-w-4xl mx-auto bg-white p-6 rounded-md"> */}
//   <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
//   <div className="max-w-7xl mx-auto px-2 md:px-6">
//   {/* Header */}
//   <div className="flex items-center gap-2 mb-6">
//     <img src={profile} alt="profile icon" className="w-5 h-5" />
//     <h2 className="text-lg font-semibold text-black">
//       Personal Information
//     </h2>
//   </div>

//   {/* Form Grid */}
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//     {/* Name */}
//     <div>
//       <label className="block text-sm text-[#535353] mb-1">
//         Name
//       </label>
//       <input
//   name="fullName"
//   value={formData.fullName}
//   onChange={(e) =>
//     setFormData({ ...formData, fullName: e.target.value })
//   }
//   type="text"
//   className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       />

        
//       {/* <input
//       value={profileData.fullName}
//   onChange={(e) =>
//     setProfileData({ ...profileData, fullName: e.target.value })
//   }
//         type="text"
//         className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       /> */}
//     </div>

//     {/* Email */}
//     <div>
//       <label className="block text-sm text-[#535353] mb-1">
//         Email Address
//       </label>
//       <input
//   type="email"
//   value={formData.email}
//   // value={profileData.email}
//   disabled
//   onChange={handleChange}
//   className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none bg-gray-100 cursor-not-allowed"
// />

//     </div>

//     {/* Service Preference */}
//     <div>
//       <label className="block text-sm text-[#535353] mb-1">
//         Service Preference
//       </label>
//       <input
//         type="text"
//         placeholder="Enter New Service Preference"
//         className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       />

//       {/* Tags */}
//       <div className="flex flex-wrap gap-2 mt-2">
//         <span className="bg-[#D3E4F4] text-[#3E83C4] text-xs px-3 py-1 rounded-full">
//           General ✕
//         </span>
//         <span className="bg-[#D3E4F4] text-[#3E83C4] text-xs px-3 py-1 rounded-full">
//           Phone Repair ✕
//         </span>
//         <span className="bg-[#D3E4F4] text-[#3E83C4] text-xs px-3 py-1 rounded-full">
//           Tablet Repair ✕
//         </span>
//       </div>
//     </div>

//     {/* Phone Number */}
//     <div>
//       <label className="block text-xs text-[#535353] mb-1">
//         Phone Number
//       </label>
//       <input
//   name="phone"
//   value={formData.phone}
//   onChange={(e) =>
//     setFormData({ ...formData, phone: e.target.value })
//   }
//   type="text"
//   className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       />

        
//     </div>
//   </div>

//   {/* Update Button */}
//   <div className="flex justify-end mt-6">
//     <button
//   onClick={handleProfileUpdate}
//   className="bg-blue-600 text-white text-sm px-6 py-2 rounded-md cursor-pointer"
// >
//   Update
// </button>


//   </div>
// </div>
// </section>

// {/* <section className="max-w-4xl mx-auto bg-white p-6 rounded-md"> */}
//   <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
//   <div className="max-w-7xl mx-auto px-2 md:px-6">
//   <hr className="border-[#C1DAF3] mt-2 mb-8" />
//   {/* Header */}
//   <div className="flex items-center gap-2 mb-6">
//     <img src={home} alt="profile icon" className="w-5 h-5" />
//     <h2 className="text-lg font-semibold text-black">
//       Home Address  
//     </h2>
//   </div>

//   {/* Form Grid */}
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//     {/* Name */}
//     <div>
//       <label className="block text-xs text-[#535353] mb-1">
//         Country
//       </label>
//       <input
//         type="text"
//         defaultValue="Nigeria"
//         className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       />
//     </div>

//     {/* Email */}
//     <div>
//       <label className="block text-xs text-[#535353] mb-1">
//         State
//       </label>
//       <input
//         type="text"
//         defaultValue="Lagos"
//         className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       />
//     </div>

//     {/* Service Preference */}
//     <div>
//       <label className="block text-xs text-[#535353] mb-1">
//         City
//       </label>
//       <input
//         type="text"
//         placeholder="Ikeja"
//         className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       />
//     </div>

//     {/* Phone Number */}
//     <div>
//       <label className="block text-xs text-[#535353] mb-1">
//         Street
//       </label>
//       <input
//         type="text"
//         defaultValue="12, Adeola Odeku St, Victoria Island"
//         className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       />
//     </div>
//     <div>
//       <label className="block text-xs text-[#535353] mb-1">
//         Postal Code 
//       </label>
//       <input
//         type="text"
//         defaultValue="110211"
//         className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       />
//     </div>
//   </div>

//   {/* Update Button */}
//   <div className="flex justify-end mt-6">
//     <button
//   onClick={() => alert("Profile update API coming soon")}
//   className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md"
// >
//   Update
// </button>

//   </div>
// </div>
// </section>

// {/* <section className="max-w-4xl mx-auto bg-white p-6 rounded-md"> */}
//   <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
//   <div className="max-w-7xl mx-auto px-2 md:px-6">
//   {/* Header */}
//   <div className="flex items-center gap-2 mb-6">
//     <img src={wallet} alt="wallet" className="w-5 h-5" />
//     <h2 className="text-lg font-semibold text-black">Wallet</h2>
//   </div>

//   {/* Saved Payment Methods */}
//   <div className="flex justify-between items-center mb-4">
//     <p className="text-sm font-medium text-[#535353]">
//       Saved Payment Methods
//     </p>
//  <button
//   onClick={() => setShowAddCard(true)}
//   className="border border-[#3E83C4] text-[#3E83C4] text-sm px-3 py-1 rounded-md flex items-center gap-1 hover:bg-[#3E83C4] hover:text-white cursor-pointer"
// >
//   + Add New Card
// </button>

//   </div>

//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//     {/* Default Card */}
//     <div>
//       <label className="block text-sm text-gray-600 mb-1">
//         Default Card
//       </label>
//       <div className="flex items-center gap-3 border border-[#9BAAB9] rounded-md px-3 py-2">
//         <img src={mCard} alt="mastercard" className="w-8" />
//         <span className="text-sm text-[#535353]">
//           XXXX XXXX XXXX 3240
//         </span>
//       </div>
//     </div>

//     {/* Other Cards */}
//     <div>
//       <label className="block text-sm text-[#535353] mb-1">
//         Other Cards
//       </label>
//       <div className="flex items-center gap-3 border border-[#9BAAB9] rounded-md px-3 py-2">
//         <img src={visa} alt="visa" className="w-8" />
//         <span className="text-sm text-[#535353]">
//           XXXX XXXX XXXX 3240
//         </span>
//       </div>
//     </div>
//   </div>

//   {/* Locked Balance */}
//   <div className="mb-8">
//     <p className="text-xs font-medium text-[#535353] mb-1">
//       Set Locked Balance
//     </p>
//     <p className="text-sm text-gray-500 mb-3">
//       Set aside funds in your wallet for safekeeping. You'll need your wallet PIN to unlock and use them.
//     </p>

//     <div className="relative">
//       <input
//         type="text"
//         defaultValue="₦100,000"
//         className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       />
//       <img
//         src={lock}
//         alt="lock"
//         className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2"
//       />
//     </div>

   
//     <div className="flex gap-4 mt-4 justify-center">
// <button
//   onClick={() => setShowUnlockModal(true)}
//   className="border border-[#3E83C4] text-[#3E83C4] text-sm px-6 py-3 rounded-md hover:bg-[#3E83C4] hover:text-white cursor-pointer"
// >
//   Unlock Funds
// </button>

// <button
//   onClick={() => setShowLockModal(true)}
//   className="bg-[#3E83C4] text-white text-sm px-6 py-3 rounded-md flex items-center gap-1 hover:bg-[#356bb3] cursor-pointer"
// >
//   Lock Funds +
// </button>

// </div>

//   </div>

//   {/* Bank Account Details */}
//   <div className="mb-8">
//     <p className="text-sm font-medium text-[#535353] mb-4">
//       Bank Account Details (for Withdrawals)
//     </p>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div>
//         <label className="block text-sm text-[#535353] mb-1">
//           Account Name
//         </label>
//         <input
//           type="text"
//           defaultValue="Praise Azobu"
//           className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
//         />
//       </div>

//       <div>
//         <label className="block text-sm text-[#535353] mb-1">
//           Bank Name
//         </label>
//         <input
//           type="text"
//           defaultValue="GTBank"
//           className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//         />
//       </div>

//       <div>
//         <label className="block text-sm text-[#535353] mb-1">
//           Account Number
//         </label>
//         <input
//           type="text"
//           defaultValue="0123456789"
//           className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//         />
//       </div>
//     </div>
//   </div>

//   {/* Low Balance Alert */}
// <div className="mb-8">
//   {/* Toggle + Label */}
//   <div className="flex items-center gap-3 mb-3">
//     <div
//       onClick={() => setEnabled(!enabled)}
//       className={`w-8 h-4 rounded-full relative cursor-pointer transition ${
//         enabled ? "bg-[#3E83C4]" : "bg-[#535353]"
//       }`}
//     >
//       <div
//         className={`w-4 h-4 bg-white rounded-full absolute top-0 shadow transition ${
//           enabled ? "right-0" : "left-0"
//         }`}
//       />
//     </div>

//     <p className="text-sm text-[#535353]">
//       Low balance alert ₦{value.toLocaleString()}
//     </p>
//   </div>

//   <p className="text-sm text-[#535353] mb-2">
//     Notify if balance is under
//   </p>

//   {/* Slider */}
//   <div className="relative">
//     <div className="w-full h-1 bg-[#9BAAB9] rounded relative">
//       <div
//         className="h-1 bg-[#3E83C4] rounded"
//         style={{ width: `${percentage}%` }}
//       />
//     </div>

//     <input
//       type="range"
//       min={min}
//       max={max}
//       value={value}
//       onChange={(e) => setValue(Number(e.target.value))}
//       className="absolute top-[-6px] left-0 w-full h-4 opacity-0 cursor-pointer"
//       disabled={!enabled}
//     />

//     <div
//       className="w-3 h-3 bg-[#3E83C4] rounded-full absolute -top-1 transform -translate-x-1/2 pointer-events-none"
//       style={{ left: `${percentage}%` }}
//     />

//     {/* ✅ Dynamic labels */}
//     <div className="flex justify-between text-sm text-[#535353] mt-2">
//       <span>₦{value.toLocaleString()}</span>
//       <span>₦{max.toLocaleString()}</span>
//     </div>
//   </div>
// </div>


//   {/* Update Button */}
//   <div className="flex justify-end">
//     <button onClick={() => alert("Profile update API coming soon")} className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md hover:bg-[#356bb3] cursor-pointer">
//       Update
//     </button>
//   </div>
//   {/* Overlay */}
// {(showLockModal || showUnlockModal) && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//     {/* Modal */}
//     <div className="bg-white w-[500px] rounded-xl shadow-lg p-8 relative">

//       {/* Close */}
//       <button
//         onClick={() => {
//           setShowLockModal(false);
//           setShowUnlockModal(false);
//         }}
//         className="absolute top-4 right-4 text-[#535353] hover:text-gray-600"
//       >
//         ✕
//       </button>

//       {/* Header */}
//       <button className="text-sm text-[#3E83C4] mb-4 flex items-center gap-1 cursor-pointer">
//         ← Back
//       </button>

//       {/* Lock Funds */}
//       {showLockModal && (
//         <>
//           {/* <h3 className="text-lg font-semibold mb-2">Lock Funds</h3> */}
//           <div className="flex items-center gap-2 mb-5">
//   <img src={fund} className="w-9 h-9" />
//   <div className="flex flex-col">
//     <span className="text-lg text-black font-medium">Lock Funds</span>
//   <span className="text-xs font-light text-[#535353] ">
//             Your locked balance is safely stored and can only be accessed using your account password
//           </span>
//   </div>
// </div>

          

//           <label className="text-sm text-[#535353]">Enter Amount</label>
//           <input className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm mt-2" placeholder="₦ 0" />

//           <div className="flex gap-12 mt-3 mb-8">
//             {["₦1,000","₦2,500","₦5,000","₦10,000"].map(v => (
//               <button key={v} className="px-3 py-1 text-sm rounded-md bg-[#EEF6FF] text-[#535353]">
//                 {v}
//               </button>
//             ))}
//           </div>

//           <label className="text-sm text-[#535353] mt-4">Password</label>
//           <input type="password" className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm mt-2 mb-5" placeholder="Enter New Password" />
// <button
//   onClick={() => {
//     setShowLockModal(false);
//     setShowUnlockModal(false);

//     // Show success AFTER modal is gone
//     setTimeout(() => {
//       setShowSuccess("lock");
//     }, 100);
//   }}
//   className="w-full bg-[#3E83C4] text-white text-sm py-2 rounded-md mb-2 cursor-pointer"
// >
//   Lock
// </button>   

//         </>
//       )}

//       {/* Unlock Funds */}
//       {showUnlockModal && (
//         <>
//           {/* <h3 className="text-lg font-semibold mb-2">Lock Funds</h3> */}
//           <div className="flex items-center gap-2 mb-5">
//   <img src={fund} className="w-9 h-9" />
//   <div className="flex flex-col">
//     <span className="text-lg text-black font-medium">Unlock Funds</span>
//   <span className="text-xs font-light text-[#535353] ">
//             Your locked funds are safely stored. Unlocking them will make the amount available for payments and withdrawals.
//           </span>
//   </div>
// </div>

          

//           <label className="text-sm text-[#535353]">Enter Amount</label>
//           <input className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm mt-2" placeholder="₦ 0" />

//           <div className="flex gap-12 mt-3 mb-8">
//             {["₦1,000","₦2,500","₦5,000","₦10,000"].map(v => (
//               <button key={v} className="px-3 py-1 text-sm rounded-md bg-[#EEF6FF] text-[#535353]">
//                 {v}
//               </button>
//             ))}
//           </div>

//           <label className="text-sm text-[#535353] mt-4">Password</label>
//           <input type="password" className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm mt-2 mb-5" placeholder="Enter New Password" />

//        <button
//   onClick={() => {
//     setShowLockModal(false);
//     setShowUnlockModal(false);

//     // Show success AFTER modal is gone
//     setTimeout(() => {
//       setShowSuccess("unlock");
//     }, 100);
//   }}
//   className="w-full bg-[#3E83C4] text-white text-sm py-2 rounded-md mb-2 cursor-pointer"
// >
//   Unlock
// </button>



          
//           {/* <button
//   onClick={() => {
//     setShowLockModal(false);
//     setShowSuccess("lock");
//   }}
//   className="w-full bg-[#3E83C4] text-white text-sm py-2 rounded-md mb-2 cursor-pointer"
// >
//   Unlock
// </button> */}

//         </>
//       )}

//       {/* {showSuccess && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//     <div className="bg-white w-[420px] rounded-xl shadow-lg p-8 text-center">

//       <img
//         src={showSuccess === "lock" ? luck : unlock}
//         alt="success"
//         className="w-14 h-14 mx-auto mb-4"
//       />

//       <h3 className="text-lg text-black font-semibold mb-2">
//         {showSuccess === "lock" ? "Funds Locked" : "Funds Unlocked"}
//       </h3>

//       <p className="text-sm text-[#535353] mb-6">
//         {showSuccess === "lock"
//           ? "Locked Balance holds funds you’ve secured. Access requires wallet authentication for added protection."
//           : "Your unlocked funds are available for payments and withdrawals."}
//       </p>

//       <button
//         onClick={() => setShowSuccess(null)}
//         className="bg-[#3E83C4] cursor-pointer text-white text-sm px-8 py-2 rounded-md"
//       >
//         Done
//       </button>
//     </div>
//   </div>
// )} */}

// {showSuccess && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//     <div className="bg-white w-[420px] rounded-xl shadow-lg p-8 text-center">

//       <img
//         src={showSuccess === "lock" ? luck : unlock}
//         alt="success"
//         className="w-14 h-14 mx-auto mb-4"
//       />

//       <h3 className="text-lg text-black font-semibold mb-2">
//         {showSuccess === "lock" ? "Funds Locked" : "Funds Unlocked"}
//       </h3>

//       <p className="text-sm text-[#535353] mb-6">
//         {showSuccess === "lock"
//           ? "Locked Balance holds funds you’ve secured. Access requires wallet authentication for added protection."
//           : "Your unlocked funds are available for payments and withdrawals."}
//       </p>

//       <button
//         onClick={() => setShowSuccess(null)}
//         className="bg-[#3E83C4] cursor-pointer text-white text-sm px-8 py-2 rounded-md"
//       >
//         Done
//       </button>
//     </div>
//   </div>
// )}



//       <div className="text-center">
//         <button
//           onClick={() => {
//             setShowLockModal(false);
//             setShowUnlockModal(false);
//           }}
//           className="text-xs text-[#535353] underline hover:text-gray-600 cursor-pointer"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// )}

// </div>
// </section>
// {showAddCard && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//     <div className="bg-white w-[620px] rounded-xl shadow-lg p-8 relative">

//       {/* Close */}
//       <button
//         onClick={() => setShowAddCard(false)}
//         className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
//       >
//         ✕
//       </button>

//       {/* Back */}
//       <button
//         onClick={() => setShowAddCard(false)}
//         className="text-sm text-[#3E83C4] mb-8 flex items-center gap-1 cursor-pointer"
//       >
//         ← Back
//       </button>

//       {/* Title */}
//       <h2 className="text-center text-black text-xl font-semibold mb-10">
//         Add New Card Modal
//       </h2>

//       {/* Form */}
// <div className="grid grid-cols-2 gap-x-10 gap-y-8 mb-12">

//   {/* Card Number */}
//   <div>
//     <label className="text-sm text-[#535353] block mb-2">
//       Card Number*
//     </label>
//     <input
//       placeholder="XXXX XXXX XXXX XXXX"
//       className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none"
//     />
//   </div>

//   {/* Card Name */}
//   <div>
//     <label className="text-sm text-[#535353] block mb-2">
//       Card Name*
//     </label>
//     <input
//       placeholder="Name"
//       className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none"
//     />
//   </div>

//   {/* Expiry Date — short */}
//   <div className="max-w-[160px]">
//     <label className="text-sm text-[#535353] block mb-2">
//       Expiry Date
//     </label>
//     <input
//       placeholder="MM / YY"
//       className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none"
//     />
//   </div>

//   {/* CVV — slightly wider than expiry */}
//   <div className="max-w-[200px]">
//     <label className="text-sm text-[#535353] block mb-2">
//       CVV
//     </label>

//     <div className="relative">
//       <input
//         placeholder="123"
//         inputMode="numeric"
//         maxLength={4}
//         onInput={(e) => {
//           e.target.value = e.target.value.replace(/\D/g, "");
//         }}
//         className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none"
//       />
//       <img
//         src={card}
//         className="w-5 absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
//       />
//     </div>
//   </div>

// </div>



//       {/* Save Button */}
//       <div className="flex justify-center">
//         <button
//           onClick={() => {
//             setShowAddCard(false);
//             setShowAddSuccess(true);

//             setTimeout(() => {
//               setShowAddSuccess(false);
//             }, 2000);
//           }}
//           className="bg-[#3E83C4] hover:bg-[#356bb3] text-white text-sm px-24 py-3 rounded-md transition cursor-pointer"
//         >
//           Save Card
//         </button>
//       </div>

//     </div>
//   </div>
// )}

// {showAddSuccess && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//     <div className="bg-white w-[400px] rounded-xl shadow-lg p-6 text-center">

//       <img src={success} className="w-16 mx-auto mb-4" />

//       <h3 className="text-xl text-black font-medium mb-2">
//         Payment Method Saved
//       </h3>

//       <p className="text-sm text-[#535353]">
//         Your card has been added successfully and is now available for payments.
//       </p>

//     </div>
//   </div>
// )}


// {/* <section className="max-w-4xl mx-auto bg-white p-6 rounded-md"> */}
//     <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
//   <div className="max-w-7xl mx-auto px-2 md:px-6">
//   <hr className="border-[#C1DAF3] mt-2 mb-8" />
//   {/* Header */}
//   <div className="flex items-center gap-2 mb-6">
//     <img src={passwordIcon} alt="profile icon" className="w-5 h-5" />
//     <h2 className="text-sm font-semibold text-[#000000]">
//       Password 
//     </h2>
//   </div>

//   {/* Form Grid */}
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//     {/* Name */}
//     <div>
//       <label className="block text-sm text-[#535353] mb-1">
//        Current Password
//       </label>
//       <input
//         type="password"
//         placeholder="Enter Current Password"
        
//         className="w-full border border-[9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       />
//     </div>
//     <div>
//       <label className="block text-sm text-[#535353] mb-1">
//        New Password
//       </label>
//       <input
//         type="password"
//         placeholder="Enter New Password"
        
//         className="w-full border border-[9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       />
//     </div>
//     <div>
//       <label className="block text-sm text-[#535353] mb-1">
//        Confirm New Password
//       </label>
//       <input
//         type="password"
//         placeholder="Enter New Password"
        
//         className="w-full border border-[9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
//       />
//     </div>

    
//   </div>

//   {/* Update Button */}
//   <div className="flex justify-end mt-6">
//     <button className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md">
//       Update
//     </button>
//   </div>
// </div>
// </section>


// {/* <section className="max-w-4xl mx-auto bg-white p-6 rounded-md"> */}
//     <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
//   <div className="max-w-7xl mx-auto px-2 md:px-6">
//   {/* Header */}
//   <div className="flex items-start gap-2 mb-6">
//     <img src={bell} alt="bell" className="w-5 h-5 mt-1" />
//     <div>
//       <h2 className="text-sm font-semibold text-black">
//         Email Notifications
//       </h2>
//       <p className="text-xs text-[#535353] max-w-lg">
//         Get emails to find out what is going on in Fixserv when you are not online.
//         You can turn these off whenever you want to.
//       </p>
//     </div>
//   </div>

//   {/* Notification List */}
//    <div className="space-y-6 mb-8">
//       {notifications.map((item, index) => (
//         <div key={index} className="flex items-start gap-4">
//           {/* Toggle (Clickable) */}
//           <div
//             onClick={() => toggleItem(index)}
//             className={`w-9 h-5 rounded-full relative mt-1 flex-shrink-0 cursor-pointer transition ${
//               enabled[index] ? "bg-[#3E83C4]" : "bg-[#535353]"
//             }`}
//           >
//             <div
//               className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition ${
//                 enabled[index] ? "right-0.5" : "left-0.5"
//               }`}
//             />
//           </div>

//           {/* Text */}
//           <div>
//             <p className="text-sm text-black">{item.title}</p>
//             <p className="text-xs text-[#535353] max-w-md">
//               {item.desc}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>

//   {/* Update Button */}
//   <div className="flex justify-end mb-10">
//     <button className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md">
//       Update
//     </button>
//   </div>

//   <hr className="border-[#C1DAF3] mt-2 mb-8" />

//   {/* Delete Account */}
//   <div className="mb-10">
//     <h3 className="text-sm font-semibold text-black mb-1">
//       Delete your account
//     </h3>
//     <p className="text-sm text-[#535353] max-w-lg mb-4">
//       When you delete your account, you lose access to Fixserv account services,
//       and we permanently delete your personal data.
//     </p>

//     <div className="flex items-center gap-2 mb-6">
//       <input type="checkbox" className="w-4 h-4" />
//       <label className="text-sm text-[#535353]">
//         Confirm that I want to delete my account
//       </label>
//     </div>

//     {/* Delete button RIGHT */}
//     <div className="flex justify-end">
//       <button className="bg-red-600 text-white text-sm px-6 py-2 rounded-md cursor-pointer">
//         Delete
//       </button>
//     </div>
//   </div>

//   <hr className="border-[#C1DAF3] mt-2 mb-8" />

//   {/* Save Changes */}
//   <div className="flex justify-center">
//     <button className="bg-[#3E83C4] text-white text-sm px-8 py-2 rounded-md cursor-pointer">
//       Save Changes
//     </button>
//   </div>
// </div>
// </section>



//     </div>
//   );
// };

// export default ProfileSettings;


import React,{ useState, useEffect } from "react";
import PraiseImg from "../../assets/client images/client-home/PraiseAzobu.jpg";
import camera from "../../assets/client images/client-home/capture.png";
import profile from "../../assets/client images/client-home/person.png";
import home from "../../assets/client images/client-home/home.png";
import wallet from "../../assets/client images/client-home/walletpay.png";
import mCard from "../../assets/client images/client-home/m-card.png";
import visa from "../../assets/client images/client-home/vvisa.png";
import lock from "../../assets/client images/client-home/lock.png";
import passwordIcon from "../../assets/client images/client-home/password.png";
import bell from "../../assets/client images/client-home/bell.png";
import luck from "../../assets/client images/client-home/luck.png"
import unlock from "../../assets/client images/client-home/unlock.png";
import card from "../../assets/client images/client-home/blurCard.png";
import success from "../../assets/client images/client-home/success.png";
import fund from "../../assets/client images/client-home/fundlock.png";

import { useNavigate } from "react-router-dom";
// import { getAuthUser, getAuthToken } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext"

const ProfileSettings = () => {

  const [profileImage, setProfileImage] = useState(PraiseImg);
const [uploading, setUploading] = useState(false);
const { user, token, login } = useAuth();

const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  phone: "",
  country: "",
  state: "",
  city: "",
  street: "",
  postalCode: "",
});



const handleProfileUpload = async (file) => {
  if (!file) return;

  if (file.size > 1024 * 1024) {
    alert("Image must not be more than 1MB");
    return;
  }

  if (!user?.id) {
    alert("User not found");
    return;
  }

  const uploadData = new FormData();
  uploadData.append("profilePicture", file);

  try {
    setUploading(true);

    const res = await fetch(
      `https://user-management-h4hg.onrender.com/api/upload/${user.id}/profile-picture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");

    const imageUrl = data?.imageUrl || data?.user?.profilePicture;

    if (imageUrl) {
      login(token, {
        ...user,
        profilePicture: imageUrl,
      });
    }

  } catch (err) {
    alert(err.message || "Something went wrong");
  } finally {
    setUploading(false);
  }
};

const handleProfileUpdate = async () => {
  if (!user?.id) return;

  try {
    const res = await fetch(
      `https://user-management-h4hg.onrender.com/api/admin/user/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");

    // 🔥 USE BACKEND RESPONSE
    login(token, data.user);

    alert("Profile updated successfully");

  } catch (err) {
    alert(err.message);
  }
};



// const handleProfileUpdate = async () => {
//   if (!user?.id) return;

//   try {
//     const res = await fetch(
//       `https://user-management-h4hg.onrender.com/api/admin/user/${user.id}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       }
//     );

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Update failed");

//     login(token, {
//       ...user,
//       ...formData,
//     });

//     alert("Profile updated successfully");

//   } catch (err) {
//     alert(err.message);
//   }
// };




// const [profileData, setProfileData] = useState({
//   fullName: "",
//   email: "",
//   phone: "",
// });

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

useEffect(() => {
  if (user) {
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      country: user.country || "",
      state: user.state || "",
      city: user.city || "",
      street: user.street || "",
      postalCode: user.postalCode || "",
    });

    if (user.profilePicture) {
      setProfileImage(user.profilePicture);
    }
  }
}, [user]);



// useEffect(() => {
//   if (user?.profilePicture) {
//     setProfileImage(user.profilePicture);
//   }
// }, [user]);


  const navigate = useNavigate();

  const notifications = [
    {
      title: "News",
      desc: "News about products and feature updates",
    },
    {
      title: "Updates",
      desc: "Feature updates",
    },
    {
      title: "User Research",
      desc: "Get involved in our beta testing program or participate in paid product user research",
    },
    {
      title: "Reminders",
      desc: "These are notifications to remind you of updates and repair progress",
    },
  ];

  const min = 0;
  const max = 10000;

  const [enabled, setEnabled] = useState(
    notifications.map(() => false)
  );

  const [value, setValue] = useState(10000);

  const percentage = ((value - min) / (max - min)) * 100;

  // const [pendingAction, setPendingAction] = useState(null);
  const [showLockModal, setShowLockModal] = useState(false);
const [showUnlockModal, setShowUnlockModal] = useState(false);
const [showSuccess, setShowSuccess] = useState(null); 
  

  const toggleItem = (index) => {
    setEnabled((prev) =>
      prev.map((item, i) => (i === index ? !item : item))
    );
  };

  const [showAddCard, setShowAddCard] = useState(false);
const [showAddSuccess, setShowAddSuccess] = useState(false);


  return (
    <div className="w-full">
      {/* <section className="w-full px-24 md:px-60 py-14"> */}
        <section className="w-full py-14 overflow-hidden">
  <div className="max-w-7xl mx-auto px-2 md:px-6">

        {/* Back */}
        <button onClick={() => navigate("/profile")} className="text-sm text-[#3E83C4] mb-10 flex items-center gap-1 hover:underline">
          ← Back
        </button>

       {/* Center Container */}
<div className="flex flex-col items-center text-center gap-3">

  {/* Image + upload icon */}
  <div className="relative w-[200px] h-[200px]">
    {/* <img
      src={PraiseImg}
      alt="Profile"
      className="w-full h-full object-cover"
    />

    
    <label className="absolute bottom-0 right-0 p-2 cursor-pointer">
      <img src={camera} alt="Upload" className="w-12 h-12" />
      <input type="file" className="hidden" />
    </label> */}
    <img
  src={profileImage}
  alt="Profile"
  className="w-full h-full object-cover rounded-2xl"
/>

<label className="absolute bottom-0 right-0 p-2 cursor-pointer">
  {uploading && (
  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl text-white text-sm">
    Uploading...
  </div>
)}

  <img src={camera} alt="Upload" className="w-12 h-12" />
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Show preview instantly
  setProfileImage(URL.createObjectURL(file));

  handleProfileUpload(file);
}}

  />
</label>

  </div>

  {/* Profile Picture Title */}
  <h2 className="text-lg font-semibold">
    Profile Picture
  </h2>

  {/* Description */}
  <p className="text-sm text-[#656565]">
    This will be displayed on your profile
  </p>

  {/* Image note */}
  <p className="text-xs text-[#3E83C4]">
    Image must not be more than 1 mb
  </p>
</div>

      </div>
      </section>


{/* <section className="max-w-4xl mx-auto bg-white p-6 rounded-md"> */}
  <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
  <div className="max-w-7xl mx-auto px-2 md:px-6">
  {/* Header */}
  <div className="flex items-center gap-2 mb-6">
    <img src={profile} alt="profile icon" className="w-5 h-5" />
    <h2 className="text-lg font-semibold text-black">
      Personal Information
    </h2>
  </div>

  {/* Form Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Name */}
    <div>
      <label className="block text-sm text-[#535353] mb-1">
        Name
      </label>
      <input
  name="fullName"
  value={formData.fullName}
  onChange={(e) =>
    setFormData({ ...formData, fullName: e.target.value })
  }
  type="text"
  className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
      />

        
      {/* <input
      value={profileData.fullName}
  onChange={(e) =>
    setProfileData({ ...profileData, fullName: e.target.value })
  }
        type="text"
        className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
      /> */}
    </div>

    {/* Email */}
    <div>
      <label className="block text-sm text-[#535353] mb-1">
        Email Address
      </label>
      <input
  type="email"
  value={formData.email}
  // value={profileData.email}
  disabled
  onChange={handleChange}
  className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none bg-gray-100 cursor-not-allowed"
/>

    </div>

    {/* Service Preference */}
    <div>
      <label className="block text-sm text-[#535353] mb-1">
        Service Preference
      </label>
      <input
        type="text"
        placeholder="Enter New Service Preference"
        className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
      />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="bg-[#D3E4F4] text-[#3E83C4] text-xs px-3 py-1 rounded-full">
          General ✕
        </span>
        <span className="bg-[#D3E4F4] text-[#3E83C4] text-xs px-3 py-1 rounded-full">
          Phone Repair ✕
        </span>
        <span className="bg-[#D3E4F4] text-[#3E83C4] text-xs px-3 py-1 rounded-full">
          Tablet Repair ✕
        </span>
      </div>
    </div>

    {/* Phone Number */}
    <div>
      <label className="block text-xs text-[#535353] mb-1">
        Phone Number
      </label>
      <input
  name="phone"
  value={formData.phone}
  onChange={(e) =>
    setFormData({ ...formData, phone: e.target.value })
  }
  type="text"
  className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
      />

        
    </div>
  </div>

  {/* Update Button */}
  <div className="flex justify-end mt-6">
    <button
  onClick={handleProfileUpdate}
  className="bg-blue-600 text-white text-sm px-6 py-2 rounded-md cursor-pointer"
>
  Update
</button>


  </div>
</div>
</section>

{/* <section className="max-w-4xl mx-auto bg-white p-6 rounded-md"> */}
  <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
  <div className="max-w-7xl mx-auto px-2 md:px-6">
  <hr className="border-[#C1DAF3] mt-2 mb-8" />
  {/* Header */}
  <div className="flex items-center gap-2 mb-6">
    <img src={home} alt="profile icon" className="w-5 h-5" />
    <h2 className="text-lg font-semibold text-black">
      Home Address  
    </h2>
  </div>

  {/* Form Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Name */}
    <div>
      <label className="block text-xs text-[#535353] mb-1">
        Country
      </label>
      <input
  name="country"
  value={formData.country}
  onChange={handleChange}
  className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
/>

    </div>

    {/* Email */}
    <div>
      <label className="block text-xs text-[#535353] mb-1">
        State
      </label>
      <input
        type="text"
        value={formData.state}
        onChange={handleChange}
        className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
      />
    </div>

    {/* Service Preference */}
    <div>
      <label className="block text-xs text-[#535353] mb-1">
        City
      </label>
      <input
        type="text"
        name="city"
value={formData.city}
onChange={handleChange}
        placeholder="Ikeja"
        className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
      />
    </div>

    {/* Phone Number */}
    <div>
      <label className="block text-xs text-[#535353] mb-1">
        Street
      </label>
      <input
        type="text"
        name="street"
value={formData.street}
onChange={handleChange}

        defaultValue="12, Adeola Odeku St, Victoria Island"
        className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
      />
    </div>
    <div>
      <label className="block text-xs text-[#535353] mb-1">
        Postal Code 
      </label>
      <input
        type="text"
        defaultValue="110211"
        name="Postal Code"
value={formData.postalCode}
onChange={handleChange}

        className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
      />
    </div>
  </div>

  {/* Update Button */}
  <div className="flex justify-end mt-6">
    <button
 onClick={handleProfileUpdate}
  className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md"
>
  Update
</button>

  </div>
</div>
</section>

{/* <section className="max-w-4xl mx-auto bg-white p-6 rounded-md"> */}
  <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
  <div className="max-w-7xl mx-auto px-2 md:px-6">
  {/* Header */}
  <div className="flex items-center gap-2 mb-6">
    <img src={wallet} alt="wallet" className="w-5 h-5" />
    <h2 className="text-lg font-semibold text-black">Wallet</h2>
  </div>

  {/* Saved Payment Methods */}
  <div className="flex justify-between items-center mb-4">
    <p className="text-sm font-medium text-[#535353]">
      Saved Payment Methods
    </p>
 <button
  onClick={() => setShowAddCard(true)}
  className="border border-[#3E83C4] text-[#3E83C4] text-sm px-3 py-1 rounded-md flex items-center gap-1 hover:bg-[#3E83C4] hover:text-white cursor-pointer"
>
  + Add New Card
</button>

  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    {/* Default Card */}
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        Default Card
      </label>
      <div className="flex items-center gap-3 border border-[#9BAAB9] rounded-md px-3 py-2">
        <img src={mCard} alt="mastercard" className="w-8" />
        <span className="text-sm text-[#535353]">
          XXXX XXXX XXXX 3240
        </span>
      </div>
    </div>

    {/* Other Cards */}
    <div>
      <label className="block text-sm text-[#535353] mb-1">
        Other Cards
      </label>
      <div className="flex items-center gap-3 border border-[#9BAAB9] rounded-md px-3 py-2">
        <img src={visa} alt="visa" className="w-8" />
        <span className="text-sm text-[#535353]">
          XXXX XXXX XXXX 3240
        </span>
      </div>
    </div>
  </div>

  {/* Locked Balance */}
  <div className="mb-8">
    <p className="text-xs font-medium text-[#535353] mb-1">
      Set Locked Balance
    </p>
    <p className="text-sm text-gray-500 mb-3">
      Set aside funds in your wallet for safekeeping. You'll need your wallet PIN to unlock and use them.
    </p>

    <div className="relative">
      <input
        type="text"
        defaultValue="₦100,000"
        className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
      />
      <img
        src={lock}
        alt="lock"
        className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2"
      />
    </div>

   
    <div className="flex gap-4 mt-4 justify-center">
<button
  onClick={() => setShowUnlockModal(true)}
  className="border border-[#3E83C4] text-[#3E83C4] text-sm px-6 py-3 rounded-md hover:bg-[#3E83C4] hover:text-white cursor-pointer"
>
  Unlock Funds
</button>

<button
  onClick={() => setShowLockModal(true)}
  className="bg-[#3E83C4] text-white text-sm px-6 py-3 rounded-md flex items-center gap-1 hover:bg-[#356bb3] cursor-pointer"
>
  Lock Funds +
</button>

</div>

  </div>

  {/* Bank Account Details */}
  <div className="mb-8">
    <p className="text-sm font-medium text-[#535353] mb-4">
      Bank Account Details (for Withdrawals)
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm text-[#535353] mb-1">
          Account Name
        </label>
        <input
          type="text"
          defaultValue="Praise Azobu"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-[#535353] mb-1">
          Bank Name
        </label>
        <input
          type="text"
          defaultValue="GTBank"
          className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
        />
      </div>

      <div>
        <label className="block text-sm text-[#535353] mb-1">
          Account Number
        </label>
        <input
          type="text"
          defaultValue="0123456789"
          className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
        />
      </div>
    </div>
  </div>

  {/* Low Balance Alert */}
<div className="mb-8">
  {/* Toggle + Label */}
  <div className="flex items-center gap-3 mb-3">
    <div
      onClick={() => setEnabled(!enabled)}
      className={`w-8 h-4 rounded-full relative cursor-pointer transition ${
        enabled ? "bg-[#3E83C4]" : "bg-[#535353]"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full absolute top-0 shadow transition ${
          enabled ? "right-0" : "left-0"
        }`}
      />
    </div>

    <p className="text-sm text-[#535353]">
      Low balance alert ₦{value.toLocaleString()}
    </p>
  </div>

  <p className="text-sm text-[#535353] mb-2">
    Notify if balance is under
  </p>

  {/* Slider */}
  <div className="relative">
    <div className="w-full h-1 bg-[#9BAAB9] rounded relative">
      <div
        className="h-1 bg-[#3E83C4] rounded"
        style={{ width: `${percentage}%` }}
      />
    </div>

    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      className="absolute top-[-6px] left-0 w-full h-4 opacity-0 cursor-pointer"
      disabled={!enabled}
    />

    <div
      className="w-3 h-3 bg-[#3E83C4] rounded-full absolute -top-1 transform -translate-x-1/2 pointer-events-none"
      style={{ left: `${percentage}%` }}
    />

    {/* ✅ Dynamic labels */}
    <div className="flex justify-between text-sm text-[#535353] mt-2">
      <span>₦{value.toLocaleString()}</span>
      <span>₦{max.toLocaleString()}</span>
    </div>
  </div>
</div>


  {/* Update Button */}
  <div className="flex justify-end">
    <button onClick={() => alert("Profile update API coming soon")} className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md hover:bg-[#356bb3] cursor-pointer">
      Update
    </button>
  </div>
  {/* Overlay */}
{(showLockModal || showUnlockModal) && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    {/* Modal */}
    <div className="bg-white w-[500px] rounded-xl shadow-lg p-8 relative">

      {/* Close */}
      <button
        onClick={() => {
          setShowLockModal(false);
          setShowUnlockModal(false);
        }}
        className="absolute top-4 right-4 text-[#535353] hover:text-gray-600"
      >
        ✕
      </button>

      {/* Header */}
      <button className="text-sm text-[#3E83C4] mb-4 flex items-center gap-1 cursor-pointer">
        ← Back
      </button>

      {/* Lock Funds */}
      {showLockModal && (
        <>
          {/* <h3 className="text-lg font-semibold mb-2">Lock Funds</h3> */}
          <div className="flex items-center gap-2 mb-5">
  <img src={fund} className="w-9 h-9" />
  <div className="flex flex-col">
    <span className="text-lg text-black font-medium">Lock Funds</span>
  <span className="text-xs font-light text-[#535353] ">
            Your locked balance is safely stored and can only be accessed using your account password
          </span>
  </div>
</div>

          

          <label className="text-sm text-[#535353]">Enter Amount</label>
          <input className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm mt-2" placeholder="₦ 0" />

          <div className="flex gap-12 mt-3 mb-8">
            {["₦1,000","₦2,500","₦5,000","₦10,000"].map(v => (
              <button key={v} className="px-3 py-1 text-sm rounded-md bg-[#EEF6FF] text-[#535353]">
                {v}
              </button>
            ))}
          </div>

          <label className="text-sm text-[#535353] mt-4">Password</label>
          <input type="password" className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm mt-2 mb-5" placeholder="Enter New Password" />
<button
  onClick={() => {
    setShowLockModal(false);
    setShowUnlockModal(false);

    // Show success AFTER modal is gone
    setTimeout(() => {
      setShowSuccess("lock");
    }, 100);
  }}
  className="w-full bg-[#3E83C4] text-white text-sm py-2 rounded-md mb-2 cursor-pointer"
>
  Lock
</button>   

        </>
      )}

      {/* Unlock Funds */}
      {showUnlockModal && (
        <>
          {/* <h3 className="text-lg font-semibold mb-2">Lock Funds</h3> */}
          <div className="flex items-center gap-2 mb-5">
  <img src={fund} className="w-9 h-9" />
  <div className="flex flex-col">
    <span className="text-lg text-black font-medium">Unlock Funds</span>
  <span className="text-xs font-light text-[#535353] ">
            Your locked funds are safely stored. Unlocking them will make the amount available for payments and withdrawals.
          </span>
  </div>
</div>

          

          <label className="text-sm text-[#535353]">Enter Amount</label>
          <input className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm mt-2" placeholder="₦ 0" />

          <div className="flex gap-12 mt-3 mb-8">
            {["₦1,000","₦2,500","₦5,000","₦10,000"].map(v => (
              <button key={v} className="px-3 py-1 text-sm rounded-md bg-[#EEF6FF] text-[#535353]">
                {v}
              </button>
            ))}
          </div>

          <label className="text-sm text-[#535353] mt-4">Password</label>
          <input type="password" className="w-full border border-[#9BAAB9] rounded-md px-3 py-2 text-sm mt-2 mb-5" placeholder="Enter New Password" />

       <button
  onClick={() => {
    setShowLockModal(false);
    setShowUnlockModal(false);

    // Show success AFTER modal is gone
    setTimeout(() => {
      setShowSuccess("unlock");
    }, 100);
  }}
  className="w-full bg-[#3E83C4] text-white text-sm py-2 rounded-md mb-2 cursor-pointer"
>
  Unlock
</button>



          
          {/* <button
  onClick={() => {
    setShowLockModal(false);
    setShowSuccess("lock");
  }}
  className="w-full bg-[#3E83C4] text-white text-sm py-2 rounded-md mb-2 cursor-pointer"
>
  Unlock
</button> */}

        </>
      )}

      {/* {showSuccess && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-[420px] rounded-xl shadow-lg p-8 text-center">

      <img
        src={showSuccess === "lock" ? luck : unlock}
        alt="success"
        className="w-14 h-14 mx-auto mb-4"
      />

      <h3 className="text-lg text-black font-semibold mb-2">
        {showSuccess === "lock" ? "Funds Locked" : "Funds Unlocked"}
      </h3>

      <p className="text-sm text-[#535353] mb-6">
        {showSuccess === "lock"
          ? "Locked Balance holds funds you’ve secured. Access requires wallet authentication for added protection."
          : "Your unlocked funds are available for payments and withdrawals."}
      </p>

      <button
        onClick={() => setShowSuccess(null)}
        className="bg-[#3E83C4] cursor-pointer text-white text-sm px-8 py-2 rounded-md"
      >
        Done
      </button>
    </div>
  </div>
)} */}

{showSuccess && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-[420px] rounded-xl shadow-lg p-8 text-center">

      <img
        src={showSuccess === "lock" ? luck : unlock}
        alt="success"
        className="w-14 h-14 mx-auto mb-4"
      />

      <h3 className="text-lg text-black font-semibold mb-2">
        {showSuccess === "lock" ? "Funds Locked" : "Funds Unlocked"}
      </h3>

      <p className="text-sm text-[#535353] mb-6">
        {showSuccess === "lock"
          ? "Locked Balance holds funds you’ve secured. Access requires wallet authentication for added protection."
          : "Your unlocked funds are available for payments and withdrawals."}
      </p>

      <button
        onClick={() => setShowSuccess(null)}
        className="bg-[#3E83C4] cursor-pointer text-white text-sm px-8 py-2 rounded-md"
      >
        Done
      </button>
    </div>
  </div>
)}



      <div className="text-center">
        <button
          onClick={() => {
            setShowLockModal(false);
            setShowUnlockModal(false);
          }}
          className="text-xs text-[#535353] underline hover:text-gray-600 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

</div>
</section>
{showAddCard && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-[620px] rounded-xl shadow-lg p-8 relative">

      {/* Close */}
      <button
        onClick={() => setShowAddCard(false)}
        className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        ✕
      </button>

      {/* Back */}
      <button
        onClick={() => setShowAddCard(false)}
        className="text-sm text-[#3E83C4] mb-8 flex items-center gap-1 cursor-pointer"
      >
        ← Back
      </button>

      {/* Title */}
      <h2 className="text-center text-black text-xl font-semibold mb-10">
        Add New Card Modal
      </h2>

      {/* Form */}
<div className="grid grid-cols-2 gap-x-10 gap-y-8 mb-12">

  {/* Card Number */}
  <div>
    <label className="text-sm text-[#535353] block mb-2">
      Card Number*
    </label>
    <input
      placeholder="XXXX XXXX XXXX XXXX"
      className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none"
    />
  </div>

  {/* Card Name */}
  <div>
    <label className="text-sm text-[#535353] block mb-2">
      Card Name*
    </label>
    <input
      placeholder="Name"
      className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none"
    />
  </div>

  {/* Expiry Date — short */}
  <div className="max-w-[160px]">
    <label className="text-sm text-[#535353] block mb-2">
      Expiry Date
    </label>
    <input
      placeholder="MM / YY"
      className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none"
    />
  </div>

  {/* CVV — slightly wider than expiry */}
  <div className="max-w-[200px]">
    <label className="text-sm text-[#535353] block mb-2">
      CVV
    </label>

    <div className="relative">
      <input
        placeholder="123"
        inputMode="numeric"
        maxLength={4}
        onInput={(e) => {
          e.target.value = e.target.value.replace(/\D/g, "");
        }}
        className="w-full border border-[#87AACB] rounded-md px-4 py-3 text-sm outline-none"
      />
      <img
        src={card}
        className="w-5 absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
      />
    </div>
  </div>

</div>



      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            setShowAddCard(false);
            setShowAddSuccess(true);

            setTimeout(() => {
              setShowAddSuccess(false);
            }, 2000);
          }}
          className="bg-[#3E83C4] hover:bg-[#356bb3] text-white text-sm px-24 py-3 rounded-md transition cursor-pointer"
        >
          Save Card
        </button>
      </div>

    </div>
  </div>
)}

{showAddSuccess && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-[400px] rounded-xl shadow-lg p-6 text-center">

      <img src={success} className="w-16 mx-auto mb-4" />

      <h3 className="text-xl text-black font-medium mb-2">
        Payment Method Saved
      </h3>

      <p className="text-sm text-[#535353]">
        Your card has been added successfully and is now available for payments.
      </p>

    </div>
  </div>
)}


{/* <section className="max-w-4xl mx-auto bg-white p-6 rounded-md"> */}
    <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
  <div className="max-w-7xl mx-auto px-2 md:px-6">
  <hr className="border-[#C1DAF3] mt-2 mb-8" />
  {/* Header */}
  <div className="flex items-center gap-2 mb-6">
    <img src={passwordIcon} alt="profile icon" className="w-5 h-5" />
    <h2 className="text-sm font-semibold text-[#000000]">
      Password 
    </h2>
  </div>

  {/* Form Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Name */}
    <div>
      <label className="block text-sm text-[#535353] mb-1">
       Current Password
      </label>
      <input
        type="password"
        placeholder="Enter Current Password"
        
        className="w-full border border-[9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
      />
    </div>
    <div>
      <label className="block text-sm text-[#535353] mb-1">
       New Password
      </label>
      <input
        type="password"
        placeholder="Enter New Password"
        
        className="w-full border border-[9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
      />
    </div>
    <div>
      <label className="block text-sm text-[#535353] mb-1">
       Confirm New Password
      </label>
      <input
        type="password"
        placeholder="Enter New Password"
        
        className="w-full border border-[9BAAB9] rounded-md px-3 py-2 text-sm outline-none"
      />
    </div>

    
  </div>

  {/* Update Button */}
  <div className="flex justify-end mt-6">
    <button className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md">
      Update
    </button>
  </div>
</div>
</section>


{/* <section className="max-w-4xl mx-auto bg-white p-6 rounded-md"> */}
    <section className="w-full py-2 overflow-hidden bg-white p-6 rounded-md">
  <div className="max-w-7xl mx-auto px-2 md:px-6">
  {/* Header */}
  <div className="flex items-start gap-2 mb-6">
    <img src={bell} alt="bell" className="w-5 h-5 mt-1" />
    <div>
      <h2 className="text-sm font-semibold text-black">
        Email Notifications
      </h2>
      <p className="text-xs text-[#535353] max-w-lg">
        Get emails to find out what is going on in Fixserv when you are not online.
        You can turn these off whenever you want to.
      </p>
    </div>
  </div>

  {/* Notification List */}
   <div className="space-y-6 mb-8">
      {notifications.map((item, index) => (
        <div key={index} className="flex items-start gap-4">
          {/* Toggle (Clickable) */}
          <div
            onClick={() => toggleItem(index)}
            className={`w-9 h-5 rounded-full relative mt-1 flex-shrink-0 cursor-pointer transition ${
              enabled[index] ? "bg-[#3E83C4]" : "bg-[#535353]"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow transition ${
                enabled[index] ? "right-0.5" : "left-0.5"
              }`}
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-sm text-black">{item.title}</p>
            <p className="text-xs text-[#535353] max-w-md">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>

  {/* Update Button */}
  <div className="flex justify-end mb-10">
    <button className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded-md">
      Update
    </button>
  </div>

  <hr className="border-[#C1DAF3] mt-2 mb-8" />

  {/* Delete Account */}
  <div className="mb-10">
    <h3 className="text-sm font-semibold text-black mb-1">
      Delete your account
    </h3>
    <p className="text-sm text-[#535353] max-w-lg mb-4">
      When you delete your account, you lose access to Fixserv account services,
      and we permanently delete your personal data.
    </p>

    <div className="flex items-center gap-2 mb-6">
      <input type="checkbox" className="w-4 h-4" />
      <label className="text-sm text-[#535353]">
        Confirm that I want to delete my account
      </label>
    </div>

    {/* Delete button RIGHT */}
    <div className="flex justify-end">
      <button className="bg-red-600 text-white text-sm px-6 py-2 rounded-md cursor-pointer">
        Delete
      </button>
    </div>
  </div>

  <hr className="border-[#C1DAF3] mt-2 mb-8" />

  {/* Save Changes */}
  <div className="flex justify-center">
    <button className="bg-[#3E83C4] text-white text-sm px-8 py-2 rounded-md cursor-pointer">
      Save Changes
    </button>
  </div>
</div>
</section>



    </div>
  );
};

export default ProfileSettings;


