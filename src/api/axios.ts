import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://admin.aimenu.ge',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Unwrap { success: true, data: {...} } envelope used by this backend
instance.interceptors.response.use(response => {
  if (response.data?.success === true && response.data?.data !== undefined) {
    response.data = response.data.data;
  }
  return response;
});

export default instance;
