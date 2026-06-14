// lib/api/client.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://api.localhost:8000",
  withCredentials: true, // sends cookies, same as credentials: "include"
});