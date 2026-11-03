const screen = document.getElementById("screen");
const historyLine = document.getElementById("history");
const message = document.getElementById("message");
let expression = "";
let justCalculated = false;

function updateDisplay() {
  screen.value = expression || "0";
}

function appendValue(value) {
  message.textContent = "";
  if (justCalculated && /[0-9.]/.test(value)) expression = "";
  justCalculated = false;

  if (value === ".") {
    const currentNumber = expression.split(/[+*/%\-]/).pop();
    if (currentNumber.includes(".")) return;
    if (currentNumber === "") expression += "0";
  }

  const last = expression.slice(-1);
  if ("+-*/%".includes(value) && "+-*/%".includes(last)) {
    expression = expression.slice(0, -1);
  }
  expression += value;
  updateDisplay();
}

function clearAll() {
  expression = "";
  historyLine.textContent = "";
  message.textContent = "";
  justCalculated = false;
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  message.textContent = "";
  updateDisplay();
}

function calculate() {
  if (!expression) return;
  try {
    // Only calculator characters are accepted; no arbitrary code is evaluated.
    if (!/^[0-9+*/%.\-() ]+$/.test(expression)) throw new Error("Invalid input");
    const result = Function('"use strict"; return (' + expression + ')')();
    if (!Number.isFinite(result)) throw new Error("Cannot divide by zero");
    historyLine.textContent = expression.replaceAll("*", "×").replaceAll("/", "÷") + " =";
    expression = String(Number(result.toPrecision(12)));
    justCalculated = true;
    message.textContent = "";
    updateDisplay();
  } catch (error) {
    message.textContent = error.message === "Cannot divide by zero" ? error.message : "Please enter a valid calculation.";
  }
}

document.querySelector(".keys").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "clear") clearAll();
  else if (action === "delete") deleteLast();
  else if (action === "equals") calculate();
  else if (button.dataset.value) appendValue(button.dataset.value);
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9.+*/%()-]$/.test(event.key)) appendValue(event.key);
  else if (event.key === "Enter" || event.key === "=") { event.preventDefault(); calculate(); }
  else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clearAll();
});

updateDisplay();
