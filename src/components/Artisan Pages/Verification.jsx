// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import upload from "../../assets/Artisan Images/Vector.png";
// import doc from "../../assets/Artisan Images/doc.png";
// import cancel from "../../assets/Artisan Images/cancel.png";
// import check from "../../assets/Artisan Images/check.png";
// import pending from "../../assets/Artisan Images/pending.png";
// import { getAuthUser, getAuthToken } from "../../utils/auth";
// import ArtisanHeader from "./ArtisanHeader";

// const MAX_MB = 5;
// const ACCEPTED_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "application/pdf",
//   "application/msword",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
// ];

// const prettySize = (bytes) => {
//   if (!bytes && bytes !== 0) return "";
//   const mb = bytes / (1024 * 1024);
//   if (mb >= 1) return `${mb.toFixed(1)}MB`;
//   const kb = bytes / 1024;
//   return `${kb.toFixed(0)}KB`;
// };

// const Verification = () => {
//   const navigate = useNavigate();
//   const [screen, setScreen] = useState("upload");
//   const fileInputRef = useRef(null);

//   const [error, setError] = useState("");
//   const [userId, setUserId] = useState("");
//   const [files, setFiles] = useState([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);

//   useEffect(() => {
//     const u = getAuthUser();
//     const id = u?.id || u?._id || u?.artisanId;
//     if (!id) setError("Missing user id. Please login again.");
//     setUserId(id || "");
//   }, []);

//   const addFiles = (fileList) => {
//     const selected = Array.from(fileList || []);
//     if (selected.length === 0) return;

//     let hasError = false;
//     const next = [];

//     for (const f of selected) {
//       if (!ACCEPTED_TYPES.includes(f.type)) {
//   setError("Only JPG, JPEG, PNG, PDF, DOC, and DOCX files are allowed for certificates.");
//   hasError = true;
//   continue;
// }

//       if (f.size > MAX_MB * 1024 * 1024) {
//         setError(`Each file must be less than ${MAX_MB}MB.`);
//         hasError = true;
//         continue;
//       }

//       const duplicate = files.some(
//         (existing) =>
//           existing.name === f.name &&
//           existing.file?.size === f.size &&
//           existing.file?.lastModified === f.lastModified
//       );

//       if (duplicate) {
//         setError(`"${f.name}" has already been added.`);
//         hasError = true;
//         continue;
//       }

//       next.push({
//         id: `${Date.now()}-${Math.random()}`,
//         file: f,
//         name: f.name,
//         sizeLabel: prettySize(f.size),
//         certName: "certificate",
//         progress: 0,
//         uploading: false,
//         done: false,
//         error: "",
//       });
//     }

//     if (next.length > 0 && !hasError) {
//       setError("");
//     }

//     setFiles((prev) => [...prev, ...next]);
//   };

//   const onSelectFiles = (e) => {
//     addFiles(e.target.files);
//     e.target.value = "";
//   };

//   const handleBrowseClick = () => fileInputRef.current?.click();

//   const handleSaveExit = () => {
//     if (files.length > 0 && !submitting) {
//       const confirmLeave = window.confirm(
//         "You have selected certificate files that haven't been submitted yet. If you leave now they will be lost. Continue?"
//       );

//       if (!confirmLeave) return;
//     }

//     navigate("/artisan");
//   };

//   const removeFile = (id) => {
//     setFiles((prev) => prev.filter((f) => f.id !== id));
//   };

//   const updateFile = (id, patch) => {
//     setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
//   };

//   const handleSubmit = async () => {
//     try {
//       setError("");

//       const token = getAuthToken();
//       if (!token) throw new Error("Missing auth token. Please login again.");
//       if (!userId) throw new Error("Missing user id. Please login again.");

//       if (files.length === 0) {
//         throw new Error("Please add at least one certificate image.");
//       }

//       const names = files
//         .map((f) => String(f.certName || "").trim())
//         .filter(Boolean);

//       if (names.length !== files.length) {
//         throw new Error("Please select a certificate type/name for each file.");
//       }

//       setSubmitting(true);

