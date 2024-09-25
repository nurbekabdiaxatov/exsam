import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://json-api.uz/api/project/exsam', 
    timeout: 10000, 
});

export default axiosInstance;