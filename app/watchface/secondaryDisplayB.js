import document from 'document';

const element = document.getElementById('secondaryDisplayB');

function setSecondaryDisplayB(value) {

    element.text = value;
}

export default setSecondaryDisplayB;