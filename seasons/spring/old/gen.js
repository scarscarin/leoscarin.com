const grid = document.getElementById("grid");
const gridSize = 16;

const shapes = {
    right: "0 100px 100px 0",
    left: "100px 0 0 100px",
    zeta: "0 100px 0 100px",
    esse: "100px 0 100px 0",
    tl: "100px 0 0 0",
    tr: "0 100px 0 0",
    bl: "0 0 0 100px",
    br: "0 0 100px 0",
    ntl: "0 100px 100px 100px",
    ntr: "100px 0 100px 100px",
    nbl: "100px 100px 100px 0",
    nbr: "100px 100px 0 100px",
    straight: "0 0 0 0",
    round: "100px 100px 100px 100px",
};

const matrix = [];

function makeMatrix(size) {
    const matrix = [];

    for (let row = 0; row < size; row++) {
        matrix[row] = [];

        for (let col = 0; col < size; col++) {
            matrix[row][col] = false;
        }
    }

    return matrix;
}

let occupied = makeMatrix(gridSize);

function getRandom(object) {
    const keys = Object.keys(object);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return object[randomKey];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// find all free cells
function getFreeCells(matrix) {
    const free = [];

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (matrix[row][col] === false) {
                free.push({ row, col });
            }
        }
    }

    return free;
}

function canPlace(matrix, startRow, startCol, width, height) {
    // outside grid?
    if (startCol + width > gridSize) return false;
    if (startRow + height > gridSize) return false;

    // already occupied?
    for (let row = startRow; row < startRow + height; row++) {
        for (let col = startCol; col < startCol + width; col++) {
            if (matrix[row][col] === true) {
                return false;
            }
        }
    }

    return true;
}

function markOccupied(matrix, startRow, startCol, width, height) {
    for (let row = startRow; row < startRow + height; row++) {
        for (let col = startCol; col < startCol + width; col++) {
            matrix[row][col] = true;
        }
    }
}

function createRect(startCol, startRow, width, height, shape) {
    const rect = document.createElement("div");
    rect.classList.add("rect");

    // CSS grid lines start at 1, array indexes start at 0
    rect.style.gridColumnStart = startCol + 1;
    rect.style.gridColumnEnd = startCol + 1 + width;
    rect.style.gridRowStart = startRow + 1;
    rect.style.gridRowEnd = startRow + 1 + height;

    rect.style.borderRadius = shape;

    grid.appendChild(rect);
}

function generateBox() {
    const freeCells = getFreeCells(occupied);

    if (freeCells.length === 0) {
        console.log("grid full");
        return false;
    }

    const start = freeCells[randomInt(0, freeCells.length - 1)];

    // try several random sizes from this starting cell
    for (let attempt = 0; attempt < 50; attempt++) {
        const maxWidth = gridSize - start.col;
        const maxHeight = gridSize - start.row;

        const width = randomInt(1, maxWidth);
        const height = randomInt(1, maxHeight);

        if (canPlace(occupied, start.row, start.col, width, height)) {
            createRect(start.col, start.row, width, height, getRandom(shapes));
            markOccupied(occupied, start.row, start.col, width, height);
            return true;
        }
    }

    // fallback: place a 1x1 if bigger shapes fail
    createRect(start.col, start.row, 1, 1, getRandom(shapes));
    markOccupied(occupied, start.row, start.col, 1, 1);
    return true;
}

function fillGrid() {
    while (generateBox()) {
        // keep generating until there are no free cells
    }
}

fillGrid();

function changeRandomBorder() {
    const rects = document.querySelectorAll(".rect");

    if (rects.length === 0) return;

    const randomRect = rects[Math.floor(Math.random() * rects.length)];
    randomRect.style.borderRadius = getRandom(shapes);
}

setInterval(changeRandomBorder, 1000);