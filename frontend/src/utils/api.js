import axios from "axios";

const API_URL = "http://localhost:5000/api";

// -------- AUTH ----------
export const login = async (credentials) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/login`, credentials, { withCredentials: true });
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/signup`, userData, { withCredentials: true });
    if (data.token) localStorage.setItem("token", data.token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    throw error;
  }
};

// -------- USERS ----------
export const getUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/user/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.users; // backend returns { users: [...] }
  } catch (error) {
    console.error("Get users error:", error.response?.data || error.message);
    throw error;
  }
};

// -------- CHAT ----------
export const fetchMessages = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/chat/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.messages || data; // depending on backend response
  } catch (error) {
    console.error("Fetch messages error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.delete(`${API_URL}/chat/${messageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Delete message error:", error.response?.data || error.message);
    throw error;
  }
};

export const sendMessage = async (messageData) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(`${API_URL}/chat/`, messageData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.error("Send message error:", error.response?.data || error.message);
    throw error;
  }
};

// -------- AI ----------
export const sendToAI = async (message) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(`${API_URL}/ai/suggest`, { message }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Send to AI error:", error.response?.data || error.message);
    throw error;
  }
};
