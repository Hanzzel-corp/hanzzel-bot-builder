let blocks = [];
let selectedBlock = null;

const builderArea = document.getElementById("builderArea");
const propertiesBox = document.getElementById("propertiesBox");

document.querySelectorAll(".blockButton").forEach(btn => {
    btn.addEventListener("click", () => {
        createBlock(btn.dataset.type);
    });
});

function createBlock(type) {
    const id = Date.now();

    const block = {
        id,
        type,
        props: {}
    };

    blocks.push(block);

    const div = document.createElement("div");
    div.className = "builder-block";
    div.textContent = `${type} (${id})`;
    div.dataset.id = id;

    div.addEventListener("click", () => selectBlock(id));

    builderArea.appendChild(div);
}

function selectBlock(id) {
    selectedBlock = blocks.find(b => b.id == id);

    if (!selectedBlock) return;

    propertiesBox.innerHTML = "";

    const title = document.createElement("h3");
    title.innerText = "Propiedades del Bloque";
    propertiesBox.appendChild(title);

    if (selectedBlock.type === "read_excel") {
        addInput("Ruta del archivo Excel", "path");
    }

    if (selectedBlock.type === "send_message") {
        addInput("Mensaje", "message");
    }

    if (selectedBlock.type === "wait") {
        addInput("Tiempo (segundos)", "seconds");
    }

    if (selectedBlock.type === "conditional") {
        addInput("Condición", "condition");
    }
}

function addInput(labelText, propName) {
    const label = document.createElement("label");
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = "text";
    input.value = selectedBlock.props[propName] || "";

    input.addEventListener("input", () => {
        selectedBlock.props[propName] = input.value;
    });

    propertiesBox.appendChild(label);
    propertiesBox.appendChild(input);
    propertiesBox.appendChild(document.createElement("br"));
}

document.getElementById("downloadBtn").addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blocks, null, 4));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "my_bot.bot.json");
    dl.click();
});

document.getElementById("resetBtn").addEventListener("click", () => {
    blocks = [];
    builderArea.innerHTML = "";
    propertiesBox.innerHTML = "Selecciona un bloque";
});





