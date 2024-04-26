const cells = document.querySelectorAll('.cell')
let gameActive = true; 
let gameState = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];

// Event listeners to handle the start of game and keyboard interaction
document.addEventListener("DOMContentLoaded", () => {
    playGame();
    document.addEventListener("keydown", handleKeydown);
    // document.getElementById('restartButton').addEventListener("click", resartGame);
});

function handleKeydown(keyboardEvent) {
    document.getElementById('testing').innerText += keyboardEvent.key;
    const direction = keyboardEvent.key;
    // const clickedCellIndex = parseInt(pressedKey.getAttribute("data-cell-index"));
    console.log(direction);
}

function playGame() {
    gameActive = true;
    gameState = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    placeNumber();
    
}

function placeNumber() {
    // randomize an index from 0 to 15
    const index1 = Math.floor(Math.random() * 16);
    const num1 = Math.random() < 0.9 ? 2 : 4;
    const num2 = Math.random() < 0.9 ? 2 : 4;

    const index2 = Math.floor(Math.random() * 16);
    // generate random indices until it finds an empty cell
    while (gameState[index2] != '') {
        index2 = Math.floor(Math.random() * 16);
    }
    let pickedCell1 = null; 
    let pickedCell2 = null; 

    gameState[index1] = num1;
    pickedCell1 = getPickedCell(index1);
    pickedCell1.innerHTML = num1;

    gameState[index2] = num2;
    pickedCell2 = getPickedCell(index2);
    pickedCell2.innerHTML = num2; 
}

function getPickedCell(index) {
    for (let i = 0; i < cells.length; ++i) {
        if (cells[i].getAttribute('data-cell-index') == index) {
            return cells[i];
        }
    }
}