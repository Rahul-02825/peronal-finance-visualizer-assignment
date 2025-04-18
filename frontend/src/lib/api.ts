import axios from "axios";

export const api = axios.create({
  baseURL: "https://peronal-finance-visualizer-backend.vercel.app/", 
});
