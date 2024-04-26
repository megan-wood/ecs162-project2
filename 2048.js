const cells = document.querySelectorAll('.cell')
let gameActive = true; 
let gameState = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];

// Event listeners to handle the start of game and keyboard interaction
document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keydown", handleKeydown);
});

function handleKeydown(event) {
    document.getElementById('testing').innerText += event.key;
}