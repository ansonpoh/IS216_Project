import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001",
})

api.interceptors.request.use((config) => {
    const authData = sessionStorage.getItem("auth");
    if(authData) {
        const {token} = JSON.parse(authData);
        if(token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;