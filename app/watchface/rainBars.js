import * as util from '../utils';
import document from 'document';

const rainBarsA = document.getElementById('rainBarsA').getElementsByTagName('arc');
const rainBarsB = document.getElementById('rainBarsB').getElementsByTagName('arc');

function setRainBars(hourlyPVol) {

  let currentTime = new Date();
  currentTime.setMinutes(0, 0, 0);
  let startAngle = util.dateToFaceAngle(currentTime) + 180;

  let next24 = hourlyPVol.slice(0, 24);
  let minVol = Math.min.apply(Math, next24);
  let maxVol = Math.max.apply(Math, next24);
  let volRange = maxVol - minVol;

  for (let i = 0; i < next24.length; ++i) {

    let a = rainBarsA[i];
    let b = rainBarsB[i];
    let barHeight = volRange > 0 ? Math.round(((next24[i] - minVol) / volRange) * 60) : 0;

    if (barHeight === 0) {
      b.x = a.x = 0;
      b.y = a.y = 0;
      b.width = a.width = 0;
      b.height = a.height = 0;
      b.arcWidth = a.arcWidth = 0;
      b.startAngle = a.startAngle = 0;
      b.sweepAngle = a.sweepAngle = 0;
      continue;
    }

    let barStartAngle = startAngle + 5 + (15 * i);
    let ah = barHeight > 30 ? 30 : barHeight % 30;

    a.x = 63 - ah;
    a.y = 63 - ah;
    a.width = 336 - (a.x * 2);
    a.height = 336 - (a.y * 2);
    a.arcWidth = ah;
    a.startAngle = barStartAngle;
    a.sweepAngle = 5;

    if (barHeight < 30) {
      b.x = 0;
      b.y = 0;
      b.width = 0;
      b.height = 0;
      b.arcWidth = 0;
      b.startAngle = 0;
      b.sweepAngle = 0;
      continue;
    }

    let bh = barHeight - 30;

    b.x = 33 - bh;
    b.y = 33 - bh;
    b.width = 336 - (b.x * 2);
    b.height = 336 - (b.y * 2);
    b.arcWidth = bh;
    b.startAngle = barStartAngle;
    b.sweepAngle = 5;
  }
}

export default setRainBars;