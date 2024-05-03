//import { words } from "list.js"; // this doesnt work because of the COS security error

// due to COS error, here are 100 words the game will randomly choose from
let words = ["about", "alert", "audio", "actor", "allow", "admit", "alive", "aside", "beach", "begin", 
            "being", "beads", "bells", "black", "cable", "cover", "carry", "claim", "crime", "cream", 
            "chair", "every", "error", "equal", "extra" ]
const cells = document.querySelectorAll('.cell');
const TRIES = 6;
let word = words[Math.floor(Math.random() * words.length)]; //mb change so it resets w every new game
let currGuess = [];
let index = 0;
let remainingTries = TRIES;
let gameActive = false; 
let gameState = ["", "", "", "", "",
                "", "", "", "", "",
                "", "", "", "", "",     
                "", "", "", "", "",
                "", "", "", "", "",
                "", "", "", "", ""];
//console.log(word);

// Event listeners to handle game start and cell interaction
document.addEventListener('DOMContentLoaded', () => {
    playGame();
    document.addEventListener('keydown', handleKeyDown);
    button = document.getElementById('newGameButton').addEventListener('click', playGame);
});

function playGame() {
    gameActive = true;
    word = words[Math.floor(Math.random() * words.length)]; 
    currGuess = []; 
    index = 0;
    remainingTries = TRIES;
    gameActive = true; 
    gameState = ["", "", "", "", "",
                "", "", "", "", "",
                "", "", "", "", "", 
                "", "", "", "", "",
                "", "", "", "", "",
                "", "", "", "", ""];
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.style.backgroundColor = "white";  // Reset value in cell 
        cell.style.color = "black";  // Reset classes
    });
    document.getElementById('resultDisplay').innerText = "";
}

// reads the keys typed on keyboard
function handleKeyDown(keyboardEvent) { 
    let char = keyboardEvent.key;
    char = String(char);
    let letter = char.match(/[a-z]/gi);
    if (remainingTries === 0) {
        document.getElementById('resultDisplay').innerText = `Better luck next time! The word was ${word}`;
        return;
    } else if (char === "Backspace" && index != 0) {
        deleteLetter();
    } else if (char === "Enter" && currGuess.length === 5) {
        compareWord();
        if (gameActive = false) {
            document.addEventListener('keydown', handleKeyDown);
        }
    } else if (letter.length == 1){
        placeLetter(char);
    } else {
        return;
    }
}

// places typed keys into the cells
function placeLetter(key) {
    if (index === 5) {
        return;
    }

    key = key.toUpperCase();
    let row =  (TRIES - remainingTries) * 5; // remaining = 1; tries = 6 index = 4 6, 5, 4, 3, 2, 21
    let cell = document.getElementsByClassName("cell")[row + index];
    cell.textContent = key;
    currGuess.push(key);
    index += 1;
}

function deleteLetter() {
    let row =  (TRIES - remainingTries) * 5; // remaining = 1; tries = 6 index = 4 6, 5, 4, 3, 2, 21
    let cell = document.getElementsByClassName("cell")[row + index];
    cell.textContent = "";
    currGuess.pop();    
    index -= 1;
}

function compareWord() {
    let correctIndex = 0;
    let temp = word;
    let row =  (TRIES - remainingTries) * 5;

    let guess = String(currGuess).toLowerCase();
    guess = guess.split(",").join("");

    for (let i = 0; i < word.length; i++) {
        let cell = document.getElementsByClassName("cell")[row + i];
        pos = temp.search(guess.charAt(i));
        
        if (pos === -1) {   
            //change color to grey
            cell.style.backgroundColor = "grey";
            cell.style.color = "white";
        } else {
            if (guess.charAt(i)=== word.charAt(i)) {
                // change to green
                cell.style.backgroundColor = "green";
                cell.style.color = "white";
                correctIndex++;
                temp = temp.replace(temp.charAt(pos), '#');
            } else {
                // change to yellow
                cell.style.backgroundColor = "yellow";
                temp = temp.replace(temp.charAt(pos), '#');
            } 
            
        }

        //console.log(temp);
    }

    remainingTries--;
    if (correctIndex === 5) {
        gameActive = false;
        document.getElementById('resultDisplay').innerText = `Congrats you WON!`;
    } else {
        index = 0;
        currGuess = [];
    }
}


