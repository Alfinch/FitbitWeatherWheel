import * as util from '../utils';
import document from 'document';

const rainBarsA = document.getElementById('rainBarsA').getElementsByTagName('arc');
const rainBarsB = document.getElementById('rainBarsB').getElementsByTagName('arc');

function setRainBars(startTime, values) {
  
    let startAngle = util.dateToFaceAngle(startTime);
    
    for(let i = 0; i < 24; ++i) {
      
      let a = rainBarsA[i];
      let b = rainBarsB[i];
      let h = Math.round(values[i] * 60);
      
      if (h === 0) {
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
      let ah = h > 30 ? 30 : h % 30;
      
      a.x = 63 - ah;
      a.y = 63 - ah;
      a.width = 336 - (a.x * 2);
      a.height = 336 - (a.y * 2);
      a.arcWidth = ah;
      a.startAngle = barStartAngle;
      a.sweepAngle = 5;
      
      if (h < 30) {
        b.x = 0;
        b.y = 0;
        b.width = 0;
        b.height = 0;
        b.arcWidth = 0;
        b.startAngle = 0;
        b.sweepAngle = 0;
        continue;
      }
      
      let bh = h % 30;
      
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