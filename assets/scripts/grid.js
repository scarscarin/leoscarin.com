const grid = document.getElementById('grid');
const stage = document.getElementById('stage');
const popup = document.getElementById('popup');
const popupInner = document.getElementById('popup-inner');
const size = 16;

const colors = {
  first: "#93e4c1",
  second: "#3baea0",
  third: "#118a7e",
  fourth: "#1f6f78"
};

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
};

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
  return obj[keys[Math.floor(Math.random() * keys.length)]];
}

function random(max) {
  return Math.floor(Math.random() * max) + 1;
}

document.getElementById('popup-close').addEventListener('click', closePopup);

function closePopup() {
  stage.classList.remove('popup-open');
}

const loadingText = "<p style='color:#999;font-size:0.85rem;padding:1rem'>Loading content... here is a poem by Audre Lorde in the mean time: <br> The cockroach <br> who is dying <br> and the woman <br> who is blind <br> agree <br> not to notice <br> each other's shame.</p>"
function openPopup(item) {
  stage.classList.add('popup-open');
  popupInner.innerHTML = loadingText;

  fetch(item.content)
    .then(r => {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    })
    .then(md => {
      const base = item.content.substring(0, item.content.lastIndexOf('/') + 1);
      const resolved = md.replace(/\]\((?!http)\.\.?\//g, `](${base}`);
      popupInner.innerHTML = `<div class="popup-body">${marked.parse(resolved)}</div>`;
    })
    .catch(err => {
      popupInner.innerHTML = `<p style="color:#999;font-size:0.85rem;padding:1rem">Damn it! I could not load content for this one: (${err.message}).</p>`;
    });
}

// matrix
const matrix = [];

// creating 16x16 dots
for (let x = 0; x < size; x++) {
  matrix[x] = [];
  for (let y = 0; y < size; y++) matrix[x][y] = '.';
}

// reserving first 4x4 for main (name)
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 4; c++) {
    matrix[r][c] = 'main';
  }
}

let areaCounter = 0; // using this for a0, a1, etc
const areaDimensions = {};

// while true loop to assign areas
while (true) {
  const rowidx = matrix.findIndex(row => row.includes('.'));
  if (rowidx === -1) break;
  const colidx = matrix[rowidx].findIndex(cell => cell === '.');

  const colLimit = size - colidx;
  const rowLimit = size - rowidx;
  let colWidth = random(Math.min(colLimit, 4));
  let rowHeight = random(Math.min(rowLimit, 4));


  // break if bigger than limit
  for (let c = colidx; c < colidx + colWidth; c++) {
    if (matrix[rowidx][c] !== '.') {
      colWidth = c - colidx;
      break;
    }
  }
  for (let r = rowidx; r < rowidx + rowHeight; r++) {
    for (let c = colidx; c < colidx + colWidth; c++) {
      if (matrix[r][c] !== '.') {
        rowHeight = r - rowidx;
        break;
      }
    }
  }

  // storing dimensions for questa area before assigning
  areaDimensions['a' + areaCounter] = { w: colWidth, h: rowHeight };

  // assign area counts
  for (let r = rowidx; r < rowidx + rowHeight; r++) {
    for (let c = colidx; c < colidx + colWidth; c++) {
      matrix[r][c] = 'a' + areaCounter;
    }
  }

  areaCounter++;
}

const templateAreas = matrix.map(row => `"${row.join(' ')}"`).join('\n');
grid.style.gridTemplateAreas = templateAreas;

const counts = {};
matrix.flat().forEach(cell => {
  if (cell.startsWith('a')) counts[cell] = (counts[cell] || 0) + 1;
});

const sortedAreas = Object.entries(counts).sort((a, b) => b[1] - a[1]);

fetch('./assets/cms/data.json')
  .then(r => r.json())
  .then(data => {
    const main = document.createElement('div');
    main.classList.add('rect', 'rect--corner', 'rect--main');
    main.style.gridArea = 'main';
    main.style.borderRadius = getRandom(shapes);
    main.style.background = getRandom(backgrounds);

    const label = document.createElement('span');
    label.classList.add('rect-label');
    label.textContent = 'LEO SCARIN';
    main.appendChild(label);

    main.addEventListener('click', () => openPopup(data.main));

    grid.appendChild(main);

    const projects = [...data.projects].sort((a, b) => b.year - a.year);
    let idx = 0;

    sortedAreas.forEach(([areaName, cellCount]) => {
      const rect = document.createElement('div');
      rect.classList.add('rect');
      rect.style.gridArea = areaName;
      rect.style.borderRadius = getRandom(shapes);
      rect.style.background = getRandom(backgrounds);

      const dim = areaDimensions[areaName];

      if (idx < projects.length && dim.w >= 2 & dim.h >= 2) {
        const project = projects[idx]
        idx++;

        rect.classList.add('rect--project');

        if (project.cover) {
          rect.style.setProperty('--cover', `url(${project.cover})`);
        }

        const label = document.createElement('span');
        label.classList.add('rect-label');
        label.textContent = project.title;
        rect.appendChild(label);
        rect.addEventListener('click', () => openPopup(project));
      }

      grid.appendChild(rect);
    });

    setInterval(() => {
      document.querySelectorAll('.rect').forEach(el => {
        el.style.borderRadius = getRandom(shapes);
      });
    }, 5000);

  });