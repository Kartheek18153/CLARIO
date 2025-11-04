import React, { useEffect, useState } from "react";
import { getUsers, fetchMessages, sendMessage, deleteMessage } from "../utils/api";
import { socket } from "../utils/socket";
import ChatWindow from "../components/ChatWindow";
import BackButton from "../components/BackButton";
import { motion, AnimatePresence } from "framer-motion";

const Chats = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersData = await getUsers();
        const currentUser = JSON.parse(localStorage.getItem("user"));
        // Filter out the current user from the list
        const filteredUsers = usersData.filter(user => user.id !== currentUser.id);
        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers);
        setIsLoading(false);
      } catch (err) {
        console.error("Fetch users error:", err);
        setIsLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Fetch messages when a user is selected
  useEffect(() => {
    const fetchUserMessages = async () => {
      if (!selectedUser) return;
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const roomId = [currentUser.id, selectedUser.id].sort().join('-');
      try {
        const msgs = await fetchMessages(roomId);
        setMessages(msgs);
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };
    fetchUserMessages();
  }, [selectedUser]);

  // Listen for real-time messages
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const roomId = [currentUser.id, selectedUser.id].sort().join('-');
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [selectedUser]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = async (messageData) => {
    if (!selectedUser) return;
    const currentUser = JSON.parse(localStorage.getItem("user"));
    // Create a unique room ID based on the two users' IDs
    const roomId = [currentUser.id, selectedUser.id].sort().join('-');

    // Join the room
    socket.emit("join_room", roomId);

    const formData = new FormData();
    formData.append("room_id", roomId);
    formData.append("sender_id", currentUser.id);
    formData.append("message", messageData.text || "");

    if (messageData.image) {
      formData.append("image", messageData.image);
    }

    try {
      const savedMessage = await sendMessage(formData);
      setMessages((prev) => [...prev, savedMessage]);
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setMessages((prev) => prev.filter(msg => msg.id !== messageId));
    } catch (err) {
      console.error("Delete message error:", err);
    }
  };

  const userItemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    hover: { scale: 1.02, backgroundColor: "#f3f4f6" }
  };

  const chatWindowVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="flex h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {i % 4 === 0 && <div className="w-4 h-4 bg-pink-400 rounded-full blur-sm" />}
            {i % 4 === 1 && <div className="w-3 h-3 bg-purple-400 rotate-45 blur-sm" />}
            {i % 4 === 2 && <div className="w-5 h-2 bg-indigo-400 rounded-full blur-sm" />}
            {i % 4 === 3 && <div className="w-2 h-5 bg-cyan-400 rounded-full blur-sm" />}
          </motion.div>
        ))}
      </div>

      {/* Users List */}
      <motion.div
        className="w-1/4 bg-white/10 backdrop-blur-lg border-r border-white/20 p-6 overflow-y-auto relative z-10"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.h2
          className="text-xl font-semibold mb-6 text-white flex items-center space-x-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span>👥</span>
          <span>Contacts</span>
        </motion.h2>

        {/* Search Bar */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <motion.input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-white placeholder-white/70 backdrop-blur-sm"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"
              whileHover={{ scale: 1.1 }}
            >
              🔍
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isLoading ? (
            <motion.div
              className="flex justify-center items-center h-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-6 h-6 border-2 border-pink-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          ) : (
            filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                className={`p-3 cursor-pointer rounded-lg mb-2 transition-all duration-200 backdrop-blur-sm ${
                  selectedUser?.id === user.id
                    ? "bg-pink-500/30 border-l-3 border-pink-400"
                    : "hover:bg-white/10"
                }`}
                variants={userItemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectUser(user)}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </motion.div>
                  <div className="flex-1">
                    <span className="font-medium text-white text-sm">{user.username}</span>
                    <p className="text-xs text-white/70">Tap to chat</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Window */}
      <motion.div
        className="w-3/4 p-6 relative z-10"
        variants={chatWindowVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {selectedUser && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <BackButton />
          </motion.div>
        )}
        <AnimatePresence mode="wait">
          {selectedUser ? (
            <motion.div
              key={selectedUser.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <ChatWindow
                messages={messages}
                onSendMessage={handleSendMessage}
                selectedUser={selectedUser}
                onDeleteMessage={handleDeleteMessage}
              />
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="text-6xl mb-6 opacity-70"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                💬
              </motion.div>
              <motion.p
                className="text-xl text-center text-white/80 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Select a contact to start a beautiful conversation ✨
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Chats;
