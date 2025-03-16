// This script overrides any hardcoded API URLs in the application
// It runs before the main application code

(function() {
  console.log('API override script running');
  
  // Override the fetch function to intercept requests to localhost:5001
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.includes('localhost:5001')) {
      // Replace localhost:5001 with the correct API path
      const newUrl = url.replace('localhost:5001', '/api');
      console.log(`API override: Redirecting ${url} to ${newUrl}`);
      return originalFetch(newUrl, options);
    }
    return originalFetch(url, options);
  };
  
  // Override XMLHttpRequest to intercept requests to localhost:5001
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    if (typeof url === 'string' && url.includes('localhost:5001')) {
      // Replace localhost:5001 with the correct API path
      const newUrl = url.replace('localhost:5001', '/api');
      console.log(`API override: Redirecting ${url} to ${newUrl}`);
      return originalXHROpen.call(this, method, newUrl, ...args);
    }
    return originalXHROpen.call(this, method, url, ...args);
  };
  
  // Create a global variable to store the API URL
  window.API_URL = '/api/v1';
  
  console.log('API override complete, API_URL set to:', window.API_URL);
})(); 