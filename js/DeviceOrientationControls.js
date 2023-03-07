import * as THREE from 'three';

THREE.DeviceOrientationControls = function ( object ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( 'YXZ' );

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	this.alphaOffset = 0; // radians
	
	this.alphaOffsetAngle = 0; // added line to set alphaOffsetAngle to 0

	var onDeviceOrientationChangeEvent = function ( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function () {

		scope.screenOrientation = window.orientation || 0;

	};

	var setObjectQuaternion = function ( quaternion, alpha, beta, gamma, orient ) {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		euler.set( beta, alpha, - gamma, 'YXZ' );

		quaternion.setFromEuler( euler ); // orient the device

		quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

		quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

	};

	this.connect = function () {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		//window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );
		window.addEventListener('deviceorientationabsolute', _onDeviceOrientationChangeEvent, false);
		window.addEventListener('deviceorientation', _onDeviceOrientationChangeEvent, false);


		scope.enabled = true;

	};

	this.disconnect = function () {

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		//window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );
		window.addEventListener('deviceorientationabsolute', _onDeviceOrientationChangeEvent, false);
		window.addEventListener('deviceorientation', _onDeviceOrientationChangeEvent, false);
		
		scope.enabled = false;

	};

	this.update = function () {

		if ( scope.enabled === false ) return;

		var alpha = (_deviceOrientation.alpha !== null) ? THREE.Math.degToRad(_deviceOrientation.alpha) + this.deviceAlphaOffsetAngle : 0; // Z
		var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad( scope.deviceOrientation.beta ) : 0; // X'
		var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
		var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

		setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );

	};

	this.dispose = function () {

		this.disconnect();

	};

	this.connect();

};
