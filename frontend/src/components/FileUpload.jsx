import React, { useState } from "react";
import { API } from "../utils/api.js"; // ✅ named import

const FileUpload = ({ chatId }) => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    if (chatId) formData.append("chatId", chatId);

    try {
      const res = await API.post("/user/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUrl(res.data.url);
      alert("Uploaded!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="my-2">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={handleUpload}
        className="bg-green-500 text-white p-1 ml-2 rounded"
      >
        Upload
      </button>
      {url && (
        <img
          src={url}
          alt="profile"
          className="mt-2 w-20 h-20 rounded-full"
        />
      )}
    </div>
  );
};

export default FileUpload;
