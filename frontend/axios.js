import axios from "axios";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            const url = originalRequest.url || '';
            if (url.includes('login') || url.includes('register') || url.includes('refresh') || url.includes('token')) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                return Promise.reject(error);
            }

            try {
                const res = await api.post('refresh/', {
                    refresh: refreshToken
                });

                const newAccessToken = res.data.access;
                localStorage.setItem('access_token', newAccessToken);

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
