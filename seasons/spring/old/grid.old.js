const grid = document.getElementById('grid');
const size = 16;

// creates 256 (16x16) divs
// for (x = 0; x < size; x++) {
//     for (y = 0; y < size; y++) {

//     }
// }

const colors = {
    first: "#93e4c1",
    second: "#3baea0",
    third: "#118a7e",
    fourth: "#1f6f78"
}
const backgrounds = {
    grad_a: `linear-gradient(90deg, ${colors.first}, ${colors.second})`,
    grad_b: `linear-gradient(90deg, ${colors.second}, ${colors.third})`,
    grad_c: `linear-gradient(90deg, ${colors.third}, ${colors.fourth})`,
    grad_d: `linear-gradient(90deg, ${colors.first}, ${colors.third})`,
    grad_e: `linear-gradient(-90deg, ${colors.second}, ${colors.fourth})`,
    grad_f: `linear-gradient(-90deg, ${colors.first}, ${colors.second})`,
    grad_g: `linear-gradient(-90deg, ${colors.second}, ${colors.third})`,
    grad_h: `linear-gradient(-90deg, ${colors.third}, ${colors.fourth})`,
    grad_i: `linear-gradient(-90deg, ${colors.first}, ${colors.third})`,
    grad_j: `linear-gradient(-90deg, ${colors.second}, ${colors.fourth})`,
}
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

function getRandom(obj) {
    const keys = Object.keys(obj);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return obj[randomKey];
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
let areaCounter = 0;
while (true) {
    const rowidx = matrix.findIndex(row => row.includes("."));
    if (rowidx === -1) break;
    const colidx = matrix[rowidx].findIndex(cell => cell === ".");
    console.log("first empty cell found: ", rowidx, colidx);

    const colLimit = size - colidx;
    const rowLimit = size - rowidx;
    let colWidth = random(Math.min(colLimit, 4));
    let rowHeight = random(Math.min(rowLimit, 4));
    console.log("randoms are: ", colWidth, rowHeight)
    for (c = colidx; c < colidx + colWidth; c++) {
        if (matrix[rowidx][c] !== ".") {
            colWidth = c - colidx;
            break;
        }
    }
    for (r = rowidx; r < rowidx + rowHeight; r++) {
        for (c = colidx; c < colidx + colWidth; c++) {
            if (matrix[r][c] !== ".") {
                rowHeight = r - rowidx;
                break;
            }
        }
    }

    for (r = rowidx; r < rowidx + rowHeight; r++) {
        for (c = colidx; c < colidx + colWidth; c++) {
            matrix[r][c] = "a" + areaCounter;
        }
    }

    areaCounter++;
}

const templateAreas = matrix.map(row => `"${row.join(" ")}"`).join("\n")
console.log(templateAreas)
grid.style.gridTemplateAreas = templateAreas

for (i = 0; i < areaCounter; i++) {
    const el = document.createElement('div');
    el.classList.add('rect');
    el.style.gridArea = "a" + i;
    el.style.borderRadius = getRandom(shapes)
    el.style.background = getRandom(backgrounds);
    grid.appendChild(el)
}
function changeBorders() {
    const divs = document.querySelectorAll('.rect')
    divs.forEach(el => el.style.borderRadius = getRandom(shapes));
}
setInterval(changeBorders, 5000);

