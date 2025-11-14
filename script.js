// =============== CONFIGURACIÓN DE PROPIEDADES DE CADA BLOQUE ===============
const blockProperties = {
    "read_excel": [
        { name: "file", label: "Archivo Excel", type: "text", placeholder: "ruta.xlsx" },
        { name: "sheet", label: "Hoja", type: "text", placeholder: "Sheet1" }
    ],

    "send_message": [
        { name: "text", label: "Texto del mensaje", type: "text", placeholder: "Hola mundo" }
    ],

    "if": [
        { name: "var", label: "Variable", type: "text", placeholder: "x" },
        { name: "op", label: "Operador", type: "text", placeholder: "==, >, <, !=" },
        { name: "value", label: "Valor", type: "text", placeholder: "10" }
    ],

    "wait": [
        { name: "seconds", label: "Segundos", type: "number", placeholder: "1" }
    ]
};

// ============================================================================
//                       VARIABLES DEL CONSTRUCTOR
// ============================================================================
let blocks = [];         // lista de bloques creados
let selectedBlock = null; // bloque seleccionado para edición

// ============================================================================
//                    FUNCIÓN PARA AGREGAR BLOQUES
// ============================================================================
function addBlock(type) {
    const id = Date.now() + Math.floor(Math.random() * 99999);

    const block = {
        id: id,
        type: type,
        params: {}
    };

    blocks.push(block);
    renderBlocks();
}

// ============================================================================
//                       FUNCIÓN PARA RENDERIZAR
// ============================================================================
function renderBlocks() {
    const container = document.getElementById("builderArea");
    container.innerHTML = "";

    blocks.forEach(block => {
        const blockDiv = document.createElement("div");
        blockDiv.className = "blockItem";
        blockDiv.textContent = `${block.type} (${block.id})`;

        // CUANDO SE CLICKEA → MOSTRAR PROPIEDADES
        blockDiv.onclick = () => {
            selectedBlock = block;
            renderProperties(block);
        };

        container.appendChild(blockDiv);
    });
}

// ============================================================================
//                FUNCIÓN PARA MOSTRAR PROPIEDADES EN PANEL DERECHO
// ============================================================================
function renderProperties(block) {
    const panel = document.getElementById("propertiesPanel");
    panel.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = `Propiedades: ${block.type}`;
    panel.appendChild(title);

    const props = blockProperties[block.type];

    if (!props) {
        panel.innerHTML += "<p>Este bloque no tiene propiedades.</p>";
        return;
    }

    props.forEach(prop => {
        const label = document.createElement("label");
        label.textContent = prop.label;
        panel.appendChild(label);

        const input = document.createElement("input");
        input.type = prop.type;
        input.placeholder = prop.placeholder;
        input.value = block.params[prop.name] || "";

        input.oninput = () => {
            block.params[prop.name] = input.value;
        };

        panel.appendChild(input);
    });
}

// ============================================================================
//                    DESCARGA DEL BOT EN FORMATO JSON
// ============================================================================
function downloadBot() {
    const jsonData = JSON.stringify(blocks, null, 4);

    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "my_bot.bot.json";
    a.click();

    URL.revokeObjectURL(url);
}

// ============================================================================
//                     RESET DEL CONSTRUCTOR
// ============================================================================
function resetBuilder() {
    blocks = [];
    selectedBlock = null;

    document.getElementById("builderArea").innerHTML = "";
    document.getElementById("propertiesPanel").innerHTML = "Selecciona un bloque";
}


