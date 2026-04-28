const grid = document.getElementById('grid');
const size = 16;

// creates 256 (16x16) divs
for (x = 0; x < size; x++) {
    for (y = 0; y < size; y++) {
        const el = document.createElement('div');
        el.classList.add('rect');
        el.style.borderRadius = randomShape()
        grid.appendChild(el)
    }
}

function randomShape() {
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

    const keys = Object.keys(shapes);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return shapes[randomKey];

}

// 2d array
const matrix = []
for (x = 0; x < size; x++) {
    matrix[x] = []
    for (y = 0; y < size; y++) {
        matrix[x][y] = '.';
    }
}

function random(max) {
    const result = Math.floor(Math.random() * max) + 1;
    return result
}

const rowidx = matrix.findIndex(row => row.includes("."));
const colidx = matrix[rowidx].findIndex(cell => cell === ".");
console.log("first empty cell found: ", rowidx, colidx);

const colLimit = size - colidx;
const colWidth = random(colLimit);
const rowLimit = size - rowidx;
const rowHeight = random(rowLimit);
console.log("randoms are: ", colWidth, rowHeight)

let areaCounter = 0;
const template = [];
for (r = rowidx; r < rowHeight; r++) {
    template[r] = []
    for (c = colidx; c < colWidth; c++) {
        template[r][c] = "a" + areaCounter;
    }
}

areaCounter++;

// for (r = rowidx; r < rowHeight; r++) {
//     for (c = colidx; c < colWidth; c++) {
//         if (template[r][c] !== ("a" + areaCounter - 1)){
//             template[r][c] = "a" + areaConter
//         }
//     }
// }

console.log(template)


