 // Get event data  
function deviceOrientationListener(event) {  
  var alpha    = event.alpha; //z axis rotation \[0,360)  
  var beta     = event.beta; //x axis rotation \[-180, 180\]  
  var gamma    = event.gamma; //y axis rotation \[-90, 90\]

  //Check if absolute values have been sent  
  if (typeof event.webkitCompassHeading !== "undefined") {  
    alpha = event.webkitCompassHeading; //iOS non-standard
  }
  else {  
    console.log("Your device is reporting relative alpha values, so this compass won't point north");  
  }
}  
  
// Check if device can provide absolute orientation data  
if (window.DeviceOrientationAbsoluteEvent) {  
  window.addEventListener("DeviceOrientationAbsoluteEvent", deviceOrientationListener);  
} // If not, check if the device sends any orientation data  
else if(window.DeviceOrientationEvent){  
  window.addEventListener("deviceorientation", deviceOrientationListener);  
}
else {  
  console.log("Sorry, try again on a compatible mobile device!");  
}  
