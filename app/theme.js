import document from 'document';

const root = document.getElementById('root');

function setTheme(theme) {

  switch (theme) {

    case 1:
      root.class = 'grayscale';
      break;

    case 2:
      root.class = 'primary';
      break;

    case 3:
      root.class = 'monochrome';
      break;

    case 4:
      root.class = 'coral';
      break;

    default:
      root.class = 'punchy';
      break;
  }
}

export default setTheme;