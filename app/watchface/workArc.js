import document from 'document';
import * as util from '../utils';

const workArcA = document.getElementById('workArcA');
const workArcB = document.getElementById('workArcB');
const workArcC = document.getElementById('workArcC');

function setWorkArc(show, workingDays, startHour, endHour) {
  
  let currentDay = (new Date().getDay() + 6) % 7;

  if (!show || workingDays.indexOf(currentDay) === -1) {
    workArcA.style.visibility =
    workArcB.style.visibility =
    workArcC.style.visibility = 'hidden';
    return;
  }

  let startAngle = util.hoursAndMinutesToFaceAngle(startHour, 0) + 180;
  let endAngle = util.hoursAndMinutesToFaceAngle(endHour, 0) + 180;
  let sweepAngle = endAngle - startAngle;
  
  workArcA.style.visibility =
  workArcB.style.visibility =
  workArcC.style.visibility = 'visible';
  workArcA.startAngle =
  workArcB.startAngle =
  workArcC.startAngle = startAngle;
  workArcA.sweepAngle =
  workArcB.sweepAngle =
  workArcC.sweepAngle = sweepAngle;
}

export default setWorkArc;