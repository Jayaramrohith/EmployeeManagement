import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

const apiClient = axios.create({
baseURL: API_BASE_URL,
headers: {
'Content-Type': 'application/json',
},
});

apiClient.interceptors.request.use(
(config) => {
const token = localStorage.getItem('token');


if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

return config;


},
(error) => Promise.reject(error)
);

export const getEmployees = async () => {
const response = await apiClient.get('/');
return response.data?.data?.items || [];
};

export const getEmployeeById = async (id) => {
const response = await apiClient.get(`/${id}`);
return response.data?.data || response.data;
};

export const createEmployee = async (employee) => {
const response = await apiClient.post('/', employee);
return response.data;
};

export const updateEmployee = async (id, employee) => {
const response = await apiClient.put(`/${id}`, employee);
return response.data;
};

export const deleteEmployee = async (id) => {
const response = await apiClient.delete(`/${id}`);
return response.data;
};

export default apiClient;
