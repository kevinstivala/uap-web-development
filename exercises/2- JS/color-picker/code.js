// Seleccionar los elementos necesarios
const redInput = document.getElementById('red');
const greenInput = document.getElementById('green');
const blueInput = document.getElementById('blue');

const redLabel = document.getElementById('red_label');
const greenLabel = document.getElementById('green_label');
const blueLabel = document.getElementById('blue_label');

const colorBox = document.querySelector('.color-display-box');

// Función para actualizar el valor del label
function updateLabel(input, label) {
    label.textContent = input.value;
}

// Función para actualizar el color del cuadro
function updateColorBox() {
    const valR = redInput.value;
    const valG = greenInput.value;
    const valB = blueInput.value;

    // Cambiar el color de fondo del cuadro
    colorBox.st