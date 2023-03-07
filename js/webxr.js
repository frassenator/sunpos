// Get the user's current location
navigator.geolocation.getCurrentPosition(position => {
  const userLat = position.coords.latitude;
  const userLon = position.coords.longitude;

  // Initialize the AR session
  const xrSession = navigator.xr.requestSession('immersive-ar');

  // Create a scene using THREE.js
  const scene = new THREE.Scene();

  // Calculate the positions of the 5 boxes
  const boxPositions = [
    { lat: userLat, lon: userLon },
    { lat: userLat + 0.00045, lon: userLon },
    { lat: userLat - 0.00045, lon: userLon },
    { lat: userLat, lon: userLon - 0.00045 },
    { lat: userLat, lon: userLon + 0.00045 }
  ];

  // Create a box for each position and add it to the scene
  const boxGeometry = new THREE.BoxGeometry();
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  boxPositions.forEach(pos => {
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(pos.lon, 0, pos.lat);
    scene.add(box);
  });

  // Use the AR session to place the scene in the real world
  xrSession.addEventListener('end', () => {
    scene.remove(camera);
    renderer.dispose();
  });

  xrSession.updateRenderState({
    baseLayer: new XRWebGLLayer(xrSession, gl)
  });

  const camera = new THREE.PerspectiveCamera();
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  xrSession.requestAnimationFrame(onXRFrame);

  function onXRFrame(time, xrFrame) {
    xrSession.requestAnimationFrame(onXRFrame);

    const pose = xrFrame.getViewerPose(xrReferenceSpace);
    if (pose !== null) {
      const view = pose.views[0];
      const viewport = xrWebGLLayer.getViewport(view);
      renderer.setSize(viewport.width, viewport.height);
      camera.matrix.fromArray(view.transform.matrix);
      camera.matrix.decompose(camera.position, camera.quaternion, camera.scale);
      renderer.render(scene, camera);
    }
  }
});
