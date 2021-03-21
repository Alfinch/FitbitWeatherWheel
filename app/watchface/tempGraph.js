import document from 'document';
import * as util from '../utils';
import Spline from '../spline';
import { Polar } from '../vector';

const TAU = 2 * Math.PI;
const graphSegments = document.getElementById('graphLineTransform').getElementsByTagName('line');

function setTempGraph(startTime, hourlyTemps, minTemp, maxTemp, segments) {

  // Current progress through hour in segments
  const skipSegments = Math.round(new Date().getMinutes() / 60 * segments);

  // 26 Data points - 25 for a full circle, plus one for overlap into the next hour
  const NUM_DATA_POINTS = Math.min(26, hourlyTemps.length);
  const NUM_LINE_POINTS = ((NUM_DATA_POINTS - 1) * segments) + 1;
  const NUM_LINE_SEGMENTS = 24 * segments;

  if (graphSegments.length < NUM_LINE_SEGMENTS) {
    throw new Error(`Not enough line segments to produce graph!
      ${NUM_LINE_SEGMENTS} required, but only ${graphSegments.length} provided.`)
  }

  const startAngle = util.dateToFaceAngle(startTime);
  const startAngleRadians = util.faceAngleDegreesToFaceAngleRadians(startAngle);

  const tempRange = maxTemp - minTemp;
  const yValues = hourlyTemps.map(t => (t - minTemp) / tempRange);

  const xValues = util.buildArray(NUM_DATA_POINTS, i => i / 2);

  const spline = new Spline(xValues, yValues);

  let polarCoordinates = util.buildArray(NUM_LINE_POINTS, i =>
    new Polar(
      (spline.at(i / (segments * 2)) * 60) + 105,
      (i / NUM_LINE_SEGMENTS) * TAU + startAngleRadians
    )
  );

  let cartesianCoordinates = polarCoordinates
    .map(p => p.toCartesian());

  for (let i = 0,
    j = skipSegments,
    k = skipSegments + 1;
    i < NUM_LINE_SEGMENTS;
    ++i, ++j, ++k) {

    let s = graphSegments[i];

    let v1 = cartesianCoordinates[j];
    let v2 = cartesianCoordinates[k];

    s.x1 = v1.x;
    s.y1 = v1.y;
    s.x2 = v2.x;
    s.y2 = v2.y;
  }
}

export default setTempGraph;