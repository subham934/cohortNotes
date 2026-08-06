const canvas = document.getElementById("canvas");
const layersList = document.getElementById("layersList");

let elements = [];
let selected = null;
let idCounter = 1;

// -------- CREATE ELEMENTS --------

document.getElementById("addRect").onclick = () => {
  createElement("rect");
};

document.getElementById("addText").onclick = () => {
  createElement("text");
};

function createElement(type) {
  const el = document.createElement("div");
  el.classList.add("element");
  el.dataset.id = idCounter;

  el.style.left = "50px";
  el.style.top = "50px";
  el.style.zIndex = idCounter;

  if (type === "rect") {
    el.style.width = "100px";
    el.style.height = "60px";
    el.style.background = "orange";
  } 
  else {
    el.textContent = "Text";
    el.contentEditable = true;
    el.style.padding = "5px";
    el.style.background = "#eee";
  }

  el.onclick = (e) => {
    e.stopPropagation();
    selectElement(el);
  };

  canvas.appendChild(el);

  elements.push(el);
  idCounter++;
  updateLayers();
}

// -------- SELECTION --------

canvas.onclick = () => {
  deselect();
};

function selectElement(el) {
  deselect();
  selected = el;
  el.classList.add("selected");
}

function deselect() {
  if (selected) selected.classList.remove("selected");
  selected = null;
}

// -------- LAYERS PANEL --------

function updateLayers() {
  layersList.innerHTML = "";

  [...elements]
    .sort((a, b) => b.style.zIndex - a.style.zIndex)
    .forEach(el => {
      const li = document.createElement("li");
      li.textContent = el.textContent || "Rectangle";
      li.onclick = () => selectElement(el);
      layersList.appendChild(li);
    });
}

// -------- MOVE UP / DOWN --------

document.getElementById("up").onclick = () => {
  if (!selected) return;
  selected.style.zIndex++;
  updateLayers();
};

document.getElementById("down").onclick = () => {
  if (!selected) return;
  selected.style.zIndex--;
  updateLayers();
};
