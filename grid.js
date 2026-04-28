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

function openPopup(item) {
  stage.classList.add('popup-open');
  popupInner.innerHTML = '<p style="color:#999;font-size:0.85rem;padding:1rem">Loading...</p>';

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
      popupInner.innerHTML = `<p style="color:#999;font-size:0.85rem;padding:1rem">Could not load content (${err.message}).</p>`;
    });
}

// --- MATRIX ---
const matrix = [];
for (let x = 0; x < size; x++) {
  matrix[x] = [];
  for (let y = 0; y < size; y++) matrix[x][y] = '.';
}

for (let r = 0; r < 4; r++)
  for (let c = 0; c < 4; c++)
    matrix[r][c] = 'main';

let areaCounter = 0;
while (true) {
  const rowidx = matrix.findIndex(row => row.includes('.'));
  if (rowidx === -1) break;
  const colidx = matrix[rowidx].findIndex(cell => cell === '.');

  const colLimit = size - colidx;
  const rowLimit = size - rowidx;
  let colWidth = random(Math.min(colLimit, 4));
  let rowHeight = random(Math.min(rowLimit, 4));

  for (let c = colidx; c < colidx + colWidth; c++) {
    if (matrix[rowidx][c] !== '.') { colWidth = c - colidx; break; }
  }
  for (let r = rowidx; r < rowidx + rowHeight; r++) {
    for (let c = colidx; c < colidx + colWidth; c++) {
      if (matrix[r][c] !== '.') { rowHeight = r - rowidx; break; }
    }
  }

  for (let r = rowidx; r < rowidx + rowHeight; r++)
    for (let c = colidx; c < colidx + colWidth; c++)
      matrix[r][c] = 'a' + areaCounter;

  areaCounter++;
}

const templateAreas = matrix.map(row => `"${row.join(' ')}"`).join('\n');
grid.style.gridTemplateAreas = templateAreas;

const counts = {};
matrix.flat().forEach(cell => {
  if (cell.startsWith('a')) counts[cell] = (counts[cell] || 0) + 1;
});

const sortedAreas = Object.entries(counts).sort((a, b) => b[1] - a[1]);

fetch('data.json')
  .then(r => r.json())

  .then(data => {
    const cornerLabels = { main: 'LEO SCARIN' };

    ['main'].forEach(id => {
      const el = document.createElement('div');
      el.classList.add('rect', 'rect--corner', `rect--${id}`);
      el.style.gridArea = id;
      el.style.borderRadius = getRandom(shapes);
      el.style.background = getRandom(backgrounds);
      const label = document.createElement('span');
      label.classList.add('rect-label');
      label.textContent = cornerLabels[id];
      el.appendChild(label);
      el.addEventListener('click', () => openPopup(data.corners[id]));
      grid.appendChild(el);
    });

    const projects = data.projects;
    const news = data.news;

    sortedAreas.forEach(([areaName, cellCount], idx) => {
      const el = document.createElement('div');
      el.classList.add('rect');
      el.style.gridArea = areaName;
      el.style.borderRadius = getRandom(shapes);
      el.style.background = getRandom(backgrounds);

      if (idx < projects.length) {
        const project = projects[idx];
        el.classList.add('rect--project');
        if (project.cover) el.style.setProperty('--cover', `url(${project.cover})`);
        const label = document.createElement('span');
        label.classList.add('rect-label');
        label.textContent = cellCount >= 4 ? project.title : project.year;
        el.appendChild(label);
        el.addEventListener('click', () => openPopup(project));

      } else if (idx < projects.length + news.length) {
        const item = news[idx - projects.length];
        if (item.cover) el.style.setProperty('--cover', `url(${item.cover})`);
        const label = document.createElement('span');
        label.classList.add('rect-label');
        label.textContent = item.date;
        el.appendChild(label);
        el.addEventListener('click', () => openPopup(item));
      }

      grid.appendChild(el);
    });

    setInterval(() => {
      document.querySelectorAll('.rect').forEach(el => {
        el.style.borderRadius = getRandom(shapes);
      });
    }, 5000);
  });