//       setFiles((prev) =>
//         prev.map((f) => ({
//           ...f,
//           uploading: true,
//           done: false,
//           error: "",
//           progress: 0,
//         }))
//       );

//       const fd = new FormData();
//       files.forEach((f) => fd.append("certificates", f.file));
//       fd.append("certificateNames", JSON.stringify(names));

// const url = `/api/certificate/${userId}/upload-certificates`;

//       const xhr = new XMLHttpRequest();
//       xhr.open("POST", url, true);
//       xhr.setRequestHeader("Authorization", `Bearer ${token}`);

//       xhr.upload.onprogress = (evt) => {
//         if (!evt.lengthComputable) return;

//         const pct = Math.round((evt.loaded / evt.total) * 100);

//         setFiles((prev) =>
//           prev.map((f) => (f.uploading ? { ...f, progress: pct } : f))
//         );
//       };

//       const result = await new Promise((resolve, reject) => {
//         xhr.onload = () => {
//           let data = null;
//           try {
//             data = JSON.parse(xhr.responseText || "{}");
//           } catch {
//             data = null;
//           }

//           if (xhr.status >= 200 && xhr.status < 300) resolve(data);
//           else reject({ status: xhr.status, data });
//         };

//         xhr.onerror = () => reject({ status: 0, data: null });
//         xhr.send(fd);
//       });

//       setFiles((prev) =>
//         prev.map((f) => ({
//           ...f,
//           uploading: false,
//           done: true,
//           progress: 100,
//         }))
//       );

//       if (result?.user) {
//         localStorage.setItem("fixserv_user", JSON.stringify(result.user));
//       }

//       setScreen("received");
//     } catch (err) {
//       console.error("CERT UPLOAD FAILED =>", err);

//       const msg =
//         err?.data?.message ||
//         err?.data?.errors?.[0]?.message ||
//         err?.message ||
//         `Upload failed (${err?.status || "unknown"})`;

//       setError(msg);

//       setFiles((prev) =>
//         prev.map((f) => ({
//           ...f,
//           uploading: false,
//           done: false,
//         }))
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50">
//       {screen === "upload" && (
//         <>
//           <ArtisanHeader title="Verification" />

//           <div className="mt-6 bg-white rounded-xl p-4 sm:p-6 lg:p-8 max-w-5xl">
//             <span className="text-base sm:text-lg text-[#3E83C4] font-medium">
//               Skill Certificate
//             </span>

//             <h2 className="text-2xl sm:text-3xl font-bold mt-4 mb-2">
//               Upload Your Skill Certificate
//             </h2>

//             <p className="text-sm sm:text-base text-gray-600 mb-6">
//               Please upload a clear copy of your official skill certificate or
//               license to complete your profile verification
//             </p>

//             {error ? (
//               <div className="mb-6 p-3 rounded-md bg-red-50 text-red-700 text-sm">
//                 {error}
//               </div>
//             ) : null}

//             <div
//               className={`border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition ${
//                 isDragging ? "border-[#3E83C4] bg-blue-50" : "border-blue-300"
//               }`}
//               onDragEnter={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 setIsDragging(true);
//               }}
//               onDragOver={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 setIsDragging(true);
//               }}
//               onDragLeave={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 setIsDragging(false);
//               }}
//               onDrop={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 setIsDragging(false);
//                 if (submitting) return;
//                 addFiles(e.dataTransfer.files);
//               }}
//             >
//               <div className="flex justify-center mb-6">
//                 <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center">
//                   <img src={upload} alt="" className="w-8 h-7 sm:w-9 sm:h-8" />
//                 </div>
//               </div>

//               <h4 className="text-base sm:text-lg font-medium mb-1">
//                 Drag or drop your file here
//               </h4>
//               <p className="text-sm text-gray-500 mb-6">or click to browse</p>

//               <button
//                 onClick={handleBrowseClick}
//                 className="bg-[#3E83C4] text-white px-6 py-3 rounded-lg font-medium cursor-pointer"
//                 disabled={submitting}
//               >
//                 Browse Files
//               </button>

//               <input
//   type="file"
//   ref={fileInputRef}
//   className="hidden"
//   accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg"
//   multiple
//   onChange={onSelectFiles}
// />
//             </div>

