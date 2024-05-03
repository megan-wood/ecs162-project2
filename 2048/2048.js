const cells = document.querySelectorAll('.cell')
let gameActive = false;
let gameState = ["", "", "", "",
                 "", "", "", "", 
                 "", "", "", "", 
                 "", "", "", ""];
const boardDimension = 4;
let score = 0;

// Event listeners to handle the start of game and keyboard interaction
document.addEventListener("DOMContentLoaded", () => {
    playGame();
    // document.getElementById("board").addEventListener("keydown", handleKeydown);
    document.addEventListener("keydown", handleKeydown);
    // document.getElementById('restartButton').addEventListener("click", resartGame);
});

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
//     gameState = ["", 2, "", 2, 
//                  2, 4, "", "", 
//                  "", 2, "", "", 
//                  "", "", "", 2];
//     updateGameStatus();
}

function placeNumber() {
    // randomize an index from 0 to 15
    let index = Math.floor(Math.random() * 16);
    const num = Math.random() < 0.9 ? 2 : 4;
    let pickedCell = null; 

    // place another number if the game is still active
    if (gameActive) {
        // generate another random index until it finds an empty cell
        while (!emptyCell(index)) {
            index = Math.floor(Math.random() * 16);
        }

        gameState[index] = num;
        pickedCell = cells[index];
        pickedCell.innerHTML = num; 
    }
    return pickedCell;
}

function emptyCell(index) {
    return gameState[index] == '';
}

