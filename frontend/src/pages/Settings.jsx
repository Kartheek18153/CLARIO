// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profile_pic: null
  });
  const [notifications, setNotifications] = useState({
    messageNotifications: true,
    storyNotifications: true,
    soundEnabled: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    readReceipts: true,
    lastSeen: true
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
        setFormData({
          username: userData.username,
          email: userData.email || "",
          profile_pic: userData.profile_pic || null
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      profile_pic: file
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      if (formData.email) formDataToSend.append("email", formData.email);
      if (formData.profile_pic && typeof formData.profile_pic !== 'string') {
        formDataToSend.append("profile_pic", formData.profile_pic);
      }

      const response = await axios.put("http://localhost:5000/api/user/profile", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update local storage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacy(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            {i % 5 === 0 && <div className="w-6 h-6 bg-pink-400 rounded-full blur-sm" />}
            {i % 5 === 1 && <div className="w-4 h-4 bg-purple-400 rotate-45 blur-sm" />}
            {i % 5 === 2 && <div className="w-8 h-3 bg-indigo-400 rounded-full blur-sm" />}
            {i % 5 === 3 && <div className="w-3 h-8 bg-cyan-400 rounded-full blur-sm" />}
            {i % 5 === 4 && <div className="w-5 h-5 bg-blue-400 rounded-lg blur-sm" />}
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link to="/home" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              whileHover={{ scale: 1.1 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
            <span className="text-lg">Back to Home</span>
          </Link>
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            Settings ✨
          </motion.h1>
          <div className="w-32" /> {/* Spacer */}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Settings */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-3">
              <span className="text-3xl">👤</span>
              <span>Profile</span>
            </h2>

            {user && (
              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-white">{user.username}</h3>
                    <p className="text-white/70">{user.email || "No email set"}</p>
                  </div>
                  <motion.button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </motion.button>
                </div>

                {isEditing && (
                  <motion.div
                    className="space-y-6 border-t border-white/20 pt-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-white placeholder-white/60 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-white placeholder-white/60 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Profile Picture</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-white backdrop-blur-sm"
                      />
                    </div>
                    <motion.button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </motion.button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          {/* Notifications */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-3">
              <span className="text-3xl">🔔</span>
              <span>Notifications</span>
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white text-lg">Message Notifications</h3>
                  <p className="text-sm text-white/70">Get notified when you receive messages</p>
                </div>
                <motion.button
                  onClick={() => handleNotificationChange('messageNotifications')}
                  className={`w-14 h-7 rounded-full p-1 transition-colors ${
                    notifications.messageNotifications ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-white/30'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`w-5 h-5 bg-white rounded-full shadow-md`}
                    animate={{ x: notifications.messageNotifications ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white text-lg">Story Notifications</h3>
                  <p className="text-sm text-white/70">Get notified when friends post stories</p>
                </div>
                <motion.button
                  onClick={() => handleNotificationChange('storyNotifications')}
                  className={`w-14 h-7 rounded-full p-1 transition-colors ${
                    notifications.storyNotifications ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-white/30'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`w-5 h-5 bg-white rounded-full shadow-md`}
                    animate={{ x: notifications.storyNotifications ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white text-lg">Sound</h3>
                  <p className="text-sm text-white/70">Play notification sounds</p>
                </div>
                <motion.button
                  onClick={() => handleNotificationChange('soundEnabled')}
                  className={`w-14 h-7 rounded-full p-1 transition-colors ${
                    notifications.soundEnabled ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-white/30'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`w-5 h-5 bg-white rounded-full shadow-md`}
                    animate={{ x: notifications.soundEnabled ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Privacy */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-3">
              <span className="text-3xl">🔒</span>
              <span>Privacy</span>
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-white text-lg mb-3">Profile Visibility</h3>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-white backdrop-blur-sm"
                >
                  <option value="public" className="text-gray-800">Public</option>
                  <option value="friends" className="text-gray-800">Friends Only</option>
                  <option value="private" className="text-gray-800">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white text-lg">Read Receipts</h3>
                  <p className="text-sm text-white/70">Show when messages are read</p>
                </div>
                <motion.button
                  onClick={() => handlePrivacyChange('readReceipts', !privacy.readReceipts)}
                  className={`w-14 h-7 rounded-full p-1 transition-colors ${
                    privacy.readReceipts ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-white/30'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`w-5 h-5 bg-white rounded-full shadow-md`}
                    animate={{ x: privacy.readReceipts ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white text-lg">Last Seen</h3>
                  <p className="text-sm text-white/70">Show when you were last active</p>
                </div>
                <motion.button
                  onClick={() => handlePrivacyChange('lastSeen', !privacy.lastSeen)}
                  className={`w-14 h-7 rounded-full p-1 transition-colors ${
                    privacy.lastSeen ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-white/30'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`w-5 h-5 bg-white rounded-full shadow-md`}
                    animate={{ x: privacy.lastSeen ? 28 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-3">
              <span className="text-3xl">🎨</span>
              <span>Appearance</span>
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-medium text-white text-lg mb-4">Theme</h3>
                <div className="flex space-x-4">
                  <motion.button
                    onClick={() => {
                      setTheme('light');
                      localStorage.setItem("theme", "light");
                      document.documentElement.classList.remove('dark');
                    }}
                    className={`px-6 py-3 rounded-xl border border-white/30 backdrop-blur-sm ${
                      theme === 'light'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Light
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setTheme('dark');
                      localStorage.setItem("theme", "dark");
                      document.documentElement.classList.add('dark');
                    }}
                    className={`px-6 py-3 rounded-xl border border-white/30 backdrop-blur-sm ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Dark
                  </motion.button>
                </div>
              </div>

              <div className="border-t border-white/20 pt-6">
                <h3 className="font-medium text-white text-lg mb-4">Chat Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Message Font Size</h4>
                      <p className="text-sm text-white/70">Adjust text size in chats</p>
                    </div>
                    <select className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white backdrop-blur-sm">
                      <option value="small" className="text-gray-800">Small</option>
                      <option value="medium" className="text-gray-800">Medium</option>
                      <option value="large" className="text-gray-800">Large</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Chat Background</h4>
                      <p className="text-sm text-white/70">Customize chat background</p>
                    </div>
                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Choose
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account & Security */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-3">
              <span className="text-3xl">🔐</span>
              <span>Account & Security</span>
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-medium text-white text-lg mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                      <p className="text-sm text-white/70">Add an extra layer of security</p>
                    </div>
                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Enable
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Change Password</h4>
                      <p className="text-sm text-white/70">Update your account password</p>
                    </div>
                    <motion.button
                      className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Change
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Login Sessions</h4>
                      <p className="text-sm text-white/70">Manage active sessions</p>
                    </div>
                    <motion.button
                      className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-6">
                <h3 className="font-medium text-white text-lg mb-6">Account Actions</h3>
                <div className="space-y-4">
                  <motion.button
                    className="w-full text-left px-6 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-xl transition-all duration-300 backdrop-blur-sm border border-red-400/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🚪 Logout from all devices
                  </motion.button>
                  <motion.button
                    className="w-full text-left px-6 py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 backdrop-blur-sm border border-red-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🗑️ Delete Account
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Data & Storage */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-3">
              <span className="text-3xl">💾</span>
              <span>Data & Storage</span>
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-medium text-white text-lg mb-4">Storage Usage</h3>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white">Messages & Media</span>
                      <span className="text-white/70">2.4 GB / 5 GB</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white">Stories</span>
                      <span className="text-white/70">156 MB / 1 GB</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-6">
                <h3 className="font-medium text-white text-lg mb-4">Data Management</h3>
                <div className="space-y-4">
                  <motion.button
                    className="w-full text-left px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📤 Export Chat History
                  </motion.button>
                  <motion.button
                    className="w-full text-left px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🧹 Clear Cache
                  </motion.button>
                  <motion.button
                    className="w-full text-left px-6 py-4 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-orange-200 rounded-xl transition-all duration-300 backdrop-blur-sm border border-orange-400/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🗂️ Manage Storage
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Help & Support */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-3">
              <span className="text-3xl">❓</span>
              <span>Help & Support</span>
            </h2>

            <div className="space-y-6">
              <motion.button
                className="w-full text-left px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">📚</span>
                <div>
                  <h4 className="font-medium">Help Center</h4>
                  <p className="text-sm text-white/70">Find answers to common questions</p>
                </div>
              </motion.button>

              <motion.button
                className="w-full text-left px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">💬</span>
                <div>
                  <h4 className="font-medium">Contact Support</h4>
                  <p className="text-sm text-white/70">Get help from our support team</p>
                </div>
              </motion.button>

              <motion.button
                className="w-full text-left px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">🐛</span>
                <div>
                  <h4 className="font-medium">Report a Bug</h4>
                  <p className="text-sm text-white/70">Help us improve CLARIO</p>
                </div>
              </motion.button>

              <motion.button
                className="w-full text-left px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">⭐</span>
                <div>
                  <h4 className="font-medium">Rate CLARIO</h4>
                  <p className="text-sm text-white/70">Share your feedback</p>
                </div>
              </motion.button>

              <div className="border-t border-white/20 pt-6">
                <div className="text-center">
                  <p className="text-white/70 text-sm mb-2">CLARIO v1.0.0</p>
                  <p className="text-white/50 text-xs">© 2024 CLARIO. All rights reserved.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;
