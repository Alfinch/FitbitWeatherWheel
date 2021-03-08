export function unixTimeToFaceAngle(t) {
  return dateToFaceAngle(unixTimeToDate(t));
}

export function unixTimeToDate(t) {
  return new Date(t * 1000);
}

export function dateToFaceAngle(d) {
  return hoursAndMinutesToFaceAngle(d.getHours(), d.getMinutes());
}

export function hoursAndMinutesToFaceAngle(h, m) {
  return (((h * 60) + m) / 4) % 360;
}

export function isNumber(value) {
  return typeof value === 'number' && isFinite(value);
}

export function faceAngleDegreesToFaceAngleRadians(degrees) {
  return (((degrees + 90) / 360) % 1) * 2 * Math.PI;
}

export function buildArray(length, forEachIndex) {
  return Array
    .apply(null, { length: length })
    .map((_, i) => forEachIndex(i));
}