// Register service worker only if supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('Service Worker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('Service Worker registration failed: ', err);
    });
  });

  // Add install prompt for PWA
  let deferredPrompt;
  const installButton = document.createElement('button');
  installButton.style.display = 'none';

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button if needed - you can use this to add a custom install button
    // to your UI or trigger installation at the right time
    
    // For example:
    // installButton.style.display = 'block';
    // installButton.addEventListener('click', () => {
    //   installButton.style.display = 'none';
    //   deferredPrompt.prompt();
    //   deferredPrompt.userChoice.then((choiceResult) => {
    //     if (choiceResult.outcome === 'accepted') {
    //       console.log('User accepted the install prompt');
    //     } else {
    //       console.log('User dismissed the install prompt');
    //     }
    //     deferredPrompt = null;
    //   });
    // });
  });
} 