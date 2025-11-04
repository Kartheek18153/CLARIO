// backend/controllers/chatController.js
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all messages for a specific room
export const getMessages = async (req, res) => {
  const { roomId } = req.params;

  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error("Fetch messages error:", err.message);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  const { room_id, sender_id, message } = req.body;
  let image_url = null;

  // Check if an image was uploaded
  if (req.file) {
    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'chat_images',
        resource_type: 'auto'
      });
      image_url = result.secure_url;

      // Delete the local file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      return res.status(500).json({ message: "Failed to upload image" });
    }
  }

  try {
    // First, ensure the room exists or create it if it doesn't
    let { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select("id")
      .eq("id", room_id)
      .single();

    if (roomError && roomError.code === 'PGRST116') {
      // Room doesn't exist, create it
      const { data: newRoom, error: createRoomError } = await supabase
        .from("rooms")
        .insert([{ id: room_id, name: `Room ${room_id}`, type: 'private' }])
        .select();

      if (createRoomError) throw createRoomError;
      roomData = newRoom[0];
    } else if (roomError) {
      throw roomError;
    }

    // Now insert the message
    const { data, error } = await supabase
      .from("messages")
      .insert([{ room_id, sender_id, message, image_url }])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Send message error:", err.message);
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
};

// Delete a message and its associated image
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    // First, get the message to check if it has an image
    const { data: message, error: fetchError } = await supabase
      .from("messages")
      .select("image_url")
      .eq("id", messageId)
      .single();

    if (fetchError) throw fetchError;

    // If there's an image, delete it from Cloudinary
    if (message.image_url) {
      try {
        // Extract public_id from Cloudinary URL
        const publicId = message.image_url.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
        // Continue with message deletion even if image deletion fails
      }
    }

    // Delete the message from the database
    const { error: deleteError } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (deleteError) throw deleteError;

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Delete message error:", err.message);
    res.status(500).json({ message: "Failed to delete message", error: err.message });
  }
};
