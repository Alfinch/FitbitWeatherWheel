import document from 'document';
import * as util from '../utils';
import Spline from '../spline';
import { Polar } from '../vector';

const TAU = 2 * Math.PI;
const graphSegments = document.getElementById('graphLineTransform').getElementsByTagName('line');

function setTempGraph(startTime, hourlyTemps, minTemp, maxTemp, segments) {

    // 25 nodes for a full circle of 24 segments
    const NUM_NODES = 25;
    const NUM_POINTS = 24 * segments + 1;
  
    const startAngle = util.dateToFaceAngle(startTime);
    const startAngleRadians = util.faceAngleDegreesToFaceAngleRadians(startAngle);
  
    let tempRange = maxTemp - minTemp;
    let yValues = hourlyTemps.map(t => (t - minTemp) / tempRange);

    const xValues = util.buildArray(NUM_NODES, i => i / 2);
  
    const spline = new Spline(xValues, yValues)
    
    let polarCoordinates = util.buildArray(NUM_POINTS, i =>
      new Polar(
        (spline.at(i / (segments * 2)) * 60) + 105,
        (i / (NUM_POINTS - 1)) * TAU + startAngleRadians
      )
    );
  
    let cartesianCoordinates = polarCoordinates
      .map(p => p.toCartesian());
    
    for(let i = 0, j = 1; j < NUM_POINTS; ++i, ++j) {
      
      let v1 = cartesianCoordinates[i];
      let v2 = cartesianCoordinates[j];
      let s = graphSegments[i];
  
      s.x1 = v1.x;
      s.y1 = v1.y;
      s.x2 = v2.x;
      s.y2 = v2.y;
    }
  }

  export default setTempGraph;