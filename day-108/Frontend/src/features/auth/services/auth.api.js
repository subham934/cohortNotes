// jab bhi authentication related task hai,jo backend se communicate karna hai wo iss file mein likhna hoga
// => This is API LAYER 

// ============ API LAYER =============//

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});


export async function register(username, email, password) {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function login(username, password) {
  try {
    const response = await api.post("/login", {
      username,
      password,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getMe() {
  try {
    const response = await api.get("/get-me");
    return response.data;
  } catch (err) {
    throw err;
  }
}