//             <p className="text-xs text-center text-gray-500 mt-4">
//   Accepted formats: JPG, JPEG, PNG, PDF, DOC, DOCX. Max size: {MAX_MB}MB each.
// </p>

//             <div className="mt-10 space-y-4 sm:space-y-5">
//               {files.map((file) => (
//                 <div
//                   key={file.id}
//                   className="border rounded-lg p-4 sm:p-5 flex items-start justify-between gap-4"
//                 >
//                   <div className="flex gap-4 w-full min-w-0">
//                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
//                       <img
//                         src={file.uploading ? doc : file.done ? check : doc}
//                         alt=""
//                         className="w-5"
//                       />
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between gap-4">
//                         <p className="font-medium truncate">{file.name}</p>

//                         <button
//                           type="button"
//                           onClick={() => removeFile(file.id)}
//                           disabled={submitting || file.uploading}
//                           className="disabled:opacity-50 shrink-0"
//                           title="Remove"
//                         >
//                           <img src={cancel} alt="" className="w-4 cursor-pointer" />
//                         </button>
//                       </div>

//                       <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
//                         <span className="text-sm text-gray-600 shrink-0">
//                           Certificate type:
//                         </span>
//                         <select
//                           value={file.certName}
//                           disabled={submitting || file.uploading}
//                           onChange={(e) =>
//                             updateFile(file.id, { certName: e.target.value })
//                           }
//                           className="border rounded-md px-3 py-2 text-sm w-full sm:w-64"
//                         >
//                           <option value="drivers license">drivers license</option>
//                           <option value="certificate">certificate</option>
//                           <option value="general">general</option>
//                           <option value="professional certification">
//                             professional certification
//                           </option>
//                           <option value="trade license">trade license</option>
//                         </select>
//                       </div>

//                       {file.uploading ? (
//                         <>
//                           <p className="text-sm text-gray-500 mt-3">
//                             Uploading...
//                             <span className="float-right font-medium">
//                               {file.progress}%
//                             </span>
//                           </p>
//                           <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
//                             <div
//                               className="bg-[#3E83C4] h-2 rounded-full"
//                               style={{ width: `${file.progress}%` }}
//                             />
//                           </div>
//                         </>
//                       ) : (
//                         <p className="text-sm text-gray-500 mt-2">{file.sizeLabel}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {files.length === 0 ? (
//                 <p className="text-sm text-gray-500 text-center">
//                   No files selected yet.
//                 </p>
//               ) : null}
//             </div>

//             <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 sm:gap-6 mt-10 sm:mt-12">
//               <button
//                 className="font-medium w-full sm:w-auto"
//                 onClick={handleSaveExit}
//                 disabled={submitting}
//               >
//                 Save & Exit
//               </button>

