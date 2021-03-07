export function zeroPad(i) {
  return i < 10 ? "0" + i : i;
}

export function unixTimeToFaceAngle(t) {
  return dateToFaceAngle(unixTimeToDate(t));
}

export function unixTimeToDate(t) {
  return new Date(t * 1000);
}

export function dateToFaceAngle(d) {
  let minutes = d.getHours() * 60 + d.getMinutes();
  let angle = (minutes / 1440) * 360;
  return angle % 360;
}

export function isNumber(value) {
   return typeof value === 'number' && isFinite(value);
}