import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { deleteStory } from "../utils/api";

const StatusStories = ({ stories: propStories, onClose, currentIndex = 0 }) => {
  const [stories, setStories] = useState([]);
  const [myStories, setMyStories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch all stories and user's stories
  const fetchStories = async () => {
    try {
      const token = localStorage.getItem("token");
      const [allStoriesRes, myStoriesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/story/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/story/my", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStories(allStoriesRes.data.stories);
      setMyStories(myStoriesRes.data.stories);

      // Extract current user info from my stories response
      if (myStoriesRes.data.stories && myStoriesRes.data.stories.length > 0) {
        // Get user info from the first story (assuming all stories belong to current user)
        const userInfo = myStoriesRes.data.stories[0].users;
        setCurrentUser(userInfo);
      } else {
        // If no stories, set currentUser to null
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  useEffect(() => {
    if (propStories && propStories.length > 0) {
      // Use props for modal viewing
      setSelectedStory(propStories[currentIndex]);
      setCurrentStoryIndex(0);
      setIsModalOpen(true);
    } else {
      // Fetch own data for full component
      fetchStories();
    }
  }, [propStories, currentIndex]);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("media", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/story/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchStories(); // Refresh stories
    } catch (error) {
      console.error("Error uploading story:", error);
      alert("Failed to upload story");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle story deletion
  const handleDeleteStory = async (storyId) => {
    console.log('handleDeleteStory called with storyId:', storyId);
    setStoryToDelete(storyId);
    setShowDeleteConfirm(true);
  };

  // Confirm story deletion
  const confirmDeleteStory = async () => {
    if (!storyToDelete) return;

    try {
      await deleteStory(storyToDelete);

      fetchStories(); // Refresh stories
      setIsModalOpen(false); // Close the story viewer
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("Failed to delete story");
    } finally {
      setShowDeleteConfirm(false);
      setStoryToDelete(null);
    }
  };

  // Cancel story deletion
  const cancelDeleteStory = () => {
    setShowDeleteConfirm(false);
    setStoryToDelete(null);
  };

  // Open story viewer
  const openStoryViewer = (userStories, startIndex = 0) => {
    setSelectedStory(userStories);
    setCurrentStoryIndex(startIndex);
    setIsModalOpen(true);
  };

  // Navigate stories
  const nextStory = () => {
    if (currentStoryIndex < selectedStory.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      if (onClose) {
        onClose();
      } else {
        setIsModalOpen(false);
      }
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-800">Stories</h2>
        <motion.button
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
          whileHover={!isUploading ? { scale: 1.05 } : {}}
          whileTap={!isUploading ? { scale: 0.95 } : {}}
        >
          {isUploading ? (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Uploading...</span>
            </motion.div>
          ) : (
            "Add Story"
          )}
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </motion.div>

      {/* My Stories */}
      {myStories.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">My Stories</h3>
          <div className="flex space-x-2 overflow-x-auto">
            {myStories.map((story, index) => (
              <div
                key={story.id}
                onClick={() => openStoryViewer({ user: currentUser || { username: "You", profile_pic: null, id: null }, stories: myStories }, index)}
                className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-blue-500 cursor-pointer overflow-hidden"
              >
                <img
                  src={story.media_url}
                  alt="My story"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Stories */}
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-300">All Stories</h3>
        <div className="space-y-2">
          {stories.map((userStory) => (
            <div
              key={userStory.user.id}
              onClick={() => openStoryViewer(userStory)}
              className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-700"
            >
              <div className="w-10 h-10 rounded-full border-2 border-gray-500 overflow-hidden">
                {userStory.user.profile_pic ? (
                  <img
                    src={userStory.user.profile_pic}
                    alt={userStory.user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-sm">
                    {userStory.user.username[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{userStory.user.username}</p>
                <p className="text-xs text-gray-400">
                  {userStory.stories.length} story{userStory.stories.length !== 1 ? "ies" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {isModalOpen && selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-md w-full h-full max-h-screen">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black to-transparent">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full border border-white overflow-hidden">
                  {selectedStory.user.profile_pic ? (
                    <img
                      src={selectedStory.user.profile_pic}
                      alt={selectedStory.user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-xs">
                      {selectedStory.user.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="text-white font-medium">{selectedStory.user.username}</p>
              </div>
            </div>

            {/* Story Content */}
            <div className="w-full h-full flex items-center justify-center">
              {selectedStory.stories[currentStoryIndex] && (
                <div className="relative w-full h-full">
                  {selectedStory.stories[currentStoryIndex].media_url.includes('.mp4') ||
                   selectedStory.stories[currentStoryIndex].media_url.includes('.mov') ||
                   selectedStory.stories[currentStoryIndex].media_url.includes('.avi') ? (
                    <video
                      src={selectedStory.stories[currentStoryIndex].media_url}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={selectedStory.stories[currentStoryIndex].media_url}
                      alt="Story"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <button
              onClick={prevStory}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
            >
              ‹
            </button>
            <button
              onClick={nextStory}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
            >
              ›
            </button>

            {/* Progress Bar */}
            <div className="absolute top-16 left-4 right-4 flex space-x-1">
              {selectedStory.stories.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-1 rounded ${
                    index <= currentStoryIndex ? "bg-white" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  setIsModalOpen(false);
                }
              }}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ×
            </button>

            {/* Delete Button (only for own stories) */}
            {(() => {
              console.log('About to render delete button, condition:', currentUser && selectedStory?.user?.id === currentUser?.id);
              return currentUser && selectedStory?.user?.id === currentUser?.id;
            })() && (
              <button
                onClick={() => {
                  console.log('Delete button clicked for story:', selectedStory.stories[currentStoryIndex].id);
                  handleDeleteStory(selectedStory.stories[currentStoryIndex].id);
                }}
                className="absolute top-4 right-12 text-white text-2xl bg-red-600 hover:bg-red-700 rounded-full w-12 h-12 flex items-center justify-center z-20 border-2 border-white"
                title="Delete story"
                style={{ zIndex: 20 }}
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Story</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this story? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={cancelDeleteStory}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStory}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatusStories;
