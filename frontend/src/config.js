const CONFIG = {
  // Try the environment variable first, fallback to the bridge
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://host.docker.internal:8000',
};
export default CONFIG;