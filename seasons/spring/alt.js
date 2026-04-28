
const grid = document.getElementById("grid");
const size = 16;

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
function getRandom(object) {
    const keys = Object.keys(object);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return object[randomKey];
}

const matrix = [];

for (let r = 0; r < size; r++) {
    matrix[r] = [];
    for (let c = 0; c < size; c++) {
        matrix[r][c] = ".";
    }
}

let areaNum = 0;

function biasedRand(max) {
    return Math.floor(Math.random() * Math.random() * max) + 1;
}

while (true) {
    let startRow = -1;
    let startCol = -1;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r][c] === "." && startRow === -1) {
                startRow = r;
                startCol = c;
            }
        }
    }
    if (startRow === -1) {
        break;
    }

    const areaName = "a" + areaNum;
    areaNum++;

    let maxWidth = size - startCol;
    let maxHeight = size - startRow;

    let width = biasedRand(maxWidth);
    let height = biasedRand(maxHeight);

    for (let c = startCol; c < startCol + width; c++) {
        if (matrix[startRow][c] !== ".") {
            width = c - startCol;
            break; // shrinks width if occupied
        }
    }

    for (let r = startRow; r < startRow + height; r++) {
        for (let c = startCol; c < startCol + width; c++) {
            if (matrix[r][c] !== ".") {
                height = r - startRow;
                break; // shrinks height
            }
        }
    }

    if (width < 1) width = 1;
    if (height < 1) height = 1;

    // fills rectangle with area name
    for (let r = startRow; r < startRow + height; r++) {
        for (let c = startCol; c < startCol + width; c++) {
            matrix[r][c] = areaName;
        }
    }
}

// convert matrix to grid-template-areas text
const templateAreas = matrix
    .map(row => `"${row.join(" ")}"`)
    .join("\n");

grid.style.gridTemplateAreas = templateAreas;

// creates one div per area
for (let i = 0; i < areaNum; i++) {
    const rect = document.createElement("div");
    rect.classList.add("rect");

    rect.style.gridArea = "a" + i;
    rect.style.borderRadius = getRandom(shapes);

    grid.appendChild(rect);
}

changeBorders();

function changeBorders() {
    const rects = document.querySelectorAll(".rect");

    rects.forEach(rect => {
        rect.style.borderRadius = getRandom(shapes);
    });

}

setInterval(changeBorders, 5000);

console.log(templateAreas);