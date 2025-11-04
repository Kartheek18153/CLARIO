import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Chats from "./pages/Chats";
import Stories from "./pages/Stories";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />       {/* default page */}
        <Route path="/login" element={<Login />} />  {/* login page */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/stories" element={<Stories />} />
      </Routes>
    </Router>
  );
};

export default App;
