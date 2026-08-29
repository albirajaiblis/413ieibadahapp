/* Qibla Direction Calculator & Compass Orientation Listener */

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const rad = deg => (deg * Math.PI) / 180;
const deg = rad => (rad * 180) / Math.PI;

export function calculateQiblaAngle(userLat, userLng) {
  const phi1 = rad(userLat);
  const phi2 = rad(KAABA_LAT);
  const dLambda = rad(KAABA_LNG - userLng);

  const y = Math.sin(dLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dLambda);

  let qiblaDeg = deg(Math.atan2(y, x));
  qiblaDeg = (qiblaDeg + 360) % 360;

  return Math.round(qiblaDeg * 10) / 10;
}

export function setupDeviceOrientationListener(onHeadingChange) {
  if (!window.DeviceOrientationEvent) return false;

  const handleOrientation = (e) => {
    let heading = null;
    if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
      // iOS Compass Heading
      heading = e.webkitCompassHeading;
    } else if (e.alpha !== undefined && e.alpha !== null) {
      // Android Compass Heading
      heading = 360 - e.alpha;
    }
    if (heading !== null && onHeadingChange) {
      onHeadingChange(Math.round(heading));
    }
  };

  window.addEventListener('deviceorientation', handleOrientation, true);

  return () => {
    window.removeEventListener('deviceorientation', handleOrientation, true);
  };
}
