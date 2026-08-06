// =============== API LAYER ===============    

import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials: true,

})

// to interact with backend for authentication, we have 3 api methods, i.e., login, register, get-me, so we need to create 3 different function to interact with the 3 api methods

export async function login(username, password){
    const response = await api.post('/login', {username, password})
    return response.data
}

export async function register(username, email, password){
    const response = await api.post('/register', {username, email, password})
    return response.data
}

export async function getMe(){
    const response = await api.get('/get-me')
    return response.data
}