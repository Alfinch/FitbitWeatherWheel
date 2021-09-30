import * as util from '../utils';
import document from 'document';

const rainBarsA = document.getElementById('rainBarsA').getElementsByTagName('arc');
const rainBarsB = document.getElementById('rainBarsB').getElementsByTagName('arc');
const MAX_BAR_SWEEP = 5;

function setRainBars(hourlyPVol, hourlyPOP) {

  let currentTime = new Date();
  currentTime.setMinutes(0, 0, 0);
  let startAngle = util.dateToFaceAngle(currentTime) + 180;

  let next24PVol = hourlyPVol.slice(0, 24);
  let minVol = Math.min.apply(Math, next24PVol);
  let maxVol = Math.max.apply(Math, next24PVol);
  let volRange = maxVol - minVol;

  let next24POP = hourlyPOP.slice(0, 24);

  for (let i = 0; i < next24PVol.length; ++i) {

    let a = rainBarsA[i];
    let b = rainBarsB[i];
    let barHeight = volRange > 0 ? Math.round(((next24PVol[i] - minVol) / volRange) * 60) : 0;
    let barSweepAngle = next24POP[i] * MAX_BAR_SWEEP;

    if (barHeight === 0) {
      b.style.visibility = a.style.visibility = 'hidden';
      continue;
    }

    let barStartAngle = startAngle + (15 * i) + ((15 - barSweepAngle) / 2);
    let ah = barHeight > 30 ? 30 : barHeight % 30;

    a.style.visibility = 'visible';
    a.x = 63 - ah;
    a.y = 63 - ah;
    a.width = 336 - (a.x * 2);
    a.height = 336 - (a.y * 2);
    a.arcWidth = ah;
    a.startAngle = barStartAngle;
    a.sweepAngle = barSweepAngle;


    if (barHeight < 30) {
      b.style.visibility = 'hidden';
      continue;
    }

    let bh = barHeight - 30;

    b.style.visibility = 'visible';
    b.x = 33 - bh;
    b.y = 33 - bh;
    b.width = 336 - (b.x * 2);
    b.height = 336 - (b.y * 2);
    b.arcWidth = bh;
    b.startAngle = barStartAngle;
    b.sweepAngle = barSweepAngle;
  }
}

export default setRainBars;