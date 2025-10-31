import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3500/api/auth",
  withCredentials: true, // send and receive cookies (JWT)
});

export default API;
