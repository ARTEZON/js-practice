const taskButton      = document.querySelector('#task-11-button');
const rowsInput       = document.querySelector('#rows');
const colsInput       = document.querySelector('#cols');
const minesInput      = document.querySelector('#mines');
const startButton     = document.querySelector('#start-game');
const closeButton     = document.querySelector('#close-game');
const minesweeper     = document.querySelector('#minesweeper');
const minesCountText  = document.querySelector('#mines-count');
const gameTimeText    = document.querySelector('#game-time-text');
const gameTimeCounter = document.querySelector('#game-time-counter');
const boardElement    = document.querySelector('#board');

const tileStatus = {
    HIDDEN: 'hidden',
    MISTAKE: 'mistake',
    NUMBER: 'number',
    FLAGGED: 'flagged'
}

let board;
let rows;
let cols;
let minesCount;
let flagsLeft;
let elapsedTime;
let gameRunning;
let win;
let lose;
let timeInterval;

startButton.addEventListener('click', loadGame);
closeButton.addEventListener('click', () => {
    if (gameRunning && !confirm('Остановить игру? Ваш прогресс будет утерян!')) return;
    gameRunning = false;
    board = null;
    minesweeper.classList.remove('playing');
    closeButton.classList.remove('playing');
    startButton.textContent = 'Играть';
});
taskButton.addEventListener('click', () => {
    if (taskButton.nextElementSibling.hasAttribute('show'))
        window.addEventListener('resize', () => resizeBoard());
    else
        window.removeEventListener('resize', () => resizeBoard());
});
window.onbeforeunload = () => { if (gameRunning) return false; }

function loadGame() {
    if (parseInt(minesInput.value) > parseInt(rowsInput.value) * parseInt(colsInput.value)) {
        alert('Количество мин не может быть больше числа ячеек.');
        return;
    }
    if (gameRunning && !confirm('Игра уже начата. При перезапуске игры прогресс будет утерян. Продолжить?')) {
        return;
    }
    clearInterval(timeInterval);
    minesweeper.classList.add('fadein');
    minesweeper.classList.add('playing');
    closeButton.classList.add('playing');
    startButton.textContent = 'Перезапустить игру';
    setTimeout(createBoard, 250);
}

function createBoard() {
    board = [];
    boardElement.textContent = '';
    rows = parseInt(rowsInput.value);
    boardElement.style.setProperty('--rows', String(rows));
    cols = parseInt(colsInput.value);
    boardElement.style.setProperty('--cols', String(cols));
    minesCount = parseInt(minesInput.value);
    flagsLeft = minesCount;
    minesCountText.innerText = 'Осталось флажков: ' + flagsLeft;
    gameTimeText.textContent = 'Нажмите на любую клетку, чтобы начать игру';
    gameTimeCounter.textContent = '';
    resizeBoard();
    gameRunning = false;
    win = false;
    lose = false;

    for (let x = 0; x < cols; x++) {
        const col = [];
        for (let y = 0; y < rows; y++) {
            const element = document.createElement("div");
            element.dataset.status = tileStatus.HIDDEN;
            element.id=`cell-${x}-${y}`;
            element.setAttribute('x', String(x));
            element.setAttribute('y', String(y));
            element.classList.add('minesweeper-cell');
            boardElement.append(element);
            const tile = {
                element, x, y, mine: false,
                get status() { return this.element.dataset.status },
                set status(value) { this.element.dataset.status = value }
            }
            col.push(tile);
        }
        board.push(col);
    }

    minesweeper.classList.remove('fadein');
    boardElement.onclick = startGame;
    boardElement.oncontextmenu = () => false;
}

function startGame(event) {
    gameRunning = true;
    boardElement.onclick = (e) => {
        const element = e.target;
        if (element.classList.contains('minesweeper-cell'))
            revealTile(board[element.getAttribute('x')][element.getAttribute('y')]);
    }
    boardElement.oncontextmenu = (e) => {
        const element = e.target;
        if (element.classList.contains('minesweeper-cell'))
            flagTile(board[element.getAttribute('x')][element.getAttribute('y')], e);
    }

    const start = event.target;
    setMines(board[start.getAttribute('x')][start.getAttribute('y')]);

    elapsedTime = 0;
    timeInterval = setInterval(timeCount, 1000);
    gameTimeText.textContent = 'Прошло времени: ';
    gameTimeCounter.textContent = formatCounter(elapsedTime);
    revealTile(board[start.getAttribute('x')][start.getAttribute('y')]);
}