function handleKeydown(keyboardEvent) {
    const direction = keyboardEvent.key;
    // const clickedCellIndex = parseInt(pressedKey.getAttribute("data-cell-index"));
    if (gameActive && validDirection(direction)) {
        keyboardEvent.preventDefault();  // prevents pressing the arrow keys from scrolling the page
        document.getElementById('results').innerText += " " + keyboardEvent.key;
        handleArrowKey(direction);
        updateGameStatus();  // updates score and checks if the game is over (won or filled board)
        placeNumber();  // place another random number at a random empty cell
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

function sameNumber(i, j) {
    return gameState[i] === gameState[j];
}

function updateGameStatus() {
    // Update the board on the webpage
    for (let i = 0; i < gameState.length; ++i) {
        cells[i].innerHTML = gameState[i];
    }

    // Update the score on the webpage
    console.log("score: " + score);
    document.getElementById("score-value").innerHTML = score;

    // Check if the game is still active
    if (game_won() || game_is_over()) {
        gameActive = false; 
    }
}

function game_won() {
    // game is won when there is a cell with value 2048 
    // can also reach the maximum value
    for (let i = 0; i < cells.length; ++i) {
        if (cells[i].innerHTML === 2048) {
            document.getElementById("results").innerHTML += " You won!";
            return true; 
        }
    }
    return false; 
}

function game_is_over() {
    // if (board_full() && no_legal_moves()) {

    // }
    return board_full();
}

function board_full() {
    // go through all the cells andc check if they are empty, if true, then board is not empty
    for (let i = 0; i < cells.length; ++i) {
        if (cells[i].innerHTML === "") {
            return false; 
        }
    }
    document.getElementById("results").innerHTML += " Game over."
    return true; 
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
    for (let i = 0; i < boardDimension; ++i ) {  // go through each row, 0 to 3
        // shift values as far left as they can go (either hits the wall or other cells)
        moveValuesInRowLeft(leftBoundary[i], rightBoundary[i]);
        // add the values from left to right if the cells are the same value 
        addValuesInRowLeft(leftBoundary[i]);
        // shift the values as far left as they can go again
        moveValuesInRowLeft(leftBoundary[i], rightBoundary[i]);
    }
}

function moveValuesInRowLeft(leftEnd, rightEnd) {
    let nextIndex = 0; 
    for (let i = 0; i < boardDimension; ++i) {  // iterates shifting process through each cell to get rid of leading empty cells
        let k = 0;
        while (leadingEmptyCellsFromLeft(leftEnd + i, rightEnd)) {  // keep shifting cells over while there are leading empty cells
            for (let curIndex = leftEnd + i; curIndex < rightEnd; ++curIndex) {  // go through each column
                nextIndex = curIndex + 1;
                if (emptyCell(curIndex) && !emptyCell(nextIndex)) {
                    gameState[curIndex] = gameState[nextIndex];
                    gameState[nextIndex] = "";
                } else if (emptyCell[curIndex] && emptyCell(nextIndex)) {
                    continue;
                }
            }
            console.log("iteration left: " + k); 
            k++;
        }
    }
}


function leadingEmptyCellsFromLeft(leftEnd, rightEnd) {
    // Go through row and see if there are spaces before the first cell that a value
    // Make sure that there are values in the row, otherwise there are no leading empty cells
    let firstFilledCellIndex = -1, curIndex = 0; 
    let empty = false; 
    for (let i = 0; i + leftEnd <= rightEnd; ++i) {  // while the current index is less than or equal to the right wall's index
        curIndex = leftEnd + i;
        if (!emptyCell(curIndex) && curIndex == leftEnd) {  // no leading empty cells if first one is filled
            return false; 
        } else if (!emptyCell(curIndex) && curIndex != leftEnd) {
            // firstFilledCellIndex = leftEnd + i;
            firstFilledCellIndex = curIndex;
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
    let curIndex = 0, nextIndex = 0, value = 0;
    for (let i = 1; i < boardDimension; ++i) {
        curIndex = leftEnd + i - 1;
        nextIndex = leftEnd + i; 
        // Add up the values if the adjacent cells are the same and store them in the index of the current cell
        // and make the other cell blank so you can move the cells over after
        if (sameNumber(curIndex, nextIndex)) {
            value = gameState[curIndex] + gameState[nextIndex];
            score += Number(value);
            console.log("score: " + score);
            // value = gameState[curIndex] * 2;
            gameState[curIndex] = value; 
            gameState[nextIndex] = ""; 
        }   
    }
}

function moveRight() {
    const leftBoundary = [0, 4, 8, 12];
    const rightBoundary = [3, 7, 11, 15];
    for (let i = 0; i < boardDimension; ++i ) {  // go through each row, 0 to 3
        // shift values as far right as they can go (either hits the wall or other cells)
        moveValuesInRowRight(leftBoundary[i], rightBoundary[i]);
        // add the values from right to left if the cells are the same value 
        addValuesInRowRight(rightBoundary[i]);
        // shift the values as far right as they can go again
        moveValuesInRowRight(leftBoundary[i], rightBoundary[i]);
    }

}

function moveValuesInRowRight(leftEnd, rightEnd) {
    let curIndex = 0, lastIndex = 0, k = 0; 
    /// move from left to right
    for (let i = 0; i < boardDimension; ++i) {  // repeat shifting process from the next cell if needed (leading empty cells)
        while (leadingEmptyCellsFromRight(rightEnd - i, leftEnd)) {  // keep shifting cells over while there are leading empty cells
            for (let curIndex = rightEnd - i; curIndex > leftEnd; --curIndex) {  // go through each column
                lastIndex = curIndex - 1;
                if (emptyCell(curIndex) && !emptyCell(lastIndex)) {
                    gameState[curIndex] = gameState[lastIndex];
                    gameState[lastIndex] = "";
                } else if (emptyCell[curIndex] && emptyCell(lastIndex)) {
                    continue;
                }
            }
        }
    }
}

function leadingEmptyCellsFromRight(rightEnd, leftEnd) {
    // Go through row and see if there are spaces before the first cell that a value
    // Make sure that there are values in the row, otherwise there are no leading empty cells
    let firstFilledCellIndex = -1, curIndex = 0; 
    let empty = false; 
    for (let i = rightEnd; i >= leftEnd; --i) {  // while the current index is less than or equal to the right wall's index
        curIndex = i;
        if (!emptyCell(curIndex) && curIndex == rightEnd) {  // no leading empty cells if first one is filled
            return false; 
        } else if (!emptyCell(curIndex) && curIndex != rightEnd) {
            firstFilledCellIndex = curIndex;
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

function addValuesInRowRight(rightEnd) {
    let curIndex = 0, lastIndex = 0, value = 0;
    for (let i = 1; i < boardDimension; ++i) {
        curIndex = rightEnd - i + 1;
        lastIndex = rightEnd - i; 
        // Add up the values if the adjacent cells are the same and store them in the index of the current cell
        // and make the other cell blank so you can move the cells over after
        if (sameNumber(curIndex, lastIndex)) {
            value = gameState[curIndex] + gameState[lastIndex];
            score += Number(value);
            // value = gameState[curIndex] * 2;
            gameState[curIndex] = value; 
            gameState[lastIndex] = ""; 
        } 
    }
}

function moveUp() {
    const upBoundary = [0, 1, 2, 3];
    const downBoundary = [12, 13, 14, 15];
    for (let i = 0; i < boardDimension; ++i ) {  // go through each row, 0 to 3
        // shift values as far right as they can go (either hits the wall or other cells)
        moveValuesInRowUp(upBoundary[i], downBoundary[i]);
        // add the values from right to left if the cells are the same value 
        addValuesInRowUp(downBoundary[i], upBoundary[i]);
        // shift the values as far right as they can go again
        moveValuesInRowUp(upBoundary[i], downBoundary[i]);
    }
}

function moveValuesInRowUp(upEnd, downEnd) {
    let nextIndex = 0; 
    for (let i = 0; i < downEnd; i += 4) {  // repeat shifting process from the next cell if needed (leading empty)
        while (leadingEmptyCellsFromTop(upEnd + i, downEnd)) {  // keep shifting cells while there are leading empty cells
            for (let curIndex = upEnd + i; curIndex < downEnd; curIndex += 4) {  // go through each row (cells are 4 indices apart)
                nextIndex = curIndex + 4;
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

function addValuesInRowUp(downEnd, upEnd) {
    let nextIndex = 0, value = 0;
    for (let curIndex = upEnd; curIndex <= downEnd; curIndex += 4) {
        nextIndex = curIndex + 4; 
        // Add up the values if the adjacent cells are the same and store them in the index of the current cell
        // and make the other cell blank so you can move the cells over after
        if (sameNumber(curIndex, nextIndex)) {
            value = gameState[curIndex] + gameState[nextIndex];
            score += Number(value);
            // value = gameState[curIndex] * 2;
            gameState[curIndex] = value; 
            gameState[nextIndex] = ""; 
        }   
    }
}

function leadingEmptyCellsFromTop(upEnd, downEnd) {
    // Go through column and see if there are spaces before the first cell that a value
    // Make sure that there are values in the column, otherwise there are no leading empty cells
    let firstFilledCellIndex = -1; 
    let empty = false; 
    for (let curIndex = upEnd; curIndex <= downEnd; curIndex += 4) {  // while the current index is less than or equal to the down wall's index
        if (!emptyCell(curIndex) && curIndex == upEnd) {  // no leading empty cells if first one is filled
            return false; 
        } else if (!emptyCell(curIndex) && curIndex != upEnd) {
            firstFilledCellIndex = curIndex;
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

function moveDown() {
    const upBoundary = [0, 1, 2, 3];
    const downBoundary = [12, 13, 14, 15];
    for (let i = 0; i < boardDimension; ++i ) {  // go through each row, 0 to 3
        // shift values as far right as they can go (either hits the wall or other cells)
        moveValuesInRowDown(upBoundary[i], downBoundary[i]);
        // add the values from right to left if the cells are the same value 
        addValuesInRowDown(downBoundary[i], upBoundary[i]);
        // shift the values as far right as they can go again
        moveValuesInRowDown(upBoundary[i], downBoundary[i]);
    }
}

function moveValuesInRowDown(upEnd, downEnd) {
    let nextIndex = 0;
    // start from the bottom and shift values down from one above one at a time
    for (let i = 0; i < downEnd; i += 4) {  // repeat shifting process from the next cell if needed (leading empty)
        while (leadingEmptyCellsFromBottom(upEnd, downEnd - i)) {  // keep shifting cells while there are leading empty cells
            for (let curIndex = downEnd - i; curIndex > upEnd; curIndex -= 4) {  // go through each row (cells are 4 indices apart)
                nextIndex = curIndex - 4;
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

function leadingEmptyCellsFromBottom(upEnd, downEnd) {
    // Go through row and see if there are spaces before the first cell that a value
    // Make sure that there are values in the row, otherwise there are no leading empty cells
    let firstFilledCellIndex = -1; 
    let empty = false; 
    for (let curIndex = downEnd; curIndex >= upEnd; curIndex -= 4) {  // while the current index is less than or equal to the down wall's index
        if (!emptyCell(curIndex) && curIndex == downEnd) {  // no leading empty cells if first one is filled
            return false; 
        } else if (!emptyCell(curIndex) && curIndex != downEnd) {
            firstFilledCellIndex = curIndex;
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

function addValuesInRowDown(downEnd, upEnd) {
    let nextIndex = 0, value = 0;
    for (let curIndex = downEnd; curIndex >= upEnd; curIndex -= 4) {
        nextIndex = curIndex - 4; 
        // Add up the values if the adjacent cells are the same and store them in the index of the current cell
        // and make the other cell blank so you can move the cells over after
        if (sameNumber(curIndex, nextIndex)) {
            value = gameState[curIndex] + gameState[nextIndex];
            score += Number(value);
            // value = gameState[curIndex] * 2;
            gameState[curIndex] = value; 
            gameState[nextIndex] = ""; 
        }   
    }
}