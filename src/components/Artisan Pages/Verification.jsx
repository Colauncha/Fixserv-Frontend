import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import upload from "../../assets/Artisan Images/Vector.png";
import doc from "../../assets/Artisan Images/doc.png";
import cancel from "../../assets/Artisan Images/cancel.png";
import check from "../../assets/Artisan Images/check.png";
import pending from "../../assets/Artisan Images/pending.png";
import { getAuthUser, getAuthToken } from "../../utils/auth";

const MAX_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"]; // strict to match "image formats"

const prettySize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)}MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(0)}KB`;
};

const Verification = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("upload"); // upload | received

  const fileInputRef = useRef(null);

  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  // each item: { id, file, name, sizeLabel, certName, progress, uploading, done, error, xhr }
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

const addFiles = (fileList) => {
  const selected = Array.from(fileList || []);
  if (selected.length === 0) return;

  const next = [];
  for (const f of selected) {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError("Only JPG/JPEG/PNG images are allowed for certificates.");
      continue;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`Each file must be less than ${MAX_MB}MB.`);
      continue;
    }

    next.push({
      id: `${Date.now()}-${Math.random()}`,
      file: f,
      name: f.name,
      sizeLabel: prettySize(f.size),
      certName: "certificate",
      progress: 0,
      uploading: false,
      done: false,
      error: "",
    });
  }

  if (next.length > 0) setError("");
  setFiles((prev) => [...prev, ...next]);
};

const onSelectFiles = (e) => {
  addFiles(e.target.files);
  e.target.value = "";
};



  useEffect(() => {
    const u = getAuthUser();
    const id = u?.id || u?._id || u?.artisanId;
    if (!id) setError("Missing user id. Please login again.");
    setUserId(id || "");
  }, []);

  const handleBrowseClick = () => fileInputRef.current?.click();

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFile = (id, patch) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  // const onSelectFiles = (e) => {
  //   const selected = Array.from(e.target.files || []);
//   const onSelectFiles = (e) => {
//   addFiles(e.target.files);
//   e.target.value = ""; // allow selecting same file again
// };
    
  // Upload all files in ONE request (backend expects certificates + certificateNames array)
  const handleSubmit = async () => {
    try {
      setError("");

      const token = getAuthToken();
      if (!token) throw new Error("Missing auth token. Please login again.");
      if (!userId) throw new Error("Missing user id. Please login again.");

      if (files.length === 0) {
        throw new Error("Please add at least one certificate image.");
      }

      // validate names
      const names = files.map((f) => String(f.certName || "").trim()).filter(Boolean);
      if (names.length !== files.length) {
        throw new Error("Please select a certificate type/name for each file.");
      }

      setSubmitting(true);

      // Set uploading UI
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          uploading: true,
          done: false,
          error: "",
          progress: 0,
        }))
      );

      const fd = new FormData();
      files.forEach((f) => fd.append("certificates", f.file));
      // safest: send array as JSON string
      fd.append("certificateNames", JSON.stringify(names));

      const url = `https://dev-user-api.fixserv.co/api/certificate/${userId}/upload-certificates`;
      console.log("CERT UPLOAD URL =>", url);
      console.log("CERT NAMES =>", names);

      // Use XHR to get upload progress reliably
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (evt) => {
        if (!evt.lengthComputable) return;
        const pct = Math.round((evt.loaded / evt.total) * 100);
        // We only have request-level progress, so apply to all
        setFiles((prev) => prev.map((f) => ({ ...f, progress: pct })));
      };

      const result = await new Promise((resolve, reject) => {
        xhr.onload = () => {
          let data = null;
          try {
            data = JSON.parse(xhr.responseText || "{}");
          } catch {
            data = null;
          }

          if (xhr.status >= 200 && xhr.status < 300) resolve(data);
          else reject({ status: xhr.status, data });
        };

        xhr.onerror = () => reject({ status: 0, data: null });
        xhr.send(fd);
      });

      console.log("CERT UPLOAD SUCCESS =>", result);

      // Mark all done
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          uploading: false,
          done: true,
          progress: 100,
        }))
      );

      // Save updated user to localStorage if response includes it
      if (result?.user) {
        localStorage.setItem("fixserv_user", JSON.stringify(result.user));
      }

      // Go to received screen
      setScreen("received");
    } catch (err) {
      console.error("CERT UPLOAD FAILED =>", err);

      const msg =
        err?.data?.message ||
        err?.data?.errors?.[0]?.message ||
        err?.message ||
        `Upload failed (${err?.status || "unknown"})`;

      setError(msg);

      // Stop uploading UI
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          uploading: false,
          done: false,
          // keep progress as is
        }))
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      {/* ===================== UPLOAD SCREEN ===================== */}
      {screen === "upload" && (
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8">
          <span className="text-lg text-[#3E83C4] font-medium">Skill Certificate</span>

          <h2 className="text-3xl font-bold mt-4 mb-2">Upload Your Skill Certificate</h2>

          <p className="text-gray-600 mb-6">
            Please upload a clear copy of your official skill certificate or license to complete your profile verification
          </p>

          {error ? (
            <div className="mb-6 p-3 rounded-md bg-red-50 text-red-700 text-sm">{error}</div>
          ) : null}

          <div
  className={`border-2 border-dashed rounded-xl p-12 text-center transition
    ${isDragging ? "border-[#3E83C4] bg-blue-50" : "border-blue-300"}
  `}
  onDragEnter={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }}
  onDragOver={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
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
    if (submitting) return; // prevent drop while submitting
    addFiles(e.dataTransfer.files);
  }}
