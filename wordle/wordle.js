const cells = document.querySelectorAll('.cell');
const TRIES = 6;
let word = "";
let currGuess = "";
let index = 0;
let remainingTries = TRIES;
let gameActive = true; // not quite sure if this is what we want yet
let gameState = ["", "", "", "", "",
                "", "", "", "", "",
                "", "", "", "", "",
                "", "", "", "", "",
                "", "", "", "", "",
                "", "", "", "", ""];

// Event listeners to handle game start and cell interaction
document.addEventListener('DOMContentLoaded', () => {
    //document.getElementById('newButton').addEventListener('click', newGame); // to start the game
    document.addEventListener('keydown', handleKeyDown);
});

function handleKeyDown(keyboardEvent) { //should read only 1 key
    let char = keyboardEvent.key;
    char = String(char);
    let letter = char.match(/[a-z]/gi);
    if (remainingTries === 0) {
        return;
    } else if (char === "Backspace" && index != 0) {
        deleteLetter();
    } else if (char === "Enter") {
        compareWord();
    } else if (letter.length() === 1){
        placeLetter(key);
    } else {
        return;
    }
}

function placeLetter(key) {
    if (index === 5) {
        return;
    }

    key = key.toUpperCase();
    let row =  (TRIES - remainingTries) * 5; // remaining = 1; tries = 6 index = 4 6, 5, 4, 3, 2, 21
    let cell = document.getElementsByClassName("cell").children[row + index].innerHTML;
    cell.textContent = key;
    currGuess.push(key);
    index += 1;
}

function deleteLetter() {

}

function compareWord() {

}

