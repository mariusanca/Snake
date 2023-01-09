let matrix = [];
for (let lineIndex = 0; lineIndex <= 21; ++lineIndex) {
    matrix.push([lineIndex], []);
    for(let columnIndex = 0; columnIndex <= 21; ++columnIndex) {
        matrix[lineIndex][columnIndex] = 0; 
    }
}
matrix[9][10] = 1;
matrix[10][10] = 2;
let direction = "UP";
let snakeSize = 2;
let gameSpeedLevel = 1;
let myInterval;
let gameSpeed = 500;
let gameOver = false;
let headLine = 9, headColumn = 10, lastHeadLine, lastHeadColumn, lastTailLine, lastTailColumn;

document.addEventListener('keydown', function(event) { //control the snake using the keyboard arrows
    if(event.keyCode == 38 && direction != "DOWN") {
        direction = "UP";
    } else if(event.keyCode == 37 && direction != "RIGHT") {
        direction = "LEFT";
    } else if(event.keyCode == 39 && direction != "LEFT") {
        direction = "RIGHT";
    } else if(event.keyCode == 40 && direction != "UP") {
        direction = "DOWN";
    }
});

function changeDirection(buttonDirection) { //control the snake using the buttons from the screen
    if(buttonDirection == "UP" && direction != "DOWN") {
        direction = "UP";
    } else if(buttonDirection == "LEFT" && direction != "RIGHT") {
        direction = "LEFT";
    } else if(buttonDirection == "RIGHT" && direction != "LEFT") {
        direction = "RIGHT";
    } else if(buttonDirection == "DOWN" && direction != "UP") {
        direction = "DOWN";
    }
}

function snakeEat() { //when the snake find an apple he is growing in size and another apple is placed on the board
    let audio = new Audio('Sounds/Apple-bite.mp3');
    audio.play();
    ++snakeSize;
    placeFood();
    matrix[lastTailLine][lastTailColumn] = snakeSize;
    if (snakeSize % 4 == 0) {
        gameSpeed /= 1.5;
        clearInterval(myInterval);
        myInterval = setInterval(moveSnake, gameSpeed);
        ++gameSpeedLevel;
    }
    displayScore();
}

function endGame() { //when the snake crashes the game is ending
    clearInterval(myInterval);
    gameOver = true;
    document.getElementById('snake-frame').innerHTML = `<div id="snake-frame"><img src="Pictures/gameOver.JPG" id="game-over">
    <h1 id="points">You scored ${snakeSize} points!</h1>
    </div>
    `;
    document.getElementById('restart-button').innerHTML =`<button type="button" id="restart" class="btn btn-success"    onclick="restart()">Restart Game</button>`;
    document.getElementById('score').style.display = "none";
    let audio = new Audio('Sounds/Lost-life-sound-effect.mp3');
    audio.play();
}

function moveTail() { //move the tail of the snake following the head
    let newLineIndex = lastHeadLine;
    let newColumnIndex = lastHeadColumn;
    for (let moves = 2; moves <= snakeSize; ++moves) {
        let oldLineIndex, oldColumnIndex;
        for (let lineIndex = newLineIndex - 1; lineIndex <= newLineIndex + 1; ++lineIndex) {
            for(let columnIndex = newColumnIndex - 1; columnIndex <= newColumnIndex + 1; ++columnIndex) {
                if (matrix[lineIndex][columnIndex] == moves) {
                    oldLineIndex = lineIndex;
                    oldColumnIndex = columnIndex;
                }
            }
        }
        matrix[newLineIndex][newColumnIndex] = moves;
        newLineIndex = oldLineIndex;
        newColumnIndex = oldColumnIndex;
        if (moves == snakeSize) { //delete the last point of the tail
            matrix[oldLineIndex][oldColumnIndex] = 0;
            lastTailLine = oldLineIndex;
            lastTailColumn = oldColumnIndex;
        }
    }
}

function moveHead(oxParameter, oyParameter, sign, oxDirection, oyDirection) { //move the head of the snake
    matrix[oxParameter][oyParameter] = 0;
    if (sign == "+") {
        matrix[oxParameter + oxDirection][oyParameter + oyDirection] = 1;
        headLine = oxParameter + oxDirection;
        headColumn = oyParameter + oyDirection;
    } else {
        matrix[oxParameter - oxDirection][oyParameter - oyDirection] = 1;
        headLine = oxParameter - oxDirection;
        headColumn = oyParameter - oyDirection;
    }
    lastHeadLine = oxParameter;
    lastHeadColumn = oyParameter;
}

function checkNextBox (lineIndex, columnIndex) { //check the next movement of the snake, if he eats or he is going to crash
    if (lineIndex < 1 || lineIndex > 20 || columnIndex < 1 || columnIndex > 20) {
        endGame();
        return false;
    } else if (matrix[lineIndex][columnIndex] > 1) {
        endGame();
        return false;
    } else if (matrix[lineIndex][columnIndex] == -1) {
        snakeEat();
        return true;
    }
    return true;
}

function moveSnake() { //move the snake on the game board according to the given direction
    if (direction == "UP" && checkNextBox(headLine - 1, headColumn)) {
        moveHead(headLine, headColumn, "-", 1, 0);
    } else if (direction == "DOWN" && checkNextBox(headLine + 1, headColumn)) {
        moveHead(headLine, headColumn, "+", 1, 0);
    } else if (direction == "LEFT" && checkNextBox(headLine, headColumn - 1)) {
        moveHead(headLine, headColumn, "-", 0, 1);
    } else if (direction == "RIGHT" && checkNextBox(headLine, headColumn + 1)) {
        moveHead(headLine, headColumn, "+", 0, 1);
    }
    if (gameOver == false) {
        moveTail();
        displayMatrix();
    }
}

function displayScore() { //display the score and the speed level on the bottom of the game board
    document.getElementById('score').removeAttribute("hidden");
    document.getElementById('score').innerHTML = `<div id="score"><h4>Score: ${snakeSize}</h4>
    <h4 id="game-speed">Speed Level: ${gameSpeedLevel}</h4></div>`;
}

function displayMatrix() { //display the game board according to the values inside the matrix elements
    document.getElementById('snake-frame').innerHTML = '';
    for (let lineIndex = 1; lineIndex <= 20; ++lineIndex) {
        for(let columnIndex = 1; columnIndex <= 20; ++columnIndex) {
            if (matrix[lineIndex][columnIndex] == 0) {
                document.getElementById('snake-frame').innerHTML += '<div id="empty-box"></div>';
            } else if (matrix[lineIndex][columnIndex] == -1) {
                document.getElementById('snake-frame').innerHTML += '<div id="food-box"><img src="Pictures/Apple.jpg" id="food"</div>';
            } else if (matrix[lineIndex][columnIndex] > 0) {
                document.getElementById('snake-frame').innerHTML += '<div id="snake-box"></div>';
            }
        }
    }
}

function placeFood() {
    let foodLine = Math.floor(Math.random() * 20) + 1;
    let foodColomn = Math.floor(Math.random() * 20) + 1;
    if (matrix[foodLine][foodColomn] >= 1 || matrix[foodLine][foodColomn] == -1) {
        placeFood(); //re-try to place the food because the place is not correct
        return;
    } else {
        matrix[foodLine][foodColomn] = -1;
    }
}

function startGame() { //start the game when the button is pressed
    document.getElementById('game-frame').innerHTML = '<div id="snake-frame"></div>';
    placeFood();
    displayMatrix();
    displayScore();
    myInterval = setInterval(moveSnake, gameSpeed);
}

function restart() {
    window.location.reload(true);
    return false;
}