// This script overrides any hardcoded API URLs in the application
// It runs before the main application code and intercepts all network requests

(function() {
  console.log('Enhanced API override script running');
  
  // Define the problematic URL patterns and their replacements
  const urlReplacements = [
    { from: 'http://localhost:5001/api/v1/items', to: '/api/v1/items' },
    { from: 'localhost:5001/api/v1/items', to: '/api/v1/items' },
    { from: 'localhost:5001/api/v1', to: '/api/v1' },
    { from: 'localhost:5001', to: '/api' },
    { from: 'http://server:5000/api/v1', to: '/api/v1' },
    { from: 'http://server:5000', to: '/api' }
  ];
  
  console.log('API override: Will replace the following patterns:');
  urlReplacements.forEach(({ from, to }) => {
    console.log(`  "${from}" → "${to}"`);
  });
  
  // Function to replace URLs based on patterns
  const replaceUrl = (url) => {
    if (typeof url !== 'string') return url;
    
    let newUrl = url;
    for (const { from, to } of urlReplacements) {
      if (newUrl.includes(from)) {
        newUrl = newUrl.replace(from, to);
        console.log(`API override: Redirecting from ${url} to ${newUrl}`);
        return newUrl;
      }
    }
    return url;
  };
  
  // Override the fetch function to intercept all requests
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    const newUrl = replaceUrl(url);
    return originalFetch(newUrl, options);
  };
  
  // Override XMLHttpRequest to intercept all requests
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    const newUrl = replaceUrl(url);
    return originalXHROpen.call(this, method, newUrl, ...args);
  };
  
  // Create a global variable to store the API URL
  window.API_URL = '/api/v1';
  
  // Patch axios if it's loaded
  const patchAxios = function() {
    if (window.axios) {
      console.log('Patching axios defaults');
      window.axios.defaults.baseURL = '/api/v1';
      
      // Also patch axios request interceptor
      if (window.axios.interceptors && window.axios.interceptors.request) {
        window.axios.interceptors.request.use(function(config) {
          if (config.url) {
            config.url = replaceUrl(config.url);
          }
          if (config.baseURL) {
            config.baseURL = replaceUrl(config.baseURL);
          }
          return config;
        });
      }
    }
  };
  
  // Try to patch axios now
  patchAxios();
  
  // Also try to patch axios after the page loads
  window.addEventListener('load', patchAxios);
  
  // Monitor for script loads that might include axios
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    if (tagName.toLowerCase() === 'script') {
      element.addEventListener('load', patchAxios);
    }
    return element;
  };
  
  // Directly modify any global variables that might contain the problematic URLs
  setInterval(function() {
    // Search through all global variables for strings containing the problematic URLs
    for (const key in window) {
      try {
        const value = window[key];
        if (typeof value === 'string') {
          for (const { from, to } of urlReplacements) {
            if (value.includes(from)) {
              console.log(`Found problematic URL in global variable ${key}, replacing`);
              window[key] = value.replace(from, to);
              break;
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          // Look for baseURL in axios-like objects
          if (value.defaults && value.defaults.baseURL && typeof value.defaults.baseURL === 'string') {
            for (const { from, to } of urlReplacements) {
              if (value.defaults.baseURL.includes(from)) {
                console.log(`Found problematic URL in ${key}.defaults.baseURL, replacing`);
                value.defaults.baseURL = value.defaults.baseURL.replace(from, to);
                break;
              }
            }
          }
          
          // Look for config objects with url property
          if (value.url && typeof value.url === 'string') {
            for (const { from, to } of urlReplacements) {
              if (value.url.includes(from)) {
                console.log(`Found problematic URL in ${key}.url, replacing`);
                value.url = value.url.replace(from, to);
                break;
              }
            }
          }
        }
      } catch (e) {
        // Ignore errors when accessing certain properties
      }
    }
  }, 1000); // Check every second
  
  // Create a special proxy for the specific problematic URL
  const createProxyForUrl = function(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/v1/items?page=1&limit=8', true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        console.log('Proxy request completed:', xhr.status);
      }
    };
    xhr.send();
  };
  
  // Try to make a proxy request for the specific URL
  setTimeout(function() {
    console.log('Making proxy request for problematic URL');
    createProxyForUrl('http://localhost:5001/api/v1/items?page=1&limit=8');
  }, 2000);
  
  console.log('Enhanced API override complete, API_URL set to:', window.API_URL);
})(); 