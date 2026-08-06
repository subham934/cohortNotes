import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// baseURL — ab jab bhi api.post('/api/auth/login') likhoge, automatically http://localhost:3000/api/auth/login ban jaayega. Har baar poora URL nahi likhna padega.
// withCredentials: true — backend jo cookies bheje (session cookie), wo browser save karega aur agle requests mein automatically bheji jaayengi. Bina iske authentication cookies kaam nahi karti.


//register API
export async function register({ email, password, username }) {
  const response = await api.post('/api/auth/register', {
    email,
    username,
    password,
  });
  return response.data;
}


// async function — ye function asynchronous hai, matlab network request ka wait karega
// Parameter mein destructuring — seedha {email, password, username} liya instead of user.email likhne ke
// api.post(...) — POST request bheji us URL pe, saath mein body mein data diya
// await — jab tak backend ka jawab nahi aata, yahan ruko
// response.data — axios puri response object deta hai, but humein sirf data chahiye (jo backend ne bheja)



//login API
export async function login({ email, password }) {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
}

//getMe API
export async function getMe() {
  const response = await api.get('/api/auth/get-me');
  return response.data;
}

//logout API
export async function logout() {
  const response = await api.get('/api/auth/logout');
  return response.data;
}

//forgotPassword API
export async function forgotPassword({ email }) {
  const response = await api.post('/api/auth/forgot-password', { email });
  return response.data;
}

//resetPassword API
export async function resetPassword({ token, password }) {
  const response = await api.post('/api/auth/reset-password', { token, password });
  return response.data;
}
