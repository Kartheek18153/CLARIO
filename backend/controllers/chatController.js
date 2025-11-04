// backend/controllers/chatController.js
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
    image_url = `http://localhost:5000/uploads/${req.file.filename}`;
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

    // If there's an image, delete it from the filesystem
    if (message.image_url) {
      const imagePath = path.join(__dirname, "../uploads", path.basename(message.image_url));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
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