//               <button
//                 onClick={handleSubmit}
//                 disabled={submitting || files.length === 0}
//                 className="bg-[#3E83C4] text-white px-8 py-3 rounded-lg disabled:opacity-60 w-full sm:w-auto"
//               >
//                 {submitting ? "Submitting..." : "Submit & Continue"}
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       {screen === "received" && (
//         <div className="min-h-[70vh] flex items-center justify-center">
//           <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
//             <div className="flex justify-center mb-6">
//               <img src={pending} alt="" className="w-16 h-16 sm:w-20 sm:h-20" />
//             </div>

//             <h2 className="text-xl sm:text-2xl font-semibold mb-3">
//               We&apos;ve Received Your Certificate
//             </h2>

//             <p className="text-sm text-gray-600 leading-relaxed mb-8">
//               Your skill certificate is currently being reviewed by our team to
//               ensure it meets our quality standards.
//               <br />
//               <br />
//               <span className="font-medium text-gray-700">
//                 Estimated review time:
//               </span>{" "}
//               24 – 48 hours.
//             </p>

//             <button
//               onClick={() => navigate("/artisan")}
//               className="w-full bg-[#3E83C4] text-white py-3 rounded-lg"
//             >
//               Go to Dashboard
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Verification;


import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import upload from "../../assets/Artisan Images/Vector.png";
import doc from "../../assets/Artisan Images/doc.png";
import cancel from "../../assets/Artisan Images/cancel.png";
import check from "../../assets/Artisan Images/check.png";
import pending from "../../assets/Artisan Images/pending.png";
import { getAuthUser } from "../../utils/auth";
import ArtisanHeader from "./ArtisanHeader";
import {
  formatFileSize,
  uploadCertificates,
  validateCertificateFile,
  getCertificateFriendlyError,
} from "../../api/certificate.api";
      // import { getCertificateFriendlyError } from "../../api/certificate.api";

const MAX_MB = 5;

const Verification = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("upload");
  const fileInputRef = useRef(null);

  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const u = getAuthUser();
    const id = u?.id || u?._id || u?.artisanId || "";
    if (!id) {
      setError("Missing user id. Please login again.");
    }
    setUserId(id);
  }, []);

  const addFiles = (fileList) => {
    const selected = Array.from(fileList || []);
    if (selected.length === 0) return;

    let firstError = "";

    setFiles((prev) => {
      const nextFiles = [...prev];

      for (const originalFile of selected) {
        const validation = validateCertificateFile(originalFile);
        if (!validation.valid) {
          if (!firstError) firstError = validation.message;
          continue;
        }

        const duplicate = nextFiles.some(
          (existing) =>
            existing.name === originalFile.name &&
            existing.originalSize === originalFile.size &&
            existing.lastModified === originalFile.lastModified
        );

        if (duplicate) {
          if (!firstError) {
            firstError = `"${originalFile.name}" has already been added.`;
          }
          continue;
        }

        nextFiles.push({
          id: `${Date.now()}-${Math.random()}`,
          file: originalFile,
          name: originalFile.name,
          originalSize: originalFile.size,
          lastModified: originalFile.lastModified,
          sizeLabel: formatFileSize(originalFile.size),
          certName: "certificate",
          progress: 0,
          uploading: false,
          done: false,
          error: "",
        });
      }

      return nextFiles;
    });

    setError(firstError);
  };

  const onSelectFiles = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleBrowseClick = () => {
    if (submitting) return;
    fileInputRef.current?.click();
  };

  const handleSaveExit = () => {
    if (files.length > 0 && !submitting) {
      const confirmLeave = window.confirm(
        "You have selected certificate images that haven't been submitted yet. If you leave now they will be lost. Continue?"
      );

      if (!confirmLeave) return;
    }

    navigate("/artisan");
  };

  const removeFile = (id) => {
    if (submitting) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFile = (id, patch) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const handleSubmit = async () => {
    try {
      setError("");

      if (!userId) {
        throw new Error("Missing user id. Please login again.");
      }

      if (files.length === 0) {
        throw new Error("Please add at least one certificate image.");
      }

      const names = files.map((f) => String(f.certName || "").trim());

      if (names.some((name) => !name)) {
        throw new Error("Please select a certificate type/name for each certificate image.");
      }

      setSubmitting(true);

      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          uploading: true,
          done: false,
          error: "",
          progress: 0,
        }))
      );

      const result = await uploadCertificates({
        userId,
        files: files.map((f) => f.file),
        certificateNames: names,
        onProgress: (pct) => {
          setFiles((prev) =>
            prev.map((f) => (f.uploading ? { ...f, progress: pct } : f))
          );
        },
      });

      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          uploading: false,
          done: true,
          progress: 100,
        }))
      );

      if (result?.user) {
        localStorage.setItem("fixserv_user", JSON.stringify(result.user));
      }

      setScreen("received");
    } catch (err) {
      console.error("CERT UPLOAD FAILED =>", err);


setError(
  getCertificateFriendlyError(
    err,
    "Unable to upload certificates. Please try again."
  )
);

      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          uploading: false,
          done: false,
          progress: 0,
        }))
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50">
      {screen === "upload" && (
        <>
          <ArtisanHeader title="Verification" />

          <div className="mt-6 bg-white rounded-xl p-4 sm:p-6 lg:p-8 max-w-5xl">
            <span className="text-base sm:text-lg text-[#3E83C4] font-medium">
              Skill Certificate
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold mt-4 mb-2">
              Upload Your Skill Certificate
            </h2>

            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Please upload a clear copy of your official skill certificate or
              license to complete your profile verification.
            </p>

            {error ? (
              <div className="mb-6 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            ) : null}

            <div
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition ${
                isDragging ? "border-[#3E83C4] bg-blue-50" : "border-blue-300"
              }`}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!submitting) setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!submitting) setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                if (submitting) return;
                addFiles(e.dataTransfer.files);
              }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <img src={upload} alt="" className="w-8 h-7 sm:w-9 sm:h-8" />
                </div>
              </div>

              <h4 className="text-base sm:text-lg font-medium mb-1">
                Drag or drop your certificate file here
              </h4>
              <p className="text-sm text-gray-500 mb-6">or click to browse</p>

              <button
                type="button"
                onClick={handleBrowseClick}
                className="bg-[#3E83C4] text-white px-6 py-3 rounded-lg font-medium disabled:opacity-60"
                disabled={submitting}
              >
                Browse Files
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".png,.jpg,.jpeg,.webp,.pdf,.doc,.docx,
application/pdf,
application/msword,
application/vnd.openxmlformats-officedocument.wordprocessingml.document,
image/png,image/jpeg,image/webp"
                multiple
                onChange={onSelectFiles}
              />
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              Accepted formats: JPG, JPEG, PNG, WEBP, PDF, DOC, DOCX. Max size: {MAX_MB}MB each.
              Large images are automatically compressed before upload.
            </p>

            <div className="mt-10 space-y-4 sm:space-y-5">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="border rounded-lg p-4 sm:p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex gap-4 w-full min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <img
                        src={file.uploading ? doc : file.done ? check : doc}
                        alt=""
                        className="w-5"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <p className="font-medium truncate">{file.name}</p>

                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          disabled={submitting || file.uploading}
                          className="disabled:opacity-50 shrink-0"
                          title="Remove"
                        >
                          <img src={cancel} alt="" className="w-4 cursor-pointer" />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-gray-600 shrink-0">
                          Certificate type:
                        </span>
                        <select
                          value={file.certName}
                          disabled={submitting || file.uploading}
                          onChange={(e) =>
                            updateFile(file.id, { certName: e.target.value })
                          }
                          className="border rounded-md px-3 py-2 text-sm w-full sm:w-64"
                        >
                          <option value="drivers license">drivers license</option>
                          <option value="certificate">certificate</option>
                          <option value="general">general</option>
                          <option value="professional certification">
                            professional certification
                          </option>
                          <option value="trade license">trade license</option>
                        </select>
                      </div>

                      {file.uploading ? (
                        <>
                          <p className="text-sm text-gray-500 mt-3">
                            Uploading...
                            <span className="float-right font-medium">
                              {file.progress}%
                            </span>
                          </p>
                          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                            <div
                              className="bg-[#3E83C4] h-2 rounded-full"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2">{file.sizeLabel}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {files.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">
                  No files selected yet.
                </p>
              ) : null}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 sm:gap-6 mt-10 sm:mt-12">
              <button
                type="button"
                className="font-medium w-full sm:w-auto"
                onClick={handleSaveExit}
                disabled={submitting}
              >
                Save & Exit
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || files.length === 0}
                className="bg-[#3E83C4] text-white px-8 py-3 rounded-lg disabled:opacity-60 w-full sm:w-auto"
              >
                {submitting ? "Submitting..." : "Submit & Continue"}
              </button>
            </div>
          </div>
        </>
      )}

      {screen === "received" && (
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-6">
              <img src={pending} alt="" className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold mb-3">
              We&apos;ve Received Your Certificate
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              Your skill certificate is currently being reviewed by our team to
              ensure it meets our quality standards.
              <br />
              <br />
              <span className="font-medium text-gray-700">
                Estimated review time:
              </span>{" "}
              24 – 48 hours.
            </p>

            <button
              type="button"
              onClick={() => navigate("/artisan")}
              className="w-full bg-[#3E83C4] text-white py-3 rounded-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;