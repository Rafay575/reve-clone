import axios from "axios";

// Adjust baseURL for your backend!
export const api = axios.create({
  baseURL: "http://localhost:4000/api", // change if needed
  withCredentials: true, // for cookies (if you use them)
});

