const cells = document.querySelectorAll('.cell')
let gameActive = false;
let gameState = ["", "", "", "",
                 "", "", "", "", 
                 "", "", "", "", 
                 "", "", "", ""];
const boardDimension = 4;
let score = 0;
let attemptingMove = false;

// Event listeners to handle the start of game and keyboard interaction
document.addEventListener("DOMContentLoaded", () => {
    playGame();
    // document.getElementById("board").addEventListener("keydown", handleKeydown);
    document.addEventListener("keydown", handleKeydown);
    document.getElementById('restartButton').addEventListener("click", playGame);
});

function playGame() {
    // Set all the values for a new game
    gameActive = true;
    gameState = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    score = 0;
    attemptingMove = false;
    cells.forEach(cell => {
        cell.innerHTML = "";  // Reset value in cell 
        cell.className = "cell";  // Reset classes
    })
    // Set the score on the webpage
    document.getElementById("score-value").innerHTML = score;
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
        while (!emptyCell(index, gameState)) {
            index = Math.floor(Math.random() * 16);
        }
        gameState[index] = num;
        pickedCell = cells[index];
        pickedCell.innerHTML = num; 
        updateCellColor(pickedCell, num);
    }
}

function emptyCell(index, grid) {
    return grid[index] == '';
}

function handleKeydown(keyboardEvent) {
    const direction = keyboardEvent.key;
    let validMove = false;
    // const clickedCellIndex = parseInt(pressedKey.getAttribute("data-cell-index"));
    if (gameActive && validDirection(direction)) {
        keyboardEvent.preventDefault();  // prevents pressing the arrow keys from scrolling the page
        // document.getElementById('results').innerText += " " + keyboardEvent.key;
        validMove = handleArrowKey(direction);
        updateGameStatus();  // updates score and checks if the game is over (won or filled board)
        if (validMove) {
            placeNumber();  // place another random number at a random empty cell
        }
        isGameActive();
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
       of motion combine.
       Check if the move is valid, meaning that there are tiles that can move in 
       the chosen direction.  */
    //    const gameStateBeforeMove = gameState;
    const gameStateBeforeMove = gameState.slice();
    let attemptMoveGameState = gameState.slice();
    let succesfulAttempt = false; 
    if (key === "ArrowLeft") {
        if (attemptMove("left", attemptMoveGameState, gameStateBeforeMove)) {
            moveLeft(gameState); 
            return true;
        }
    } else if (key === "ArrowRight") {
        if (attemptMove("right", attemptMoveGameState, gameStateBeforeMove)) {
            moveRight(gameState);
            return true;
        }
    } else if (key === "ArrowUp") {
        if (attemptMove("up", attemptMoveGameState, gameStateBeforeMove)) {
            moveUp(gameState);
            return true;
        }
    } else {  // key is ArrowDown
        if (attemptMove("down", attemptMoveGameState, gameStateBeforeMove)) {
            moveDown(gameState);
            return true; 
        }
    }
    return false; 
}

function attemptMove(direction, attemptGrid, gameStateBeforeMove) {
    attemptingMove = true; 
    if (direction === "left") {
        moveLeft(attemptGrid);
    } else if (direction === "right") {
        moveRight(attemptGrid);
    } else if (direction === "up") {
        moveUp(attemptGrid);
    } else {
        moveDown(attemptGrid);
    }
    attemptingMove = false;
    if (moveIsValid(attemptGrid, gameStateBeforeMove)) {
        return true; 
    }
    return false; 
}

function moveIsValid(attemptMoveGameState, gameStateBeforeMove) {
    /* if the game state does not change after carrying out the move, then the 
       move was not valid because none of the tiles changed, so a new number 
       should not be placed */
    for (let i = 0; i < gameStateBeforeMove.length; ++i) {
        if (attemptMoveGameState[i] != gameStateBeforeMove[i]) {
            return true;
        }
    }
    /* Gone through all the elements and they are the same, move is not valid 
       because it does not change anything on the board */
    return false; 
}

function sameNumber(i, j, grid) {
    return grid[i] === grid[j];
}

function updateGameStatus() {
    // Update the board on the webpage and change the color of the cell for each number
    for (let i = 0; i < gameState.length; ++i) {
        cells[i].innerHTML = gameState[i];
        updateCellColor(cells[i], gameState[i]);
    }
    // Update the score on the webpage
    document.getElementById("score-value").innerHTML = score;
}

function updateCellColor(cell, value) {
    removeColorClasses(cell);  // remove any existing colors
    if (value != "") {
        cell.classList.add("val-" + value);  // change the color for each number
    }
}

function removeColorClasses(cell) {
    for (let i = 0; i < cell.classList.length; ++i) {
        if (cell.classList[i] != "cell") {
            cell.classList.remove(cell.classList[i]);
        }
    }
}

function isGameActive() {
    if (gameWon() || gameIsOver()) {
        gameActive = false; 
        document.getElementById("results").innerHTML += " Game over.";
    }
}

function gameWon() {
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

function gameIsOver() {
    if (boardFull() && noValidMoves()) {
        return true;
    }
    return false;
    // return board_full();
}

function boardFull() {
    // go through all the cells andc check if they are empty, if true, then board is not empty
    for (let i = 0; i < cells.length; ++i) {
        if (cells[i].innerHTML === "") {
            return false; 
        }
    }
    return true; 
}

function noValidMoves() {
    // Try to do all the moves
    let attemptLeft = gameState.slice(), attemptRight = gameState.slice(), 
        attemptUp = gameState.slice(), attemptDown = gameState.slice(); 
        moveLeft(attemptLeft);
        moveRight(attemptRight);
        moveUp(attemptUp);
        moveDown(attemptDown);
    // If none of the moves are valid, there are no valid moves
    if (!moveIsValid(attemptLeft, gameState) && !moveIsValid(attemptRight, gameState) &&
        !moveIsValid(attemptUp, gameState) && !moveIsValid(attemptDown, gameState)) {
        return true; 
    }
    return false; 
}

function moveLeft(grid) {
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
        moveValuesInRowLeft(leftBoundary[i], rightBoundary[i], grid);
        // add the values from left to right if the cells are the same value 
        addValuesInRowLeft(leftBoundary[i], grid);
        // shift the values as far left as they can go again
        moveValuesInRowLeft(leftBoundary[i], rightBoundary[i], grid);
    }
}

function moveValuesInRowLeft(leftEnd, rightEnd, grid) {
    let nextIndex = 0; 
    for (let i = 0; i < boardDimension; ++i) {  // iterates shifting process through each cell to get rid of leading empty cells
        while (leadingEmptyCellsFromLeft(leftEnd + i, rightEnd, grid)) {  // keep shifting cells over while there are leading empty cells
            for (let curIndex = leftEnd + i; curIndex < rightEnd; ++curIndex) {  // go through each column
                nextIndex = curIndex + 1;
                if (emptyCell(curIndex, grid) && !emptyCell(nextIndex, grid)) {
                    grid[curIndex] = grid[nextIndex];
                    grid[nextIndex] = "";
                }
            }
        }
    }
}


function leadingEmptyCellsFromLeft(leftEnd, rightEnd, grid) {
    // Go through row and see if there are spaces before the first cell that a value
    // Make sure that there are values in the row, otherwise there are no leading empty cells
    let firstFilledCellIndex = -1, curIndex = 0; 
    let empty = false; 
    for (let i = 0; i + leftEnd <= rightEnd; ++i) {  // while the current index is less than or equal to the right wall's index
        curIndex = leftEnd + i;
        if (!emptyCell(curIndex, grid) && curIndex == leftEnd) {  // no leading empty cells if first one is filled
            return false; 
        } else if (!emptyCell(curIndex, grid) && curIndex != leftEnd) {
            // firstFilledCellIndex = leftEnd + i;
            firstFilledCellIndex = curIndex;
        } else if (emptyCell(curIndex, grid)) {  // if empty cell is encountered, at least one leading empty cell
            empty = true;
        }
    }
    if (empty && firstFilledCellIndex != -1) {
        return true;
    } else {  // row was empty so there are no leading empty cells 
        return false;
    }
}

function addValuesInRowLeft(leftEnd, grid) {
    let curIndex = 0, nextIndex = 0, value = 0;
    for (let i = 1; i < boardDimension; ++i) {
        curIndex = leftEnd + i - 1;
        nextIndex = leftEnd + i; 
        // Add up the values if the adjacent cells are the same and store them in the index of the current cell
        // and make the other cell blank so you can move the cells over after
        if (sameNumber(curIndex, nextIndex, grid)) {
            value = grid[curIndex] + grid[nextIndex];
            if (!attemptingMove) {
                score += Number(value);
            }
            grid[curIndex] = value; 
            grid[nextIndex] = ""; 
        }   
    }
}

function moveRight(grid) {
    const leftBoundary = [0, 4, 8, 12];
    const rightBoundary = [3, 7, 11, 15];
    for (let i = 0; i < boardDimension; ++i ) {  // go through each row, 0 to 3
        // shift values as far right as they can go (either hits the wall or other cells)
        moveValuesInRowRight(leftBoundary[i], rightBoundary[i], grid);
        // add the values from right to left if the cells are the same value 
        addValuesInRowRight(rightBoundary[i], grid);
        // shift the values as far right as they can go again
        moveValuesInRowRight(leftBoundary[i], rightBoundary[i], grid);
    }

}

function moveValuesInRowRight(leftEnd, rightEnd, grid) {
    let curIndex = 0, lastIndex = 0, k = 0; 
    /// move from left to right
    for (let i = 0; i < boardDimension; ++i) {  // repeat shifting process from the next cell if needed (leading empty cells)
        while (leadingEmptyCellsFromRight(rightEnd - i, leftEnd, grid)) {  // keep shifting cells over while there are leading empty cells
            for (let curIndex = rightEnd - i; curIndex > leftEnd; --curIndex) {  // go through each column
                lastIndex = curIndex - 1;
                if (emptyCell(curIndex, grid) && !emptyCell(lastIndex, grid)) {
                    grid[curIndex] = grid[lastIndex];
                    grid[lastIndex] = "";
                }
            }
        }
    }
}

function leadingEmptyCellsFromRight(rightEnd, leftEnd, grid) {
    // Go through row and see if there are spaces before the first cell that a value
    // Make sure that there are values in the row, otherwise there are no leading empty cells
    let firstFilledCellIndex = -1, curIndex = 0; 
    let empty = false; 
    for (let i = rightEnd; i >= leftEnd; --i) {  // while the current index is less than or equal to the right wall's index
        curIndex = i;
        if (!emptyCell(curIndex, grid) && curIndex == rightEnd) {  // no leading empty cells if first one is filled
            return false; 
        } else if (!emptyCell(curIndex, grid) && curIndex != rightEnd) {
            firstFilledCellIndex = curIndex;
        } else if (emptyCell(curIndex, grid)) {  // if empty cell is encountered, at least one leading empty cell
            empty = true;
        }
    }
    if (empty && firstFilledCellIndex != -1) {
        return true;
    } else {  // row was empty so there are no leading empty cells 
        return false;
    }
}

function addValuesInRowRight(rightEnd, grid) {
    let curIndex = 0, lastIndex = 0, value = 0;
    for (let i = 1; i < boardDimension; ++i) {
        curIndex = rightEnd - i + 1;
        lastIndex = rightEnd - i; 
        // Add up the values if the adjacent cells are the same and store them in the index of the current cell
        // and make the other cell blank so you can move the cells over after
        if (sameNumber(curIndex, lastIndex, grid)) {
            value = grid[curIndex] + grid[lastIndex];
            if (!attemptingMove) {
                score += Number(value);
            }
            grid[curIndex] = value; 
            grid[lastIndex] = ""; 
        } 
    }
}

function moveUp(grid) {
    const upBoundary = [0, 1, 2, 3];
    const downBoundary = [12, 13, 14, 15];
    for (let i = 0; i < boardDimension; ++i ) {  // go through each row, 0 to 3
        // shift values as far right as they can go (either hits the wall or other cells)
        moveValuesInRowUp(upBoundary[i], downBoundary[i], grid);
        // add the values from right to left if the cells are the same value 
        addValuesInRowUp(downBoundary[i], upBoundary[i], grid);
        // shift the values as far right as they can go again
        moveValuesInRowUp(upBoundary[i], downBoundary[i], grid);
    }
}

function moveValuesInRowUp(upEnd, downEnd, grid) {
    let nextIndex = 0; 
    for (let i = 0; i < downEnd; i += 4) {  // repeat shifting process from the next cell if needed (leading empty)
        while (leadingEmptyCellsFromTop(upEnd + i, downEnd, grid)) {  // keep shifting cells while there are leading empty cells
            for (let curIndex = upEnd + i; curIndex < downEnd; curIndex += 4) {  // go through each row (cells are 4 indices apart)
                nextIndex = curIndex + 4;
                if (emptyCell(curIndex, grid) && !emptyCell(nextIndex, grid)) {
                    grid[curIndex] = grid[nextIndex];
                    grid[nextIndex] = "";
                }
            }
        }
    }
}

function addValuesInRowUp(downEnd, upEnd, grid) {
    let nextIndex = 0, value = 0;
    for (let curIndex = upEnd; curIndex <= downEnd; curIndex += 4) {
        nextIndex = curIndex + 4; 
        // Add up the values if the adjacent cells are the same and store them in the index of the current cell
        // and make the other cell blank so you can move the cells over after
        if (sameNumber(curIndex, nextIndex, grid)) {
            value = grid[curIndex] + grid[nextIndex];
            if (!attemptingMove) {
                score += Number(value);
            }
            grid[curIndex] = value; 
            grid[nextIndex] = ""; 
        }   
    }
}

function leadingEmptyCellsFromTop(upEnd, downEnd, grid) {
    // Go through column and see if there are spaces before the first cell that a value
    // Make sure that there are values in the column, otherwise there are no leading empty cells
    let firstFilledCellIndex = -1; 
    let empty = false; 
    for (let curIndex = upEnd; curIndex <= downEnd; curIndex += 4) {  // while the current index is less than or equal to the down wall's index
        if (!emptyCell(curIndex, grid) && curIndex == upEnd) {  // no leading empty cells if first one is filled
            return false; 
        } else if (!emptyCell(curIndex, grid) && curIndex != upEnd) {
            firstFilledCellIndex = curIndex;
        } else if (emptyCell(curIndex, grid)) {  // if empty cell is encountered, at least one leading empty cell
            empty = true;
        }
    }
    if (empty && firstFilledCellIndex != -1) {
        return true;
    } else {  // row was empty so there are no leading empty cells 
        return false;
    }
}

function moveDown(grid) {
    const upBoundary = [0, 1, 2, 3];
    const downBoundary = [12, 13, 14, 15];
    for (let i = 0; i < boardDimension; ++i ) {  // go through each row, 0 to 3
        // shift values as far right as they can go (either hits the wall or other cells)
        moveValuesInRowDown(upBoundary[i], downBoundary[i], grid);
        // add the values from right to left if the cells are the same value 
        addValuesInRowDown(downBoundary[i], upBoundary[i], grid);
        // shift the values as far right as they can go again
        moveValuesInRowDown(upBoundary[i], downBoundary[i], grid);
    }
}

function moveValuesInRowDown(upEnd, downEnd, grid) {
    let nextIndex = 0;
    // start from the bottom and shift values down from one above one at a time
    for (let i = 0; i < downEnd; i += 4) {  // repeat shifting process from the next cell if needed (leading empty)
        while (leadingEmptyCellsFromBottom(upEnd, downEnd - i, grid)) {  // keep shifting cells while there are leading empty cells
            for (let curIndex = downEnd - i; curIndex > upEnd; curIndex -= 4) {  // go through each row (cells are 4 indices apart)
                nextIndex = curIndex - 4;
                if (emptyCell(curIndex, grid) && !emptyCell(nextIndex, grid)) {
                    grid[curIndex] = grid[nextIndex];
                    grid[nextIndex] = "";
                }
            }
        }
    }
}

function leadingEmptyCellsFromBottom(upEnd, downEnd, grid) {
    // Go through row and see if there are spaces before the first cell that a value
    // Make sure that there are values in the row, otherwise there are no leading empty cells
    let firstFilledCellIndex = -1; 
    let empty = false; 
    for (let curIndex = downEnd; curIndex >= upEnd; curIndex -= 4) {  // while the current index is less than or equal to the down wall's index
        if (!emptyCell(curIndex, grid) && curIndex == downEnd) {  // no leading empty cells if first one is filled
            return false; 
        } else if (!emptyCell(curIndex, grid) && curIndex != downEnd) {
            firstFilledCellIndex = curIndex;
        } else if (emptyCell(curIndex, grid)) {  // if empty cell is encountered, at least one leading empty cell
            empty = true;
        }
    }
    if (empty && firstFilledCellIndex != -1) {
        return true;
    } else {  // row was empty so there are no leading empty cells 
        return false;
    }
}

function addValuesInRowDown(downEnd, upEnd, grid) {
    let nextIndex = 0, value = 0;
    for (let curIndex = downEnd; curIndex >= upEnd; curIndex -= 4) {
        nextIndex = curIndex - 4; 
        // Add up the values if the adjacent cells are the same and store them in the index of the current cell
        // and make the other cell blank so you can move the cells over after
        if (sameNumber(curIndex, nextIndex, grid)) {
            value = grid[curIndex] + grid[nextIndex];
            if (!attemptingMove) {
                score += Number(value);
            }
            // value = gameState[curIndex] * 2;
            grid[curIndex] = value; 
            grid[nextIndex] = ""; 
        }   
    }
}