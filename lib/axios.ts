import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/'}api/v1`;

const apiHandler = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export { apiHandler };