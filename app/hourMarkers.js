import document from 'document';

const hourMarkers = document.getElementById('graphHourMarkers');

function setHourMarkers(markerType) {

  switch (markerType) {

    case 1:
      hourMarkers.class = 'short';
      break;

    case 2:
      hourMarkers.class = 'long';
      break;

    default:
      hourMarkers.class = 'none';
      break;
  }
}

export default setHourMarkers;