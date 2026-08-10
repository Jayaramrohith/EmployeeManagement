import axios from 'axios';

const API_URL = 'https://localhost:7257/api/Auth';

export const login = async (email, password) => {
const response = await axios.post(`${API_URL}/login`, {
email,
password,
});

return response.data;
};

export const register = async (fullName, email, password) => {
const response = await axios.post(`${API_URL}/register`, {
fullName,
email,
password,
});

return response.data;
};
