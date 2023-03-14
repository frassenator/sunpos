function calculateSunPosition(date, latitude, longitude) {
  // Convert latitude and longitude to radians
  latitude = latitude * Math.PI / 180;
  longitude = longitude * Math.PI / 180;

  // Calculate the Julian day
  const julianDay = getJulianDay(date);

  // Calculate the number of Julian centuries since J2000.0
  const T = (julianDay - 2451545.0) / 36525;

  // Calculate the sun's mean longitude (in degrees)
  const L0 = 280.46646 + T * (36000.76983 + T * 0.0003032) % 360;

  // Calculate the sun's mean anomaly (in degrees)
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);

  // Calculate the sun's equation of center (in degrees)
  const C = (1.914602 - T * (0.004817 + 0.000014 * T)) * Math.sin(M * Math.PI / 180) + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180) + 0.000289 * Math.sin(3 * M * Math.PI / 180);

  // Calculate the sun's true longitude (in degrees)
  const L = L0 + C;

  // Calculate the sun's apparent longitude (in degrees)
  const omega = 125.04 - 0.052 * T;
  const lambda = L - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);

  // Calculate the sun's right ascension (in radians)
  const epsilon = obliquityCorrection(T);
  const alpha = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda));

  // Calculate the sun's declination (in radians)
  const delta = Math.asin(Math.sin(epsilon) * Math.sin(lambda));

  // Calculate the local hour angle of the sun (in radians)
  const H = siderealTime(julianDay, longitude) - alpha;

  // Calculate the altitude of the sun (in radians)
  const altitude = Math.asin(Math.sin(latitude) * Math.sin(delta) + Math.cos(latitude) * Math.cos(delta) * Math.cos(H));

  // Calculate the azimuth of the sun (in radians)
  const azimuth = Math.atan2(-Math.sin(H), Math.cos(latitude) * Math.tan(delta) - Math.sin(latitude) * Math.cos(H));

  // Convert altitude and azimuth to degrees
  const altitudeDegrees = altitude * 180 / Math.PI;
  const azimuthDegrees = azimuth * 180 / Math.PI;

  return {
    altitude: altitudeDegrees,
    azimuth: azimuthDegrees
  };
}

// Calculate the obliquity of the ecliptic (in radians)
function obliquityCorrection(T) {
  const epsilon0 = 23.43929111;
  const omega = 125.04 - 0.052 * T;
  const epsilon = epsilon0 + 0.00256 * Math.cos(omega * Math.PI / 180);
  return epsilon * Math.PI / 180;
}

// Calculate the local sidereal time (in radians)
function siderealTime(julianDay, longitude) {
  const T = (julianDay - 2451545.0) / 36525;
  const GMST0 = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000;
  const GMST = (GMST0 + longitude * 180 / Math.PI) % 360;
  const siderealTime = GMST * Math.PI / 180;
  return siderealTime;
}

// Calculate the Julian day
function getJulianDay(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  if (month < 3) {
    year--;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5 + hour / 24 + minute / 1440 + second / 86400;

  return JD;
}

