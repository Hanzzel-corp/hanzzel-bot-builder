// ===========================
// Builder 2.0 — Hanzzel Corp
// ===========================

let blocks = [];
let selectedBlock = null;

// ---------------------------
// Crear bloques disponibles
// ---------------------------
window.onload = () => {
    renderBlocksPanel();
    renderSequencePanel();
};

function renderBlocksPanel() {
    const panel = document.getElementById("blocks-panel");

    const available = [
        { type: "send_message", name: "📩 Enviar mensaje" },
        { type: "read_excel", name: "📘 Leer Excel" },
        { type: "wait", name: "⏳ Esperar" },
        { type: "conditional", name: "⚡ Condicional" }
    ];

    available.forEach(b => {
        let btn = document.createElement("div");
        btn.className = "block";
        btn.innerText = b.name;
        btn.onclick = () => addBlock(b.type);
        panel.appendChild(btn);
    });
}

// ---------------------------
// Agregar bloque a la secuencia
// ---------------------------
function addBlock(type) {
    const id = Date.now();
    let newBlock = {
        id,
        type,
        props: {}
    };
    blocks.push(newBlock);
    renderSequencePanel();
}

// ---------------------------
// Render de la secuencia
// ---------------------------
function renderSequencePanel() {
    const seq = document.getElementById("sequence");
    seq.innerHTML = "<h2>Secuencia del Bot</h2>";

    blocks.forEach(block => {
        let div = document.createElement("div");
        div.className = "block";
        div.innerText = `[${block.id}] — ${block.type}`;
        div.onclick = () => selectBlock(block);
        seq.appendChild(div);
    });
}

// ---------------------------
// Panel de Propiedades
// ---------------------------
function selectBlock(block) {
    selectedBlock = block;
    const propsPanel = document.getElementById("properties");
    propsPanel.innerHTML = "<h2>Propiedades del bloque</h2>";

    switch(block.type) {
        case "send_message":
            propsPanel.innerHTML += `
                Mensaje:<br>
                <textarea id="msg"></textarea><br>
                Destino:<br>
                <input id="target">
            `;
        break;

        case "read_excel":
            propsPanel.innerHTML += `
                Archivo Excel:<br>
                <input id="file"><br>
            `;
        break;

        case "wait":
            propsPanel.innerHTML += `
                Tiempo (segundos):<br>
                <input id="time">
            `;
        break;

        case "conditional":
            propsPanel.innerHTML += `
                Condición (Python):<br>
                <input id="cond"><br>
                Acción si verdadero (ID):<br>
                <input id="true_action"><br>
                Acción si falso (ID):<br>
                <input id="false_action">
            `;
        break;
    }

    loadProps();
    attachEvents();
}

// ---------------------------
// Cargar propiedades existentes
// ---------------------------
function loadProps() {
    const p = selectedBlock.props;

    if (document.getElementById("msg")) document.getElementById("msg").value = p.message || "";
    if (document.getElementById("target")) document.getElementById("target").value = p.target || "";
    if (document.getElementById("file")) document.getElementById("file").value = p.file || "";
    if (document.getElementById("time")) document.getElementById("time").value = p.time || "";
    if (document.getElementById("cond")) document.getElementById("cond").value = p.condition || "";
    if (document.getElementById("true_action")) document.getElementById("true_action").value = p.true_action || "";
    if (document.getElementById("false_action")) document.getElementById("false_action").value = p.false_action || "";
}

// ---------------------------
// Guardar propiedades
// ---------------------------
function attachEvents() {
    document.querySelectorAll("#properties input, #properties textarea").forEach(input => {
        input.oninput = () => {
            selectedBlock.props = {
                ...selectedBlock.props,
                message: document.getElementById("msg")?.value,
                target: document.getElementById("target")?.value,
                file: document.getElementById("file")?.value,
                time: document.getElementById("time")?.value,
                condition: document.getElementById("cond")?.value,
                true_action: document.getElementById("true_action")?.value,
                false_action: document.getElementById("false_action")?.value
            };
        };
    });
}

// ---------------------------
// Descargar JSON
// ---------------------------
document.getElementById("download-json").onclick = () => {
    let data = JSON.stringify(blocks, null, 4);
    let blob = new Blob([data], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "bot.json";
    a.click();
};












