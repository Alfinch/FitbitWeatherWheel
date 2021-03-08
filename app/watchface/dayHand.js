import document from 'document';
import { hoursAndMinutesToFaceAngle } from '../utils';

const dayHandTransform = document.getElementById('dayHandTransform');

function setDayHand(hours, minutes) {
  
  dayHandTransform.groupTransform.rotate.angle
    = hoursAndMinutesToFaceAngle(hours, minutes);
}

export default setDayHand;