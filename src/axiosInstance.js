import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://json-api.uz/api/project/exsam', // Adjust to your API base URL
    timeout: 10000, // Optional: Set a timeout for requests
});

export default axiosInstance;