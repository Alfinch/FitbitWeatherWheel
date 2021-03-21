import document from 'document';
import * as util from '../utils';

const nightArcA = document.getElementById('nightArcA');
const nightArcB = document.getElementById('nightArcB');
const nightArcC = document.getElementById('nightArcC');

function setNightArc(sunset, sunrise) {
  
    let startAngle = util.unixTimeToFaceAngle(sunset);
    let endAngle = util.unixTimeToFaceAngle(sunrise);
    let sweepAngle = endAngle - startAngle;
    
    nightArcA.startAngle = startAngle;
    nightArcA.sweepAngle = sweepAngle;
    nightArcB.startAngle = startAngle;
    nightArcB.sweepAngle = sweepAngle;
    nightArcC.startAngle = startAngle;
    nightArcC.sweepAngle = sweepAngle;
  }

export default setNightArc;