import axios from 'axios';

export let axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
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

// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log('Axios instance response:', response);
//     return response;
//   },
//   (error) => {
//     console.error('Axios instance error:', error);
//   }
// );
  