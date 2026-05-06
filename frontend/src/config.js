const CONFIG = {
  // Try the injected variable, then the alternative name, then the bridge, then localhost
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://host.docker.internal:8000',
};

console.log("Current API URL:", CONFIG.API_BASE_URL);

export default CONFIG;