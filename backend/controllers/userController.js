import { supabase } from "../config/supabase.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Get all users (for showing in chat list)
export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, email, status, profile_pic");

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      users: data,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Get current user info
export const getMe = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, email, status, profile_pic")
      .eq("id", req.user.id)
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({
      message: "User fetched successfully",
      user: data,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update profile info
export const updateProfile = async (req, res) => {
  const { username, email, status } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ username, email, status })
      .eq("id", req.user.id)
      .select("id, username, email, status, profile_pic")
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      message: "Profile updated successfully",
      user: data
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Upload profile picture
export const uploadProfilePic = async (req, res) => {
  try {
    const file = req.file.path;
    const result = await cloudinary.uploader.upload(file);

    const { data, error } = await supabase
      .from("users")
      .update({ profile_pic: result.secure_url })
      .eq("id", req.user.id)
      .select("id, username, email, status, profile_pic")
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      message: "Profile picture updated successfully",
      url: result.secure_url,
      user: data
    });
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete account
export const deleteAccount = async (req, res) => {
  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", req.user.id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ error: err.message });
  }
};
