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
    { from: 'http://server:5000', to: '/api' },
    { from: 'server:5000/api/v1', to: '/api/v1' },
    { from: 'server:5000', to: '/api' },
    // Add more patterns as needed
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
  
  // Override any axios baseURL that might be set
  if (window.axios) {
    console.log('Overriding axios defaults');
    window.axios.defaults.baseURL = window.API_URL;
  }
  
  // Check for any script tags with hardcoded URLs and patch them
  const patchScriptTags = function() {
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.src && (script.src.includes('localhost:5001') || script.src.includes('server:5000'))) {
        const newSrc = replaceUrl(script.src);
        console.log(`Patching script src from ${script.src} to ${newSrc}`);
        script.src = newSrc;
      }
    });
  };
  
  // Run the patch when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchScriptTags);
  } else {
    patchScriptTags();
  }
  
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