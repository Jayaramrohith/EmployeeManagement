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

```
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

return config;
```

},
(error) => Promise.reject(error)
);

// Get all employees (returns the complete paginated response)
export const getEmployees = async () => {
const response = await apiClient.get("/");

console.log("Employee API response:", response.data);

// Your API returns: { success, message, data: { items, totalCount, pageNumber, pageSize } }
if (response.data?.success && response.data?.data) {
return response.data.data;
}

// Fallback
return {
items: [],
totalCount: 0,
pageNumber: 1,
pageSize: 10,
};
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
