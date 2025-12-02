import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- UPDATED FOR VISION ---
export const sendChatMessage = async (
  message: string, 
  userId: string = "guest", 
  history: string[] = [], 
  gender: string = "Unknown",
  image: string | null = null // <--- Added Image Argument
) => {
  try {
    const response = await api.post('/chat', {
      message,
      user_id: userId,
      history,
      gender,
      image // <--- Send to Backend
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

export const checkServerHealth = async () => {
  try {
    const response = await api.get('/');
    return response.data.status === "online";
  } catch (error) {
    return false;
  }
};