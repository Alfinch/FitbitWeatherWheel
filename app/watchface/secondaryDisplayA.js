import document from 'document';

const element = document.getElementById('secondaryDisplayA');

function setSecondaryDisplayA(value) {

    element.text = value;
}

export default setSecondaryDisplayA;