import axios from 'axios';

axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        if (response.status == 200 && response.data.code === 0) {
            return response.data.data;
        } else {
            return Promise.reject(response.data);
        }
    },
    error => {
        return Promise.reject(error);
    }
);

export default axios;
