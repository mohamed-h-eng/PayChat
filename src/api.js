// const BASE_URL = 'http://localhost:3000/api'; // Update with your actual backend URL

// export const apiCall = async (endpoint, method = 'GET', body = null) => {
//   const token = localStorage.getItem('token');
  
//   const headers = {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };

//   const config = { method, headers };
//   if (body) config.body = JSON.stringify(body);

//   const response = await fetch(`${BASE_URL}${endpoint}`, config);
//   const data = await response.json();
  
//   // We attach the status so components can still see standard HTTP errors (like 400/500)
//   return { status: response.status, data };
// };
// Use a relative path so the browser automatically prepends the current domain 
// (e.g., https://your-app.vercel.app/api or http://localhost:3000/api)
const BASE_URL = 'http://localhost:3000/api'; 

export const apiCall = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  // Note: make sure your 'endpoint' string starts with a slash, e.g., '/users'
  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();
  
  // We attach the status so components can still see standard HTTP errors (like 400/500)
  return { status: response.status, data };
};