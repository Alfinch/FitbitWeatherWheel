import document from 'document';
import * as util from '../utils';

const workArcA = document.getElementById('workArcA');
const workArcB = document.getElementById('workArcB');

function setWorkArc(show, workingDays, startHour, endHour) {
  
  let currentDay = (new Date().getDay() + 6) % 7;

  if (!show || workingDays.indexOf(currentDay) === -1) {
    workArcA.startAngle = 0;
    workArcA.sweepAngle = 0;
    workArcB.startAngle = 0;
    workArcB.sweepAngle = 0;
    return;
  }

  let startAngle = util.hoursAndMinutesToFaceAngle(startHour, 0) + 180;
  let endAngle = util.hoursAndMinutesToFaceAngle(endHour, 0) + 180;
  let sweepAngle = endAngle - startAngle;
  
  workArcA.startAngle = startAngle;
  workArcA.sweepAngle = sweepAngle;
  workArcB.startAngle = startAngle;
  workArcB.sweepAngle = sweepAngle;
}

export default setWorkArc;