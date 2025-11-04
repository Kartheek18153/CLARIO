import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 0px 8px rgb(59, 130, 246)" },
    tap: { scale: 0.95 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            {i % 6 === 0 && <div className="w-6 h-6 bg-pink-400 rounded-full blur-sm" />}
            {i % 6 === 1 && <div className="w-4 h-4 bg-purple-400 rotate-45 blur-sm" />}
            {i % 6 === 2 && <div className="w-8 h-3 bg-indigo-400 rounded-full blur-sm" />}
            {i % 6 === 3 && <div className="w-3 h-8 bg-cyan-400 rounded-full blur-sm" />}
            {i % 6 === 4 && <div className="w-5 h-5 bg-blue-400 rounded-lg blur-sm" />}
            {i % 6 === 5 && <div className="w-4 h-6 bg-violet-400 rounded-full blur-sm" />}
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          className="text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-5xl">💬</span>
            </motion.div>
            <motion.h1
              className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
              variants={itemVariants}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              Welcome to CLARIO ✨
            </motion.h1>
            <motion.p
              className="text-white/80 text-xl text-center max-w-lg mx-auto"
              variants={itemVariants}
            >
              Connect, share, and communicate with ease in this beautiful social space
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => navigate("/chats")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">💬</span>
              <span>Messages</span>
            </motion.button>
            <motion.button
              onClick={() => navigate("/stories")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">📱</span>
              <span>Stories</span>
            </motion.button>
            <motion.button
              onClick={() => navigate("/settings")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">⚙️</span>
              <span>Settings</span>
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm border border-white/20"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">🚪</span>
              <span>Logout</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
