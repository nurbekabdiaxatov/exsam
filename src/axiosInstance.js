    import axios from 'axios';

    const axiosInstance = axios.create({
        baseURL: 'https://json-api.uz/api/project/exam',
        timeout: 10000,
    });

    // You can add interceptors here if needed for logging or modifying requests/responses

    export default axiosInstance;