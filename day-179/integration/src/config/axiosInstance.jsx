import axios from 'axios';

export let axiosInstance = axios.create({
  baseURL: 'https://fakestoreapi.com',
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     console.log('Request sent:', config);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Axios instance response:', response);
    return response;
  },
  (error) => {
    console.error('Axios instance error:', error);
  }
);
