import document from 'document';
import * as util from '../utils';
import Spline from '../spline';
import { Polar } from '../vector';

const TAU = 2 * Math.PI;
const SEGMENTS_PER_HOUR = 8;
const graphSegments = document.getElementById('graphLineTransform').getElementsByTagName('line');

function setTempGraph(hourlyTemps) {

  let currentTime = new Date();
  currentTime.setMinutes(0, 0, 0);

  const startAngle = util.dateToFaceAngle(currentTime);
  const startAngleRadians = util.faceAngleDegreesToFaceAngleRadians(startAngle);

  let next24 = hourlyTemps.slice(0, 24);

  const minTemp = Math.floor(Math.min.apply(Math, next24));
  const maxTemp = Math.ceil(Math.max.apply(Math, next24));

  // Current progress through hour in segments
  const skipSegments = Math.round(new Date().getMinutes() / 60 * SEGMENTS_PER_HOUR);

  // 26 Data points - 25 for a full circle, plus one for overlap into the next hour
  const NUM_DATA_POINTS = Math.min(26, hourlyTemps.length);
  const TOTAL_LINE_POINTS = ((NUM_DATA_POINTS - 1) * SEGMENTS_PER_HOUR) + 1;
  const SEGMENTS_PER_DAY = 24 * SEGMENTS_PER_HOUR;

  if (graphSegments.length < SEGMENTS_PER_DAY) {
    throw new Error(`Not enough line segments to produce graph!
      ${SEGMENTS_PER_DAY} required, but only ${graphSegments.length} provided.`)
  }

  const tempRange = maxTemp - minTemp;
  const yValues = hourlyTemps.map(t => (t - minTemp) / tempRange);

  const xValues = util.buildArray(NUM_DATA_POINTS, i => i / 2);

  const spline = new Spline(xValues, yValues);

  let polarCoordinates = util.buildArray(TOTAL_LINE_POINTS, i =>
    new Polar(
      (spline.at(i / (SEGMENTS_PER_HOUR * 2)) * 60) + 105,
      (i / SEGMENTS_PER_DAY) * TAU + startAngleRadians
    )
  );

  let cartesianCoordinates = polarCoordinates
    .map(p => p.toCartesian());

  for (let i = 0, j = skipSegments, k = skipSegments + 1;
    i < graphSegments.length;
    ++i, ++j, ++k) {

    let s = graphSegments[i];

    let v1 = cartesianCoordinates[j];
    let v2 = cartesianCoordinates[k];

    if (v2 == null) {
      s.style.visibility = 'hidden';

    } else {
      s.style.visibility = 'visibility';
      s.x1 = v1.x;
      s.y1 = v1.y;
      s.x2 = v2.x;
      s.y2 = v2.y;
    }
  }
}

export default setTempGraph;