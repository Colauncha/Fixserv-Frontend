// import React from "react";
// import addrepair from "../../assets/client images/addrepair.png";
// import item from "../../assets/client images/item.png";
// import description from "../../assets/client images/description.png";
// import itemphoto from "../../assets/client images/itemphoto.png";
// import upload from "../../assets/client images/upload.png";
// import { useNavigate } from "react-router-dom";

// const Additem = () => {

//   const navigate = useNavigate();

//   return (
//     <>
//       {/* BACKDROP */}
//       <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

//       {/* MODAL */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//         <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative">

//           {/* Header */}
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <img src={addrepair} alt="add" className="w-6 h-6" />
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-900">
//                   Add Repair Item
//                 </h3>
//                 <p className="text-xs text-gray-500">
//                   Upload an item that needs repair
//                 </p>
//               </div>
//             </div>

//             <button onClick={() => navigate("/client/profile")} className="text-gray-400 hover:text-gray-600 text-lg">
//               ×
//             </button>
//           </div>

//           {/* Item Name */}
//           <div className="mb-4">
//             <label className="flex items-center gap-2 text-xs text-gray-700 mb-1">
//               <img src={item} alt="item" className="w-4 h-4" />
//               Item Name
//             </label>
//             <input
//               type="text"
//               placeholder="e.g., iPhone 12, Samsung TV, MacBook Pro"
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
//             />
//           </div>

//           {/* Description */}
//           <div className="mb-4">
//             <label className="flex items-center gap-2 text-xs text-gray-700 mb-1">
//               <img src={description} alt="description" className="w-4 h-4" />
//               Description
//             </label>
//             <textarea
//               rows="4"
//               placeholder="Describe the issue with your item. What's broken? What needs to be fixed?"
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none resize-none"
//             />
//             <p className="text-xs text-gray-400 mt-1">0/500 characters</p>
//           </div>

//           {/* Item Photo */}
//           <div className="mb-4">
//             <label className="flex items-center gap-2 text-xs text-gray-700 mb-2">
//               <img src={itemphoto} alt="photo" className="w-4 h-4" />
//               Item Photo
//             </label>

//             <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
//               <div className="flex flex-col items-center gap-2">
//                 <img src={upload} alt="upload" className="w-8 h-8 opacity-60" />
//                 <p className="text-xs text-gray-500">
//                   Click to upload or drag & drop
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   PNG, JPG, JPEG up to 5MB
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <p className="text-xs text-gray-400 text-center mb-4">
//             Please fill in all required fields
//           </p>

//           <button className="w-full bg-[#3E83C4] hover:bg-blue-600 text-white text-sm py-2 rounded-md mb-3 transition">
//             Upload Item
//           </button>

//           <button className="w-full text-xs text-blue-500 hover:underline">
//             Cancel
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Additem;

//After upload photo and product 
// import React, { useState } from "react";
// import addrepair from "../../assets/client images/addrepair.png";
// import item from "../../assets/client images/item.png";
// import description from "../../assets/client images/description.png";
// import itemphoto from "../../assets/client images/itemphoto.png";
// import upload from "../../assets/client images/upload.png";
// import { useNavigate } from "react-router-dom";

// const Additem = () => {
//   const navigate = useNavigate();

//   const [itemName, setItemName] = useState("");
//   const [itemDescription, setItemDescription] = useState("");
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const userId = "321e278c-eee1-4451-969e-7ad3933026cc"; 
//   // later: get from auth context / token

//   const handleUpload = async () => {
//     if (!itemName || !itemDescription || !image) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("objectName", itemName);
//     formData.append("description", itemDescription);
//     formData.append("productImage", image);

//     try {
//       setLoading(true);

//       const res = await fetch(
//         `https://user-management-h4hg.onrender.com/api/upload/${userId}/upload-products`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Upload failed");
//       }

//       navigate("/client/profile");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to upload item");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* BACKDROP */}
//       <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

//       {/* MODAL */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//         <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative">

//           {/* Header */}
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <img src={addrepair} alt="add" className="w-6 h-6" />
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-900">
//                   Add Repair Item
//                 </h3>
//                 <p className="text-xs text-gray-500">
//                   Upload an item that needs repair
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={() => navigate("/client/profile")}
//               className="text-gray-400 hover:text-gray-600 text-lg"
//             >
//               ×
//             </button>
//           </div>

//           {/* Item Name */}
//           <div className="mb-4">
//             <label className="flex items-center gap-2 text-xs text-gray-700 mb-1">
//               <img src={item} alt="item" className="w-4 h-4" />
//               Item Name
//             </label>
//             <input
//               type="text"
//               value={itemName}
//               onChange={(e) => setItemName(e.target.value)}
//               placeholder="e.g., iPhone 12, Samsung TV, MacBook Pro"
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
//             />
//           </div>

