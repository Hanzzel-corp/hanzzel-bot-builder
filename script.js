let blocks = [];
let selectedBlock = null;

function genId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function addBlock(type) {
    const block = {
        id: genId(),
        type: type,
        props: {}
    };

    blocks.push(block);
    renderSequence();
    validate();
}

function renderSequence() {
    const list = document.getElementById("sequenceList");
    list.innerHTML = "";

    blocks.forEach(b => {
        const li = document.createElement("li");
        li.className = "block-item";
        li.textContent = `[${b.id}] — ${b.type}`;
        li.onclick = () => selectBlock(b.id);
        list.appendChild(li);
    });
}

function selectBlock(id) {
    selectedBlock = blocks.find(b => b.id === id);
    renderProperties();
}

function renderProperties() {
    const panel = document.getElementById("propertiesPanel");
    const block = selectedBlock;

    if (!block) {
        panel.innerHTML = "Selecciona un bloque";
        return;
    }

    // SEND MESSAGE
    if (block.type === "send_message") {
        panel.innerHTML = `
            <label>Mensaje:</label>
            <textarea oninput="updateProp('text', this.value)">${block.props.text || ""}</textarea>

            <label>Destino:</label>
            <input type="text" oninput="updateProp('to', this.value)" value="${block.props.to || ""}">
        `;
    }

    // READ EXCEL
    else if (block.type === "read_excel") {
        panel.innerHTML = `
            <label>Archivo Excel:</label>
            <input oninput="updateProp('file', this.value)" value="${block.props.file || ""}">

            <label>Hoja:</label>
            <input oninput="updateProp('sheet', this.value)" value="${block.props.sheet || ""}">
        `;
    }

    // WAIT
    else if (block.type === "wait") {
        panel.innerHTML = `
            <label>Tiempo (segundos):</label>
            <input type="number" oninput="updateProp('seconds', this.value)" value="${block.props.seconds || 1}">
        `;
    }

    // CONDITIONAL
    else if (block.type === "conditional") {
        panel.innerHTML = `
            <label>Condición (Python):</label>
            <input oninput="updateProp('expr', this.value)" value="${block.props.expr || ""}">

            <label>True → Ir al bloque ID:</label>
            <input type="text" oninput="updateProp('true_id', this.value)" value="${block.props.true_id || ""}">

            <label>False → Ir al bloque ID:</label>
            <input type="text" oninput="updateProp('false_id', this.value)" value="${block.props.false_id || ""}">
        `;
    }

    // INPUT MESSAGE (NUEVO)
    else if (block.type === "input_message") {
        panel.innerHTML = `
            <label>Texto del Cliente (para pruebas):</label>
            <textarea oninput="updateProp('text', this.value)">${block.props.text || ""}</textarea>

            <label>Guardar en variable:</label>
            <input type="text" oninput="updateProp('var', this.value)" value="${block.props.var || "consulta"}">
        `;
    }
}

function updateProp(key, value) {
    selectedBlock.props[key] = value;
    validate();
}

function validate() {
    const box = document.getElementById("validationBox");
    box.textContent = "✔ Sin errores";
    box.className = "validation ok";
}

function downloadBot() {
    const data = JSON.stringify(blocks, null, 2);
    const blob = new Blob([data], { type: "application/json" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bot.json";
    a.click();
}














