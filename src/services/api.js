import axios from 'axios';

// 1. Create the Axios Instance
// Replace 'https://api.example.com' with your actual backend URL later
const apiClient = axios.create({
    // baseURL: 'http://localhost:9100', // Using a fake API for demo purposes
    baseURL: 'https://ab-shoppy.icompunic.com',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// 2. Request Interceptor (Good place to inject tokens later)
// apiClient.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) config.headers.Authorization = `Bearer ${token}`;
//         return config;
//     },
//     (error) => Promise.reject(error)
// );
apiClient.interceptors.request.use(
    (config) => {
        // ✅ CHANGE THIS - accessToken se read karo
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);
// 3. Response Interceptor (Handle global errors like 401 or 500)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response || error.message);
        return Promise.reject(error);
    }
);

// 4. Export Generic Helper Functions
// This allows you to use apiGet('/products') in your components
export const apiGet = (url, params = {}) => apiClient.get(url, { params });
export const apiPost = (url, data) => apiClient.post(url, data);
export const apiPut = (url, data) => apiClient.put(url, data);
// export const apiDelete = (url) => apiClient.delete(url);
export const apiDelete = (url, data = {}) =>
  apiClient.delete(url, { data });

export const apiPatch = (url, data) => apiClient.patch(url, data);


export default apiClient;