// backend/config/socket.js
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env"), override: true });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required. Please check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`📥 User ${socket.id} joined room ${roomId}`);
    });

    socket.on("send_message", async (data) => {
      console.log(`💬 Message from ${data.senderId} in ${data.roomId}: ${data.message}`);

      try {
        // Ensure the room exists or create it if it doesn't
        let { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("id")
          .eq("id", data.roomId)
          .single();

        if (roomError && roomError.code === 'PGRST116') {
          // Room doesn't exist, create it
          const { data: newRoom, error: createRoomError } = await supabase
            .from("rooms")
            .insert([{ id: data.roomId, name: `Room ${data.roomId}`, type: 'private' }])
            .select();

          if (createRoomError) throw createRoomError;
          roomData = newRoom[0];
        } else if (roomError) {
          throw roomError;
        }

        // Insert the message into the database
        const { data: messageData, error: messageError } = await supabase
          .from("messages")
          .insert([{ room_id: data.roomId, sender_id: data.senderId, message: data.message }])
          .select();

        if (messageError) throw messageError;

        // Emit the message to all users in the room, including the saved data
        io.to(data.roomId).emit("receive_message", { ...data, id: messageData[0].id, created_at: messageData[0].created_at });
      } catch (err) {
        console.error("Send message error:", err.message);
        // Optionally, emit an error back to the sender
        socket.emit("message_error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
}
