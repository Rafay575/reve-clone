import axios from "axios";

// Adjust baseURL for your backend!
export const api = axios.create({
  baseURL: "https://www.tivoa.art/api", // change if needed
  withCredentials: true, // for cookies (if you use them)
});

