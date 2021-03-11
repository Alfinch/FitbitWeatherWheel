import document from 'document';

const root = document.getElementById('root');

function setTheme(theme) {

    switch(theme) {

      case 1:
        root.class = 'greyscale';
        break;

      case 2:
        root.class = 'primary';
        break;

      default:
        root.class = 'punchy';
        break;
    }
  }

export default setTheme;