import document from 'document';
import * as util from '../utils';

const workArc = document.getElementById('workArc');

function setWorkArc(show, workingDays, startHour, endHour) {

  if (!show) {
    workArc.style.visibility = 'hidden';
    return;
  }

  let now = new Date();
  let currentDay = (now.getDay() + 6) % 7;

  let workingToday = workingDays.indexOf(currentDay) > -1;
  let workingTomorrow = workingDays.indexOf((currentDay + 1) % 7) > -1;

  if (!workingToday && !workingTomorrow) {
    workArc.style.visibility = 'hidden';
    return;
  }

  let startTime = new Date();
  startTime.setHours(startHour, (startHour % 1) * 60, 0, 0);

  let endTime = new Date();
  endTime.setHours(endHour, (endHour % 1) * 60, 0, 0);

  if (startTime === endTime) {
    workArc.style.visibility = 'hidden';
    return;
  }

  let startAngle, endAngle;

  if (startTime < endTime) {

    startAngle = (util.hoursAndMinutesToFaceAngle(startHour, 0) + 180) % 360;
    endAngle = (util.hoursAndMinutesToFaceAngle(endHour, 0) + 180) % 360;

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
  } else {

    startAngle = (util.hoursAndMinutesToFaceAngle(endHour, 0) + 180) % 360;
    endAngle = (util.hoursAndMinutesToFaceAngle(startHour, 0) + 180) % 360;

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
  }

  let sweepAngle = (endAngle - startAngle + 360) % 360;

  workArc.style.visibility = 'visible';
  workArc.startAngle = startAngle;
  workArc.sweepAngle = sweepAngle;
}

export default setWorkArc;