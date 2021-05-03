import document from 'document';
import * as util from '../utils';

const nightArcA = document.getElementById('nightArcA');
const nightArcB = document.getElementById('nightArcB');
const nightArcC = document.getElementById('nightArcC');

function setNightArc(sunset, sunrise) {

    let startAngle = (util.unixTimeToFaceAngle(sunset) + 180) % 360;
    let endAngle = (util.unixTimeToFaceAngle(sunrise) + 180) % 360;
    let sweepAngle = endAngle - startAngle;

    nightArcA.startAngle = 
      nightArcB.startAngle = 
      nightArcC.startAngle = startAngle;
    nightArcA.sweepAngle = 
      nightArcB.sweepAngle = 
      nightArcC.sweepAngle = sweepAngle;
  }

export default setNightArc;