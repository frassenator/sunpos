! function(e, t) {
	"object" == typeof exports && "object" == typeof module ? module.exports = t(require("three")) : "function" == typeof define && define.amd ? define(["three"], t) : "object" == typeof exports ? exports.THREEx = t(require("three")) : e.THREEx = t(e.THREE)
}(this, (e => (() => {
	"use strict";
	var t = {
			381: t => {
				t.exports = e
			}
		},
		o = {};

	function i(e) {
		var n = o[e];
		if (void 0 !== n) return n.exports;
		var a = o[e] = {
			exports: {}
		};
		return t[e](a, a.exports, i), a.exports
	}
	i.d = (e, t) => {
		for (var o in t) i.o(t, o) && !i.o(e, o) && Object.defineProperty(e, o, {
			enumerable: !0,
			get: t[o]
		})
	}, i.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), i.r = e => {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
			value: "Module"
		}), Object.defineProperty(e, "__esModule", {
			value: !0
		})
	};
	var n = {};
	return (() => {
		i.r(n), i.d(n, {
			DeviceOrientationControls: () => l,
			LocationBased: () => t,
			WebcamRenderer: () => a
		});
		class e {
			constructor() {
				this.EARTH = 40075016.68, this.HALF_EARTH = 20037508.34
			}
			project(e, t) {
				return [this.lonToSphMerc(e), this.latToSphMerc(t)]
			}
			unproject(e) {
				return [this.sphMercToLon(e[0]), this.sphMercToLat(e[1])]
			}
			lonToSphMerc(e) {
				return e / 180 * this.HALF_EARTH
			}
			latToSphMerc(e) {
				return Math.log(Math.tan((90 + e) * Math.PI / 360)) / (Math.PI / 180) * this.HALF_EARTH / 180
			}
			sphMercToLon(e) {
				return e / this.HALF_EARTH * 180
			}
			sphMercToLat(e) {
				var t = e / this.HALF_EARTH * 180;
				return 180 / Math.PI * (2 * Math.atan(Math.exp(t * Math.PI / 180)) - Math.PI / 2)
			}
			getID() {
				return "epsg:3857"
			}
		}
		class t {
			constructor(t, o, i = {}) {
				this._scene = t, this._camera = o, this._proj = new e, this._eventHandlers = {}, this._lastCoords = null, this._gpsMinDistance = 0, this._gpsMinAccuracy = 1e3, this._watchPositionId = null, this.setGpsOptions(i)
			}
			setProjection(e) {
				this._proj = e
			}
			setGpsOptions(e = {}) {
				void 0 !== e.gpsMinDistance && (this._gpsMinDistance = e.gpsMinDistance), void 0 !== e.gpsMinAccuracy && (this._gpsMinAccuracy = e.gpsMinAccuracy)
			}
			startGps(e = 0) {
				return null === this._watchPositionId && (this._watchPositionId = navigator.geolocation.watchPosition((e => {
					this._gpsReceived(e)
				}), (e => {
					this._eventHandlers.gpserror ? this._eventHandlers.gpserror(e.code) : alert(`GPS error: code ${e.code}`)
				}), {
					enableHighAccuracy: !0,
					maximumAge: e
				}), !0)
			}
			stopGps() {
				return null !== this._watchPositionId && (navigator.geolocation.clearWatch(this._watchPositionId), this._watchPositionId = null, !0)
			}
			fakeGps(e, t, o = null, i = 0) {
				null !== o && this.setElevation(o), this._gpsReceived({
					coords: {
						longitude: e,
						latitude: t,
						accuracy: i
					}
				})
			}
			lonLatToWorldCoords(e, t) {
				const o = this._proj.project(e, t);
				return [o[0], -o[1]]
			}
			add(e, t, o, i) {
				this.setWorldPosition(e, t, o, i), this._scene.add(e)
			}
			setWorldPosition(e, t, o, i) {
				const n = this.lonLatToWorldCoords(t, o);
				[e.position.x, e.position.z] = n, void 0 !== i && (e.position.y = i)
			}
			setElevation(e) {
				this._camera.position.y = e
			}
			on(e, t) {
				this._eventHandlers[e] = t
			}
			_gpsReceived(e) {
				let t = Number.MAX_VALUE;
				e.coords.accuracy <= this._gpsMinAccuracy && (null === this._lastCoords ? this._lastCoords = {
					latitude: e.coords.latitude,
					longitude: e.coords.longitude
				} : t = this._haversineDist(this._lastCoords, e.coords), t >= this._gpsMinDistance && (this._lastCoords.longitude = e.coords.longitude, this._lastCoords.latitude = e.coords.latitude, this.setWorldPosition(this._camera, e.coords.longitude, e.coords.latitude), this._eventHandlers.gpsupdate && this._eventHandlers.gpsupdate(e, t)))
			}
			_haversineDist(e, t) {
				const o = THREE.Math.degToRad(t.longitude - e.longitude),
					i = THREE.Math.degToRad(t.latitude - e.latitude),
					n = Math.sin(i / 2) * Math.sin(i / 2) + Math.cos(THREE.Math.degToRad(e.latitude)) * Math.cos(THREE.Math.degToRad(t.latitude)) * (Math.sin(o / 2) * Math.sin(o / 2));
				return 2 * Math.atan2(Math.sqrt(n), Math.sqrt(1 - n)) * 6371e3
			}
		}
		var o = i(381);
		class a {
			constructor(e, t) {
				let i;
				this.renderer = e, this.renderer.autoClear = !1, this.sceneWebcam = new o.Scene, void 0 === t ? (i = document.createElement("video"), i.setAttribute("autoplay", !0), i.setAttribute("playsinline", !0), i.style.display = "none", document.body.appendChild(i)) : i = document.querySelector(t), this.geom = new o.PlaneBufferGeometry, this.texture = new o.VideoTexture(i), this.material = new o.MeshBasicMaterial({
					map: this.texture
				});
				const n = new o.Mesh(this.geom, this.material);
				if (this.sceneWebcam.add(n), this.cameraWebcam = new o.OrthographicCamera(-.5, .5, .5, -.5, 0, 10), navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
					const e = {
						video: {
							width: 1280,
							height: 720,
							facingMode: "environment"
						}
					};
					navigator.mediaDevices.getUserMedia(e).then((e => {
						console.log("using the webcam successfully..."), i.srcObject = e, i.play()
					})).catch((e => {
						alert(`Webcam error: ${e}`)
					}))
				} else alert("sorry - media devices API not supported")
			}
			update() {
				this.renderer.clear(), this.renderer.render(this.sceneWebcam, this.cameraWebcam), this.renderer.clearDepth()
			}
			dispose() {
				this.material.dispose(), this.texture.dispose(), this.geom.dispose()
			}
		}
		const s = new o.Vector3(0, 0, 1),
			r = new o.Euler,
			c = new o.Quaternion,
			d = new o.Quaternion(-Math.sqrt(.5), 0, 0, Math.sqrt(.5)),
			h = {
				type: "change"
			};
		class l extends o.EventDispatcher {
			constructor(e) {
				super(), !1 !== window.isSecureContext || window.cordova || console.error("THREE.DeviceOrientationControls: DeviceOrientationEvent is only available in secure contexts (https)");
				const t = this,
					i = new o.Quaternion;
				this.object = e, this.object.rotation.reorder("YXZ"), this.enabled = !0, this.deviceOrientation = {}, this.screenOrientation = 0, this.alphaOffset = 0, this.calibrationComplete = !1, this.cordovaOrientationWatchId = null, this.cordovaOrientationSettings = {
					frequency: 50
				}, this.iosDegOffset = 90, this.offsetSamples = 0, this.orientationChangeEventName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
				const n = function(e) {
						!1 === t.calibrationComplete && t.offsetSamples < 8 ? t.offsetSamples++ : (t.calibrationComplete = !0, t.deviceOrientation = e)
					},
					a = function() {
						t.screenOrientation = window.orientation || 0
					};
				this.connect = function() {
					if (a(), cordova && cordova.platformId && "ios" == cordova.platformId && window.navigator && window.navigator.accelerometer && window.navigator.accelerometer.watchAcceleration) return t.alphaOffset = o.Math.degToRad(t.iosDegOffset), t.cordovaOrientationWatchId = window.navigator.accelerometer.watchAcceleration(n, console.log, t.cordovaOrientationSettings), void(t.enabled = !0);
					void 0 !== window.DeviceOrientationEvent && "function" == typeof window.DeviceOrientationEvent.requestPermission ? window.DeviceOrientationEvent.requestPermission().then((function(e) {
						"granted" == e && (window.addEventListener("orientationchange", a), window.addEventListener(t.orientationChangeEventName, n))
					})).catch((function(e) {
						console.error("THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:", e)
					})) : (window.addEventListener("orientationchange", a), window.addEventListener(t.orientationChangeEventName, n)), t.enabled = !0
				}, this.disconnect = function() {
					this.cordovaOrientationWatchId ? navigator.accelerometer.clearWatch(this.cordovaOrientationWatchId) : (window.removeEventListener("orientationchange", a), window.removeEventListener(t.orientationChangeEventName, n)), t.enabled = !1
				}, this.update = function() {
					if (!1 === t.enabled || !1 === this.calibrationComplete) return;
					const e = t.deviceOrientation;
					if (e) {
						const n = e.alpha ? o.Math.degToRad(e.alpha) + t.alphaOffset : 0,
							a = e.beta ? o.Math.degToRad(e.beta) : 0,
							l = e.gamma ? o.Math.degToRad(e.gamma) : 0,
							u = t.screenOrientation ? o.Math.degToRad(t.screenOrientation) : 0;
						! function(e, t, o, i, n) {
							r.set(o, t, -i, "YXZ"), e.setFromEuler(r), e.multiply(d), e.multiply(c.setFromAxisAngle(s, -n))
						}(t.object.quaternion, n, a, l, u), 8 * (1 - i.dot(t.object.quaternion)) > 1e-6 && (i.copy(t.object.quaternion), t.dispatchEvent(h))
					}
				}, this.dispose = function() {
					t.disconnect()
				}, this.connect()
			}
		}
	})(), n
})()));
