let blocks = [];
let selectedBlock = null;

// Crear bloque en el canvas
document.querySelectorAll('.block').forEach(btn => {
  btn.addEventListener('click', () => {
    let t = btn.dataset.type;
    let block = {
      id: Date.now(),
      type: t,
      params: {},
    };
    blocks.push(block);
    renderCanvas();
  });
});

function renderCanvas() {
  let canvas = document.getElementById('canvas');
  canvas.innerHTML = "";

  blocks.forEach(b => {
    let el = document.createElement('div');
    el.className = 'block-item';
    el.innerText = b.type + " (" + b.id + ")";
    el.onclick = () => selectBlock(b.id);
    canvas.appendChild(el);
  });
}

function selectBlock(id) {
  selectedBlock = blocks.find(b => b.id === id);
  let pc = document.getElementById('properties-content');
  pc.innerHTML = "<p>Bloque: " + selectedBlock.type + "</p>";
}

// Descargar JSON
document.getElementById('download').onclick = () => {
  let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blocks));
  let a = document.createElement('a');
  a.href = data;
  a.download = "my_bot.bot.json";
  a.click();
};

document.getElementById('clear').onclick = () => {
  blocks = [];
  renderCanvas();
};
