import axios from 'axios';

const api = axios.create({
    baseURL: 'https://thethreewishes-backend.onrender.com/api',
});

export default api;
