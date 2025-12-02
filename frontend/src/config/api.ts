// API configuration - dynamically determine backend URL
let API_URL: string;

// If environment variable is set, use it
if (import.meta.env.VITE_API_URL) {
  API_URL = import.meta.env.VITE_API_URL;
}
// If running in production build, use Render backend
else if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  API_URL = 'https://tourbnb-phase1.onrender.com';
}
// Default: use Render backend for all builds to avoid localhost issues
else {
  API_URL = 'https://tourbnb-phase1.onrender.com';
}

export default API_URL;
