import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const getProductById = async (productId) => {
  const response = await axios.get(`${API_URL}/api/products/${productId}`);
  return response.data.data;
};
