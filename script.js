let blocks = [];
let selectedBlockId = null;

function addBlock(type) {
    const id = Date.now();
    const block = { id, type, props: {} };

    blocks.push(block);
    renderBlocks();
}

function renderBlocks() {
    const container = document.getElementById("blockList");
    container.innerHTML = "";

    blocks.forEach(block => {
        const div = document.createElement("div");
        div.className = "block-item";
        div.innerText = `${block.type} (${block.id})`;

        div.onclick = () => selectBlock(block.id);

        container.appendChild(div);
    });
}

function selectBlock(id) {
    selectedBlockId = id;
    const block = blocks.find(b => b.id === id);

    const panel = document.getElementById("propertiesPanel");
    panel.innerHTML = "";

    if (!block) return;

    // --- FORMULARIOS POR TIPO DE BLOQUE ---
    if (block.type === "read_excel") {
        panel.innerHTML = `
            <label class='prop-label'>Ruta del archivo:</label>
            <input class='prop-input' onchange="updateProp(${id}, 'path', this.value)">

            <label class='prop-label'>Hoja:</label>
            <input class='prop-input' onchange="updateProp(${id}, 'sheet', this.value)">

            <label class='prop-label'>Rango (opcional):</label>
            <input class='prop-input' onchange="updateProp(${id}, 'range', this.value)">
        `;
    }

    else if (block.type === "send_message") {
        panel.innerHTML = `
            <label class='prop-label'>Mensaje:</label>
            <textarea class='prop-textarea' onchange="updateProp(${id}, 'message', this.value)"></textarea>

            <label class='prop-label'>Destino:</label>
            <input class='prop-input' onchange="updateProp(${id}, 'target', this.value)">

            <label class='prop-label'>Modo:</label>
            <select class='prop-select' onchange="updateProp(${id}, 'mode', this.value)">
                <option value="log">log</option>
                <option value="print">print</option>
                <option value="telegram">telegram</option>
                <option value="whatsapp">whatsapp</option>
            </select>
        `;
    }

    else if (block.type === "conditional") {
        panel.innerHTML = `
            <label class='prop-label'>Condición:</label>
            <input class='prop-input' onchange="updateProp(${id}, 'condition', this.value)">

            <label class='prop-label'>Acción si verdadero:</label>
            <input class='prop-input' onchange="updateProp(${id}, 'true_action', this.value)">

            <label class='prop-label'>Acción si falso:</label>
            <input class='prop-input' onchange="updateProp(${id}, 'false_action', this.value)">
        `;
    }

    else if (block.type === "wait") {
        panel.innerHTML = `
            <label class='prop-label'>Tiempo (segundos):</label>
            <input type="number" class='prop-input' onchange="updateProp(${id}, 'time', this.value)">
        `;
    }
}

function updateProp(id, key, value) {
    const block = blocks.find(b => b.id === id);
    if (!block) return;

    block.props[key] = value;
}

function downloadBot() {
    const data = JSON.stringify(blocks, null, 2);
    const blob = new Blob([data], { type: "application/json" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bot.json";
    a.click();
}

function resetBot() {
    blocks = [];
    selectedBlockId = null;
    renderBlocks();
    document.getElementById("propertiesPanel").innerText = "Selecciona un bloque";
}