//           {/* Description */}
//           <div className="mb-4">
//             <label className="flex items-center gap-2 text-xs text-gray-700 mb-1">
//               <img src={description} alt="description" className="w-4 h-4" />
//               Description
//             </label>
//             <textarea
//               rows="4"
//               value={itemDescription}
//               onChange={(e) => setItemDescription(e.target.value)}
//               placeholder="Describe the issue with your item."
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none resize-none"
//             />
//           </div>

//           {/* Item Photo */}
//           <div className="mb-4">
//             <label className="flex items-center gap-2 text-xs text-gray-700 mb-2">
//               <img src={itemphoto} alt="photo" className="w-4 h-4" />
//               Item Photo
//             </label>

//             <label className="border border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer">
//               <div className="flex flex-col items-center gap-2">
//                 <img src={upload} alt="upload" className="w-8 h-8 opacity-60" />
//                 <p className="text-xs text-gray-500">
//                   {image ? image.name : "Click to upload or drag & drop"}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   PNG, JPG, JPEG up to 5MB
//                 </p>
//               </div>

//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => setImage(e.target.files[0])}
//               />
//             </label>
//           </div>

//           {/* Footer */}
//           <p className="text-xs text-gray-400 text-center mb-4">
//             Please fill in all required fields
//           </p>

//           <button
//             onClick={handleUpload}
//             disabled={loading}
//             className="w-full bg-[#3E83C4] hover:bg-blue-600 text-white text-sm py-2 rounded-md mb-3 transition"
//           >
//             {loading ? "Uploading..." : "Upload Item"}
//           </button>

//           <button
//             onClick={() => navigate("/client/profile")}
//             className="w-full text-xs text-blue-500 hover:underline"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Additem;

import React, { useState } from "react";
import addrepair from "../../assets/client images/addrepair.png";
import item from "../../assets/client images/item.png";
import description from "../../assets/client images/description.png";
import itemphoto from "../../assets/client images/itemphoto.png";
import upload from "../../assets/client images/upload.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Additem = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();   // ✅ use auth properly

  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     if (!itemName || !itemDescription || !image) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     if (!user?.id || !token) {
//       alert("Authentication error. Please login again.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("objectName", itemName);
//     formData.append("description", itemDescription);
//     formData.append("image", image);  // ✅ CORRECT FIELD NAME

//     try {
//       setLoading(true);

//       console.log("USER:", user);
// console.log("USER ID:", user?.id);


//       const res = await fetch(
//         `https://user-management-h4hg.onrender.com/api/upload/${user.id}/upload-products`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,  // ✅ VERY IMPORTANT
//           },
//           body: formData,
//         }
//       );

//       // const data = await res.json();

//       let data;

// try {
//   data = await res.json();
// } catch (err) {
//   throw new Error("Server did not return valid JSON");
// }


//       if (!res.ok) {
//         throw new Error(data?.message || "Upload failed");
//       }

//       navigate("/client/profile");

//     } catch (error) {
//       console.error("UPLOAD ERROR:", error);
//       alert(error.message || "Failed to upload item");
//     } finally {
//       setLoading(false);
//     }
//   };

const handleUpload = async () => {
  if (!itemName || !itemDescription || !image) {
    alert("Please fill in all required fields");
    return;
  }

  if (!user?.id && !user?._id) {
    alert("Authentication error. Please login again.");
    return;
  }

  const userId = user.id || user._id;

  const formData = new FormData();
  formData.append("objectName", itemName);
  formData.append("description", itemDescription);
  formData.append("image", image);

  try {
    setLoading(true);

    console.log("Uploading to:", userId);

    const res = await fetch(
      `https://user-management-h4hg.onrender.com/api/upload/${userId}/upload-products`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON response from server");
    }

    if (!res.ok) {
      throw new Error(data?.message || "Upload failed");
    }

    alert("Upload successful!");
    // navigate("/client/profile");
    navigate("/client/profile", { state: { refresh: true } });


  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    alert(error.message || "Failed to upload item");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative">

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src={addrepair} alt="add" className="w-6 h-6" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Add Repair Item
                </h3>
                <p className="text-xs text-gray-500">
                  Upload an item that needs repair
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/client/profile")}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ×
            </button>
          </div>

          {/* Item Name */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-xs text-gray-700 mb-1">
              <img src={item} alt="item" className="w-4 h-4" />
              Item Name
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., iPhone 12"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-xs text-gray-700 mb-1">
              <img src={description} alt="description" className="w-4 h-4" />
              Description
            </label>
            <textarea
              rows="4"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Describe the issue"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-xs text-gray-700 mb-2">
              <img src={itemphoto} alt="photo" className="w-4 h-4" />
              Item Photo
            </label>

            <label className="border border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <img src={upload} alt="upload" className="w-8 h-8 opacity-60" />
                <p className="text-xs text-gray-500">
                  {image ? image.name : "Click to upload"}
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-[#3E83C4] hover:bg-blue-600 text-white text-sm py-2 rounded-md mb-3 transition"
          >
            {loading ? "Uploading..." : "Upload Item"}
          </button>

          <button
            onClick={() => navigate("/client/profile")}
            className="w-full text-xs text-blue-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default Additem;
