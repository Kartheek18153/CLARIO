// src/pages/Login.jsx
import React, { useState } from "react";
import { login } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login({ email, password });
      navigate("/home");
    } catch {
      setError("Invalid credentials or network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
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
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          >
            {i % 7 === 0 && <div className="w-8 h-8 bg-pink-400 rounded-full blur-sm" />}
            {i % 7 === 1 && <div className="w-6 h-6 bg-purple-400 rotate-45 blur-sm" />}
            {i % 7 === 2 && <div className="w-10 h-4 bg-indigo-400 rounded-full blur-sm" />}
            {i % 7 === 3 && <div className="w-5 h-10 bg-cyan-400 rounded-full blur-sm" />}
            {i % 7 === 4 && <div className="w-7 h-7 bg-blue-400 rounded-lg blur-sm" />}
            {i % 7 === 5 && <div className="w-6 h-8 bg-violet-400 rounded-full blur-sm" />}
            {i % 7 === 6 && <div className="w-4 h-4 bg-pink-500 rounded-full blur-sm" />}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="text-center mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-4"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-4xl">💬</span>
            </motion.div>
            <motion.h2
              className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Welcome Back ✨
            </motion.h2>
            <motion.p
              className="text-white/80 mt-2"
              variants={itemVariants}
            >
              Sign in to continue your journey
            </motion.p>
          </motion.div>

          {error && (
            <motion.p
              className="text-red-400 bg-red-500/20 border border-red-400/30 text-sm p-3 rounded-xl mb-6 text-center backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {error}
            </motion.p>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={itemVariants}
          >
            <motion.div
              variants={itemVariants}
            >
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-white placeholder-white/60 backdrop-blur-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div
              className="relative"
              variants={itemVariants}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-4 bg-white/20 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-white placeholder-white/60 backdrop-blur-sm pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/70 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? "🙈" : "👁️"}
              </motion.button>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              {isLoading ? (
                <motion.div
                  className="flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                </motion.div>
              ) : (
                "Login"
              )}
            </motion.button>
          </motion.form>

          <motion.p
            className="text-sm mt-8 text-center text-white/80"
            variants={itemVariants}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-pink-400 hover:text-pink-300 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
