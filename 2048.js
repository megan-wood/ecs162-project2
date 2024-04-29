const cells = document.querySelectorAll('.cell')
let gameActive = false;
let gameState = ["", "", "", "",
                 "", "", "", "", 
                 "", "", "", "", 
                 "", "", "", ""];
// let gameState = [["", "", "", ""],
//                  ["", "", "", ""], 
//                  ["", "", "", ""], 
//                  ["", "", "", ""]];
const boardDimension = 4;
let score = 0;

// Event listeners to handle the start of game and keyboard interaction
document.addEventListener("DOMContentLoaded", () => {
    playGame();
    // document.getElementById("board").addEventListener("keydown", handleKeydown);
    document.addEventListener("keydown", handleKeydown);
    // document.getElementById('restartButton').addEventListener("click", resartGame);
});

function handleKeydown(keyboardEvent) {
    const direction = keyboardEvent.key;
    // const clickedCellIndex = parseInt(pressedKey.getAttribute("data-cell-index"));
    if (gameActive && validDirection(direction)) {
        keyboardEvent.preventDefault();  // prevents pressing the arrow keys from scrolling the page
        document.getElementById('testing').innerText += " " + keyboardEvent.key;
        handleArrowKey(direction);
        updateGameStatus();  // updates score and checks if the game is over (won or filled board)
    }
}

function validDirection(direction) {
    if (direction === "ArrowLeft" || direction === "ArrowRight" ||
        direction === "ArrowUp" || direction === "ArrowDown") {
        return true; 
    }
    return false;
}

function handleArrowKey(key) {
    /* Move the current square on the grid as much as they can move in the given
       direction. Combine any squares that are equal in value 
       If there are three of the same number, two tiles farthest along direction
       of motion combine    */
    if (key === "ArrowLeft") {
        moveLeft();
    } else if (key === "ArrowRight") {
        moveRight();
    } else if (key === "ArrowUp") {
        moveUp();
    } else {  // key is ArrowDown
        moveDown();
    }
}

function moveLeft() {
    // Check how many cells each one can can move 
    // The most a cell can move is 3 cells over
    // Cannot move over if there are other cells (if not empty or if at boundary)
    // When they combine, they take the spot of the first one
    // Unless there are 3 in a row, the 2 farthest along direction of movement combine

    // Analyze the row starting from the right side
    // Row 0 is indices from 0 to 3
    // Row 1 is indices from 4 to 7
    // Row 2 is indices from 8 to 11
    // Row 3 is indices from 12 to 15
    const leftBoundary = [0, 4, 8, 12];
    const rightBoundary = [3, 7, 11, 15];
    let value = 0;
    for (let i = 0; i < boardDimension; ++i ) {  // 0 to 3
        moveValuesInRowLeft(leftBoundary[i]);
    }
    // for (let i = 0; i < cells.length; ++i) {
    //     let row = determineRow(i);
    //     value = gameState[i];
    //     for (let j = 1; j < boardDimension; ++j) {
    //         console.log(i - j);
    //         if (inBoundary(i - j, row, leftBoundary)) {
    //             if (sameNumber(i, i - j)) {
    //                 value = gameState[i] + gameState[i - j];
    //             } else if (emptyCell(i - j)) {
                    
    //             }
    //         }
    //     }
    // }
}

function moveRowLeft(leftEnd, rightEnd) {
    // The leftEnd and rightEnd are the indices of the cells on the left and right walls respectively
    let value = 0;
    moveValuesInRowLeft(leftEnd);
    addValuesInRowLeft(leftEnd);

    // for (let i = leftEnd; i < boardDimension; ++i) {  // iterate through columns
        // value = gameState[leftEnd];
        // if (inBoundary())
        // if (sameNumber(i, leftEnd + i)) {
        //     value = gameState[leftEnd] + gameState[leftEnd + i];
        // } else if (!sameNumber(i, rightEnd + i) && !emptyCell(leftEnd + i)) {

        // }

    // }
}

function moveValuesInRowLeft(leftEnd) {
    let curIndex = 0, nextIndex = 0; 
    for (let i = 0; i < boardDimension; ++i) {
        while (leadingEmptyCells(i)) {  // keep shifting cells over while there are leading empty cells
            for (let j = 1; j < boardDimension; ++j) {
                curIndex = leftEnd + j - 1;
                nextIndex = leftEnd + j;
                if (emptyCell(curIndex) && !emptyCell(nextIndex)) {
                    gameState[curIndex] = gameState[nextIndex];
                    gameState[nextIndex] = "";
                } else if (emptyCell[curIndex] && emptyCell(nextIndex)) {
                    continue;
                }
            }
        }
    }
}


function leadingEmptyCells(leftEnd) {
    // Go through row and see if there are spaces before the first cell that a value
    // Make sure that there are values in the row, otherwise there are no leading empty cells
    let firstFilledCellIndex = -1; 
    let empty = false; 
    for (let i = 0; i < boardDimension; ++i) {
        curIndex = leftEnd + i;
        if (!emptyCell(curIndex) && curIndex == leftEnd) {  // no leading empty cells if first one is filled
            return false; 
        } else if (!emptyCell(curIndex) && curIndex != leftEnd) {
            firstFilledCellIndex = leftEnd + i;
        } else if (emptyCell(curIndex)) {  // if empty cell is encountered, at least one leading empty cell
            empty = true;
        }
    }
    if (empty && firstFilledCellIndex != -1) {
        return true;
    } else {  // row was empty so there are no leading empty cells 
        return false;
    }
}

function addValuesInRowLeft(leftEnd) {

}

function moveRight() {
    const rightBoundary = [3, 7, 11, 15];

}

function moveUp() {
    const upBoundary = [0, 1, 2, 3];

}

function moveDown() {
    const downBoundary = [12, 13, 14, 15];

}

function determineRow(index) {
    if (index >= 0 && index <= 3) {
        return 0; 
    } else if (index >= 4 && index <= 7) {
        return 1; 
    } else if (index >= 8 && index <= 11) {
        return 2; 
    } else {
        return 3; 
    }
}

function inBoundary(index, row, boundary) {
    // index less than the index for the wall of that direction's boundary
    // ex: index less than the index for the left wall of the grid
    if (index <= boundary[row]) {
        return true; 
    }
    return false; 
}

function sameNumber(i, j) {
    return gameState[i] === gameState[j];
}

function playGame() {
    gameActive = true;
    gameState = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    cells.forEach(cell => {
        cell.innerHTML = "";  // Reset value in cell 
        cell.className = "cell";  // Reset classes
    })
    // Generate first two initial values on the board 
    placeNumber();
    placeNumber();
    // gameState = ["", 2, "", 2, "", "", "", "", "", "", "", "", "", "", "", ""]
    // updateGameStatus();
}

function placeNumber() {
    // randomize an index from 0 to 15
    let index = Math.floor(Math.random() * 16);
    const num = Math.random() < 0.9 ? 2 : 4;
    let pickedCell = null; 

    // generate another random index until it finds an empty cell
    while (!emptyCell(index)) {
        index = Math.floor(Math.random() * 16);
    }

    gameState[index] = num;
    pickedCell = cells[index];
    pickedCell.innerHTML = num; 
}

function emptyCell(index) {
    return gameState[index] == '';
}

function updateGameStatus() {
    for (let i = 0; i < gameState.length; ++i) {
        cells[i].innerHTML = gameState[i];
    }
}

// function getPickedCell(index) {
//     for (let i = 0; i < cells.length; ++i) {
//         if (cells[i].getAttribute('data-cell-index') == index) {
//             return cells[i];
//         }
//     }
// }