import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Get all employees
export const getEmployees = async () => {
  const response = await apiClient.get("/");

  console.log("Employee API response:", response.data);

  // If API returns an array
  if (Array.isArray(response.data)) {
    return response.data;
  }

  // If API returns { data: [...] }
  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }

  // If API returns { data: { items: [...] } }
  if (Array.isArray(response.data?.data?.items)) {
    return response.data.data.items;
  }

  return [];
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  const response = await apiClient.get(`/${id}`);
  return response.data?.data || response.data;
};

// Create employee
export const createEmployee = async (employee) => {
  const response = await apiClient.post("/", employee);
  return response.data;
};

// Update employee
export const updateEmployee = async (id, employee) => {
  const response = await apiClient.put(`/${id}`, employee);
  return response.data;
};

// Delete employee
export const deleteEmployee = async (id) => {
  const response = await apiClient.delete(`/${id}`);
  return response.data;
};

export default apiClient;