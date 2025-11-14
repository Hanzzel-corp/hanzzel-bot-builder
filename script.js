let blocks = [];
let selectedId = null;

// Crear un nuevo bloque
function addBlock(type) {
    const id = Date.now(); // id único

    const block = {
        id: id,
        type: type,
        props: {}
    };

    // Props por defecto
    if (type === "send_message") {
        block.props = { message: "", target: "", mode: "telegram" };
    }
    if (type === "read_excel") {
        block.props = { file: "" };
    }
    if (type === "wait") {
        block.props = { time: 1 };
    }
    if (type === "conditional") {
        block.props = { condition: "", true_action: null, false_action: null };
    }

    blocks.push(block);
    renderBlocks();
}

// Mostrar lista de bloques
function renderBlocks() {
    const list = document.getElementById("blockList");
    list.innerHTML = "";

    blocks.forEach(block => {
        const li = document.createElement("li");
        li.className = "block-item" + (selectedId === block.id ? " selected" : "");
        li.innerText = `[${block.id}] ${block.type}`;
        li.onclick = () => selectBlock(block.id);
        list.appendChild(li);
    });
}

// Seleccionar bloque
function selectBlock(id) {
    selectedId = id;
    renderBlocks();
    renderProperties();
}

// Panel derecho dinámico
function renderProperties() {
    const panel = document.getElementById("propertiesPanel");
    const block = blocks.find(b => b.id === selectedId);
    if (!block) {
        panel.innerHTML = "Selecciona un bloque.";
        return;
    }

    let html = `<h3>${block.type}</h3>`;

    for (let prop in block.props) {
        html += `<div class="prop-row"><label>${prop}</label>`;

        if (block.type === "conditional" && (prop === "true_action" || prop === "false_action")) {

            html += `<select onchange="updateProp('${prop}', this.value)">`;
            html += `<option value="">(ninguno)</option>`;

            blocks.forEach(b => {
                if (b.id !== block.id) {
                    html += `<option value="${b.id}">${b.id} — ${b.type}</option>`;
                }
            });

            html += `</select></div>`;
        }
        else {
            html += `<input value="${block.props[prop]}" 
                     onchange="updateProp('${prop}', this.value)"> </div>`;
        }
    }

    panel.innerHTML = html;
}

// Actualizar propiedades
function updateProp(key, value) {
    const block = blocks.find(b => b.id === selectedId);
    if (!block) return;

    // Convertir números automáticamente
    if (!isNaN(value) && value.trim() !== "") {
        value = Number(value);
    }

    // Convertir vacío a null
    if (value === "") value = null;

    block.props[key] = value;
}

// Descargar JSON
function downloadBot() {
    // Validación mínima
    for (let block of blocks) {
        if (block.type === "conditional") {
            if (!block.props.condition) {
                alert(`Bloque ${block.id}: condición vacía`);
                return;
            }
        }
    }

    const content = JSON.stringify(blocks, null, 4);

    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "bot.json";
    a.click();
}









