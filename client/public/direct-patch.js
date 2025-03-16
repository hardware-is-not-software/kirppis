// This script directly patches the problematic URL in the compiled JavaScript bundle
// It runs after the page has loaded and searches for the problematic URL in all script elements

(function() {
  console.log('Direct patch script running');
  
  // Function to patch script content
  const patchScriptContent = (script) => {
    if (!script.textContent) return;
    
    // Check if the script contains the problematic URL
    if (script.textContent.includes('localhost:5001/api/v1/items')) {
      console.log('Found problematic URL in script, patching...');
      
      // Create a new script element with the patched content
      const newScript = document.createElement('script');
      newScript.textContent = script.textContent.replace(
        /localhost:5001\/api\/v1\/items/g, 
        '/api/v1/items'
      );
      
      // Replace the old script with the new one
      script.parentNode.replaceChild(newScript, script);
      console.log('Script patched successfully');
    }
  };
  
  // Function to patch all scripts
  const patchAllScripts = () => {
    const scripts = document.querySelectorAll('script');
    scripts.forEach(patchScriptContent);
  };
  
  // Run the patch when the page is fully loaded
  window.addEventListener('load', patchAllScripts);
  
  // Also try to patch scripts that are added dynamically
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'SCRIPT') {
            patchScriptContent(node);
          }
        });
      }
    });
  });
  
  // Start observing the document
  observer.observe(document, {
    childList: true,
    subtree: true
  });
  
  console.log('Direct patch script initialized');
})(); 