const CONFIG = {
  // Hardcode the bridge address temporarily to force a connection
  API_BASE_URL: 'http://host.docker.internal:8000',
};
console.log("Forced API URL:", CONFIG.API_BASE_URL);
export default CONFIG;