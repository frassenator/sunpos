let debounceTimer = null;

function debounceGeolocationRequest(callback, delay) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    navigator.geolocation.getCurrentPosition(callback);
  }, delay);
}

function handleGeolocationSuccess(position) {
  // Do something with the geolocation data
}

function handleGeolocationError(error) {
  // Handle any errors that occur while getting geolocation data
}
