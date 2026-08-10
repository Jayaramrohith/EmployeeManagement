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

// Returns: { items, totalCount, pageNumber, pageSize, ... }
return response.data.data;
};

// Get employee by ID
export const getEmployeeById = async (id) => {
const response = await apiClient.get(`/${id}`);
return response.data.data;
};

// Create employee
export const createEmployee = async (employee) => {
const response = await apiClient.post("/", employee);
return response.data.data;
};

// Update employee
export const updateEmployee = async (id, employee) => {
const response = await apiClient.put(`/${id}`, employee);
return response.data.data;
};

// Delete employee
export const deleteEmployee = async (id) => {
const response = await apiClient.delete(`/${id}`);
return response.data;
};

export default apiClient;
