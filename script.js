let blocks = [];
let selectedBlock = null;

const sequence = document.getElementById("sequence");
const properties = document.getElementById("properties");
const validationBox = document.getElementById("validation-box");

// Crear un ID único
function generateId() {
    return Date.now() + Math.floor(Math.random() * 99999);
}

// Agregar bloque desde el panel izquierdo
document.querySelectorAll(".block-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const type = btn.dataset.type;

        const newBlock = {
            id: generateId(),
            type,
            props: {}
        };

        blocks.push(newBlock);
        renderBlocks();
    });
});

// Renderizar los bloques en el panel central
function renderBlocks() {
    sequence.innerHTML = "";

    blocks.forEach(b => {
        const div = document.createElement("div");
        div.className = "block" + (selectedBlock === b.id ? " selected" : "");
        div.innerHTML = `<b>[${b.id}] — ${b.type}</b>`;

        div.addEventListener("click", () => {
            selectedBlock = b.id;
            renderBlocks();
            renderProperties();
        });

        sequence.appendChild(div);
    });

    validateBot();
}

// Renderizar las propiedades de un bloque
function renderProperties() {
    properties.innerHTML = "";
    const b = blocks.find(x => x.id === selectedBlock);
    if (!b) return;

    // --- SEND MESSAGE ---
    if (b.type === "send_message") {
        properties.innerHTML = `
            <div class="property-field">
                <label>Mensaje</label>
                <input type="text" id="msg" value="${b.props.message || ""}">
            </div>
            <div class="property-field">
                <label>Target</label>
                <input type="text" id="target" value="${b.props.target || ""}">
            </div>
        `;

        document.getElementById("msg").oninput = e => b.props.message = e.target.value;
        document.getElementById("target").oninput = e => b.props.target = e.target.value;
    }

    // --- READ EXCEL ---
    if (b.type === "read_excel") {
        properties.innerHTML = `
            <div class="property-field">
                <label>Archivo Excel</label>
                <input type="text" id="file" placeholder="ej: datos.xlsx" value="${b.props.file || ""}">
            </div>
        `;

        document.getElementById("file").oninput = e => b.props.file = e.target.value;
    }

    // --- WAIT ---
    if (b.type === "wait") {
        properties.innerHTML = `
            <div class="property-field">
                <label>Tiempo (segundos)</label>
                <input type="number" id="time" min="1" value="${b.props.time || 1}">
            </div>
        `;

        document.getElementById("time").oninput = e => b.props.time = Number(e.target.value);
    }

    // --- CONDITIONAL ---
    if (b.type === "conditional") {
        const options = blocks
            .map(bl => `<option value="${bl.id}">${bl.id} — ${bl.type}</option>`)
            .join("");

        properties.innerHTML = `
            <div class="property-field">
                <label>Condición (Python)</label>
                <input type="text" id="cond" value="${b.props.condition || ""}">
            </div>

            <div class="property-field">
                <label>True Action</label>
                <select id="trueA">
                    <option value="">(ninguna)</option>
                    ${options}
                </select>
            </div>

            <div class="property-field">
                <label>False Action</label>
                <select id="falseA">
                    <option value="">(ninguna)</option>
                    ${options}
                </select>
            </div>
        `;

        document.getElementById("cond").oninput = e => b.props.condition = e.target.value;
        document.getElementById("trueA").value = b.props.true_action || "";
        document.getElementById("falseA").value = b.props.false_action || "";

        document.getElementById("trueA").onchange = e => {
            b.props.true_action = Number(e.target.value);
        };
        document.getElementById("falseA").onchange = e => {
            b.props.false_action = Number(e.target.value);
        };
    }
}

// Validación completa del bot
function validateBot() {
    let msgs = [];

    blocks.forEach(b => {
        if (b.type === "conditional") {
            if (!b.props.condition) {
                msgs.push(`❌ Bloque ${b.id}: condición vacía`);
            }
            if (b.props.true_action && !blocks.find(x => x.id === b.props.true_action)) {
                msgs.push(`❌ Bloque ${b.id}: true_action apunta a bloque inexistente`);
            }
            if (b.props.false_action && !blocks.find(x => x.id === b.props.false_action)) {
                msgs.push(`❌ Bloque ${b.id}: false_action apunta a bloque inexistente`);
            }
        }

        if (b.type === "wait") {
            if (!b.props.time || b.props.time < 1) {
                msgs.push(`⚠️ Bloque ${b.id}: tiempo inválido`);
            }
        }
    });

    if (msgs.length === 0) {
        validationBox.innerHTML = `<span class="success">✔ Sin errores</span>`;
    } else {
        validationBox.innerHTML = msgs.map(m => `<div class="error">${m}</div>`).join("");
    }
}

// Descargar JSON
document.getElementById("downloadBtn").addEventListener("click", () => {
    validateBot();

    const blob = new Blob([JSON.stringify(blocks, null, 4)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "bot.json";
    a.click();

    URL.revokeObjectURL(url);
});











