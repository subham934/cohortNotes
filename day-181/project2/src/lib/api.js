import axios from 'axios';

export let api = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true
});