function setMines(start = null) {
    const totalTiles = rows * cols;
    const candidateTiles = [];
    for (let i = 0; i < totalTiles; i++)
        candidateTiles.push(i);
    shuffle(candidateTiles);

    if (start !== null) {
        generateIsland(start, candidateTiles, Math.min(5, Math.floor(Math.max(rows, cols) / 5)));
        moveToEnd(candidateTiles, candidateTiles.indexOf(start.x * rows + start.y));
    }

    let n, x, y;
    for (let mine = 0; mine < minesCount; mine++) {
        n = candidateTiles[mine];
        x = Math.floor(n / rows);
        y = n % rows;
        board[x][y].mine = true;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function moveToEnd(array, index) {
    array.push(array.splice(index, 1)[0]);
}

function generateIsland(tile, array, maxDistance, currentDistance = 1) {
    if (currentDistance > maxDistance) return;
    nearbyTiles(tile).forEach(adjacentTile => {
        generateIsland(adjacentTile, array, maxDistance, currentDistance + 1);
        if (weightedRandomBoolean(100 - (currentDistance - 2) * 20))
            moveToEnd(array, array.indexOf(adjacentTile.x * rows + adjacentTile.y));
    });
}

function weightedRandomBoolean(percentageOfTrue) {
    return Math.random() * 100 < percentageOfTrue;
}

function revealTile(tile) {
    tile.element.style.color = `unset`;
    if (tile.status === tileStatus.FLAGGED) {
        return;
    }
    if (tile.mine) {
        tile.status = tileStatus.MISTAKE;
        lose = true;
    }
    else {
        tile.status = tileStatus.NUMBER;
        const adjacentTiles = nearbyTiles(tile);
        const mines = adjacentTiles.filter(t => t.mine);
        if (!mines.length)
            for (let t in adjacentTiles)
                revealTile(adjacentTiles[t]);
        else {
            tile.element.textContent = String(mines.length);
            tile.element.style.color = `var(--color-${mines.length})`;
        }
    }
    checkGameEnd();
}

function nearbyTiles(tile) {
    const tiles = [];
    const x = tile.x;
    const y = tile.y;

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            if (xOffset !== 0 || yOffset !== 0) {
                const tile = getTile(x + xOffset, y + yOffset);
                if (tile && (tile.status === tileStatus.HIDDEN || tile.status === tileStatus.FLAGGED))
                    tiles.push(tile);
            }
        }
    }

    return tiles
}

function getTile(x, y) {
    if (x < 0 || x >= cols || y < 0 || y >= rows) return null;
    return board[x][y];
}

function flagTile(tile, e) {
    e.preventDefault();
    if (tile.status === tileStatus.HIDDEN) {
        tile.status = tileStatus.FLAGGED;
        tile.element.textContent = '🚩';
        flagsLeft--;
    }
    else if (tile.status === tileStatus.FLAGGED) {
        tile.status = tileStatus.HIDDEN;
        tile.element.textContent = '';
        flagsLeft++;
    }

    if (flagsLeft >= 0)
        minesCountText.textContent = 'Осталось флажков: ' + flagsLeft;
    else
        minesCountText.innerHTML = 'Осталось флажков: ' + '<span class="counter-red">' + flagsLeft + '</span>';
}

function minesweeper_cheat_showmines(bool) {
    if (bool) board.forEach(row => { row.forEach(tile => { if (tile.mine && tile.status !== tileStatus.MISTAKE) tile.element.textContent = 'M'; }); })
    else board.forEach(row => { row.forEach(tile => { if (tile.mine && tile.status !== tileStatus.MISTAKE) tile.element.textContent = ''; }); })
    return bool;
}

function timeCount() {
    if (!gameRunning) {
        clearInterval(timeInterval);
        return;
    }
    elapsedTime++;
    gameTimeCounter.textContent = formatCounter(elapsedTime);
}

function formatCounter() {
    const seconds = String(elapsedTime % 60);
    const minutes = String(Math.floor(elapsedTime / 60));
    return minutes + ':' + (seconds.length < 2 ? '0' + seconds : seconds);
}

function resizeBoard(scale=undefined) {
    if (board) {
        if (!scale) {
            boardElement.style.setProperty('--scale', '1');
            scale = Math.min(1, (boardElement.parentElement.clientWidth - 30) / boardElement.clientWidth);
        }
        boardElement.style.setProperty('--scale', String(scale));
    }
}

function checkGameEnd() {
    win = checkWin();

    if (win || lose) {
        gameRunning = false;
        boardElement.onclick = null;
        boardElement.oncontextmenu = () => false;
        startButton.textContent = 'Играть снова';

        if (win)
            minesCountText.textContent = 'Вы выиграли!';
        else if (lose) {
            minesCountText.textContent = 'Упс :(';
            revealMines();
        }
    }
}

function checkWin() {
    return board.every(row => {
        return row.every(tile => {
            return (
                tile.status === tileStatus.NUMBER ||
                (tile.mine &&
                    (tile.status === tileStatus.HIDDEN ||
                        tile.status === tileStatus.FLAGGED))
            )
        })
    })
}

function revealMines() {
    board.forEach(row => {
        row.forEach(tile => {
            if (tile.mine && tile.status !== tileStatus.FLAGGED) {
                tile.element.textContent = '💣';
                tile.status = tileStatus.MISTAKE;
            }
            else if (!tile.mine && tile.status === tileStatus.FLAGGED) {
                tile.status = tileStatus.MISTAKE;
            }
        })
    })
}