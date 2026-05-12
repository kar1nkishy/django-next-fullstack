import axios from "axios";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Указываем базовый URL для всех запросов
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry && !originalRequest.url.includes('token/refresh')) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                const res = await axios.post('http://127.0.0/token/refresh/', {
                    refresh: refreshToken
                });
                
                const newAccessToken = res.data.access;
                localStorage.setItem('access_token', newAccessToken);

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
