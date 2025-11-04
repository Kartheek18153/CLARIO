import React, { useState, useEffect } from "react";
import { API } from "../utils/api.js";
import FileUpload from "./FileUpload.jsx";

const Profile = ({ user }) => {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");

  // Populate state only when user is available
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setStatus(user.status || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      await API.put("/user/update", { username, status });
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (!user) return <div>Loading profile...</div>; // optional fallback

  return (
    <div className="max-w-md p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Profile</h2>
      <FileUpload />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 w-full my-2 rounded"
        placeholder="Username"
      />
      <input
        type="text"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 w-full my-2 rounded"
        placeholder="Status"
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white p-2 rounded mt-2"
      >
        Update Profile
      </button>
    </div>
  );
};

export default Profile;
