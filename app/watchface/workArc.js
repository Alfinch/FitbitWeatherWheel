import document from 'document';
import * as util from '../utils';

const workArcA = document.getElementById('workArcA');
const workArcB = document.getElementById('workArcB');
const workArcC = document.getElementById('workArcC');

function setWorkArc(show, workingDays, startHour, endHour) {

  let startTime = new Date();
  startTime.setHours(startHour, (startHour % 1) * 60, 0, 0);

  let endTime = new Date();
  endTime.setHours(endHour, (endHour % 1) * 60, 0, 0);

  let now = new Date();
  let currentDay = (now.getDay() + 6) % 7;

  let workingToday = workingDays.indexOf(currentDay) > -1;
  let workingTomorrow = workingDays.indexOf((currentDay + 1) % 7) > -1;

  if (!show
    || (!workingToday && !workingTomorrow)
    || (workingToday && !workingTomorrow && now > endTime)
    || (!workingToday && workingTomorrow && now < startTime)) {
    workArcA.style.visibility =
      workArcB.style.visibility =
      workArcC.style.visibility = 'hidden';
    return;
  }

  let startAngle = (util.hoursAndMinutesToFaceAngle(startHour, 0) + 180) % 360;
  let endAngle = (util.hoursAndMinutesToFaceAngle(endHour, 0) + 180) % 360;

  if (startTime < now && now < endTime) {
    if (workingToday && !workingTomorrow) {
      startAngle = util.dateToFaceAngle(now) + 180;
      endAngle = util.hoursAndMinutesToFaceAngle(endHour, 0) + 180;
    }
    if (!workingToday && workingTomorrow) {
      startAngle = util.hoursAndMinutesToFaceAngle(startHour, 0) + 180;
      endAngle = util.dateToFaceAngle(now) + 180;
    }
  }

  let sweepAngle = (endAngle - startAngle + 360) % 360;

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