// src/components/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatWindow = ({ messages, onSendMessage, selectedUser, onDeleteMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() && !selectedImage) return;

    const messageData = {
      text: newMessage,
      image: selectedImage
    };

    onSendMessage(messageData);
    setNewMessage("");
    setSelectedImage(null);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <motion.div
      className="flex-1 flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <h2 className="text-xl font-bold flex items-center">
          <motion.span
            className="w-3 h-3 bg-green-400 rounded-full mr-2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Chat with {selectedUser.username}
        </h2>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
        <AnimatePresence>
          {messages.map((msg, idx) => {
            const currentUser = JSON.parse(localStorage.getItem("user"));
            const isCurrentUser = msg.sender_id === currentUser.id;
            return (
              <motion.div
                key={msg.id || idx}
                className={`mb-4 ${isCurrentUser ? "text-right" : "text-left"} relative group`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                {msg.image_url && (
                  <motion.div
                    className={`inline-block max-w-xs mb-2 ${isCurrentUser ? "ml-auto" : "mr-auto"} relative`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={msg.image_url}
                      alt="Shared image"
                      className="rounded-lg max-w-full h-auto cursor-pointer shadow-md"
                      onClick={() => window.open(msg.image_url, '_blank')}
                    />
                    {isCurrentUser && (
                      <motion.button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="Delete message"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ×
                      </motion.button>
                    )}
                  </motion.div>
                )}
                {msg.message && (
                  <motion.div
                    className={`inline-block px-4 py-2 rounded-2xl shadow-md ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    } relative max-w-xs break-words`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {msg.message}
                    {isCurrentUser && (
                      <motion.button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg text-xs"
                        title="Delete message"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ×
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="p-3 border-t bg-gray-50"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <motion.img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="w-16 h-16 object-cover rounded-lg shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
              <span className="text-sm text-gray-600 flex-1">{selectedImage.name}</span>
              <motion.button
                onClick={removeImage}
                className="text-red-500 hover:text-red-700 text-xl p-1 rounded-full hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="p-4 bg-white border-t"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-end space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <motion.button
            onClick={() => fileInputRef.current.click()}
            className="p-3 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            title="Attach image"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            📎
          </motion.button>
          <div className="flex-1 relative">
            <motion.input
              type="text"
              className="w-full border-2 border-gray-200 rounded-full px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-800 placeholder-gray-500"
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              whileFocus={{ scale: 1.02 }}
            />
            {isTyping && (
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                />
              </motion.div>
            )}
          </div>
          <motion.button
            onClick={handleSend}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
              newMessage.trim() || selectedImage
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!newMessage.trim() && !selectedImage}
            whileHover={newMessage.trim() || selectedImage ? { scale: 1.05 } : {}}
            whileTap={newMessage.trim() || selectedImage ? { scale: 0.95 } : {}}
          >
            🚀 Send
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatWindow;
