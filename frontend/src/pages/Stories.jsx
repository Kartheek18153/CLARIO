import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import StatusStories from "../components/StatusStories";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCaption, setUploadCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/stories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    setIsUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("story", uploadFile);
      if (uploadCaption.trim()) {
        formData.append("caption", uploadCaption);
      }

      await axios.post("http://localhost:5000/api/stories", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowUploadModal(false);
      setUploadFile(null);
      setUploadCaption("");
      fetchStories();
    } catch (error) {
      console.error("Error uploading story:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      setUploadFile(file);
    }
  };

  const filteredStories = stories.filter(story => {
    if (activeTab === "all") return true;
    if (activeTab === "friends") return story.user?.is_friend;
    if (activeTab === "my") return story.user?.is_me;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
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
              whileHover={{ x: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
            <span className="font-medium">Back to Home</span>
          </Link>
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            Stories ✨
          </motion.h1>
          <motion.button
            onClick={() => setShowUploadModal(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span>+</span>
            <span>Add Story</span>
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-full p-1 flex space-x-1">
            {[
              { id: "all", label: "All Stories", icon: "🌟" },
              { id: "friends", label: "Friends", icon: "👥" },
              { id: "my", label: "My Stories", icon: "👤" }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "bg-white text-purple-900 shadow-lg"
                    : "text-white/80 hover:text-white hover:bg-white/20"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stories Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {filteredStories.length === 0 ? (
                <motion.div
                  className="col-span-full flex flex-col items-center justify-center py-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="text-6xl mb-4 opacity-50"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📭
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white/80 mb-2">No stories yet</h3>
                  <p className="text-white/60 text-center">Be the first to share a story with your friends!</p>
                </motion.div>
              ) : (
                filteredStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl cursor-pointer border border-white/20"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      y: -8,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStory(story)}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="aspect-square relative group">
                      {story.media_type === "image" ? (
                        <motion.img
                          src={`http://localhost:5000${story.media_url}`}
                          alt={story.caption || "Story"}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <motion.video
                          src={`http://localhost:5000${story.media_url}`}
                          className="w-full h-full object-cover"
                          muted
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                      <div className="absolute top-3 left-3">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                          whileHover={{ scale: 1.1 }}
                        >
                          {story.user?.username?.charAt(0).toUpperCase() || "?"}
                        </motion.div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <motion.p
                          className="text-white text-sm font-semibold truncate mb-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {story.user?.username || "Unknown"}
                        </motion.p>
                        {story.caption && (
                          <motion.p
                            className="text-white/80 text-xs truncate"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.1 }}
                          >
                            {story.caption}
                          </motion.p>
                        )}
                        <motion.div
                          className="flex items-center space-x-1 mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                        >
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-white/60 text-xs">Active now</span>
                        </motion.div>
                      </div>
                      <motion.div
                        className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-white text-sm">👁</span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md mx-4 border border-white/20 shadow-2xl"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.h2
                  className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  ✨ Share Your Story
                </motion.h2>
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-semibold mb-3 text-white/90">Choose Your Moment</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="w-full px-4 py-4 bg-white/10 border-2 border-dashed border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600 cursor-pointer"
                      />
                      <motion.div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60"
                        whileHover={{ scale: 1.1 }}
                      >
                        📎
                      </motion.div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold mb-3 text-white/90">Add a Caption (Optional)</label>
                    <textarea
                      value={uploadCaption}
                      onChange={(e) => setUploadCaption(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 resize-none text-white placeholder-white/50"
                      rows={3}
                      placeholder="What's on your mind? ✨"
                    />
                  </motion.div>
                  <motion.div
                    className="flex space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.button
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 border border-white/20"
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.2)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleUpload}
                      disabled={!uploadFile || isUploading}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isUploading ? (
                        <motion.div
                          className="flex items-center justify-center space-x-2"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading...</span>
                        </motion.div>
                      ) : (
                        "Share Story ✨"
                      )}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Story Viewer */}
        <AnimatePresence>
          {selectedStory && (
            <StatusStories
              stories={[selectedStory]}
              onClose={() => setSelectedStory(null)}
              currentIndex={0}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Stories;