>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <img src={upload} className="w-9 h-8" />
              </div>
            </div>

            <h4 className="text-lg font-medium mb-1">Drag or drop your file here</h4>
            <p className="text-sm text-gray-500 mb-6">or click to browse</p>

            <button
              onClick={handleBrowseClick}
              className="bg-[#3E83C4] text-white px-6 py-3 rounded-lg font-medium"
              disabled={submitting}
            >
              Browse Files
            </button>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png,image/jpeg"
              multiple
              onChange={onSelectFiles}
            />
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            Accepted formats: JPG, PNG. Max size: {MAX_MB}MB each.
          </p>

          {/* Selected files list */}
          <div className="mt-10 space-y-5">
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg p-5 flex items-start justify-between">
                <div className="flex gap-4 w-full">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <img src={file.uploading ? doc : file.done ? check : doc} className="w-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between gap-4">
                      <p className="font-medium truncate">{file.name}</p>

                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        disabled={submitting || file.uploading}
                        className="disabled:opacity-50"
                        title="Remove"
                      >
                        <img src={cancel} className="w-4 cursor-pointer" />
                      </button>
                    </div>

                    {/* Certificate Name selector */}
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm text-gray-600">Certificate type:</span>
                      <select
                        value={file.certName}
                        disabled={submitting || file.uploading}
                        onChange={(e) => updateFile(file.id, { certName: e.target.value })}
                        className="border rounded-md px-3 py-2 text-sm w-full sm:w-64"
                      >
                        <option value="drivers license">drivers license</option>
                        <option value="certificate">certificate</option>
                        <option value="general">general</option>
                        <option value="professional certification">professional certification</option>
                        <option value="trade license">trade license</option>
                      </select>
                    </div>

                    {file.uploading ? (
                      <>
                        <p className="text-sm text-gray-500 mt-3">
                          Uploading...
                          <span className="float-right font-medium">{file.progress}%</span>
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
              <p className="text-sm text-gray-500 text-center">No files selected yet.</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-6 mt-12">
            <button
              className="font-medium"
              onClick={() => navigate("/artisan")}
              disabled={submitting}
            >
              Save & Exit
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting || files.length === 0}
              className="bg-[#3E83C4] text-white px-8 py-3 rounded-lg disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit & Continue"}
            </button>
          </div>
        </div>
      )}

      {/* ===================== RECEIVED / PENDING SCREEN ===================== */}
      {screen === "received" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <img src={pending} className="w-20 h-20" />
            </div>

            <h2 className="text-2xl font-semibold mb-3">We've Received Your Certificate</h2>

            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              Your skill certificate is currently being reviewed by our team to ensure it meets our quality standards.
              <br /><br />
              <span className="font-medium text-gray-700">Estimated review time:</span>{" "}
              24 – 48 hours.
            </p>

            <button
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