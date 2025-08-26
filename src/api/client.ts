import axios from "axios";
export const api = axios.create({
  baseURL: "https://sua-api.exemplo.com",
  timeout: 10000,
});
export const withAuth = (token: string|null) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {};
