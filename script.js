// script.js - Final Fixed Scientific Calculator Logic

const display = document.getElementById('display');
const history = document.getElementById('history');
const modeBadge = document.getElementById('modeBadge');
const invBadge = document.getElementById('invBadge');
const hypBadge = document.getElementById('hypBadge');

// Calculator state
let currentInput = '0';
let waitingForOperand = false;
let angleMode = 'DEG'; // DEG, RAD, GRAD
let invMode = false;
let hypMode = false;

// --- 1. Helper: Angle Conversion ---
function getAngleFactor() {
    if (angleMode === 'DEG') return Math.PI / 180;
    if (angleMode === 'GRAD') return Math.PI / 200;
    return 1; // RAD
}

// --- 2. Button Handlers ---
function append(value) {
    if (waitingForOperand || currentInput === '0') {
        currentInput = value.toString();
        waitingForOperand = false;
    } else {
        currentInput += value.toString();
    }
    updateDisplay();
}

function handleTrig(type) {
    let prefix = "";
    if (invMode) prefix += "a";
    prefix += type;
    if (hypMode) prefix += "h";
    
    if (waitingForOperand || currentInput === '0') {
        currentInput = prefix + "(";
    } else {
        currentInput += prefix + "(";
    }
    waitingForOperand = false;
    updateDisplay();
}

function appendFunction(name) {
    if (waitingForOperand || currentInput === '0') {
        currentInput = name + "(";
    } else {
        currentInput += name + "(";
    }
    waitingForOperand = false;
    updateDisplay();
}

// --- 3. The Core Logic Fix (The Evaluator) ---
function calculate() {
    try {
        let expression = currentInput;
        const factor = getAngleFactor();

        // A. Handle Implicit Multiplication (e.g., 5π -> 5*π)
        expression = expression.replace(/(\d)(π|e|\()/g, '$1*$2');
        expression = expression.replace(/(\)|π|e)(\d)/g, '$1*$2');

        // B. Constants
        expression = expression.replace(/π/g, Math.PI).replace(/e/g, Math.E);

        // C. Trigonometry - CRITICAL REPLACEMENT ORDER
        // 1. Inverse Trig: result is in Radians, convert BACK to DEG/GRAD
        expression = expression.replace(/asin\(/g, `(1/${factor})*Math.asin(`);
        expression = expression.replace(/acos\(/g, `(1/${factor})*Math.acos(`);
        expression = expression.replace(/atan\(/g, `(1/${factor})*Math.atan(`);

        // 2. Standard Trig: input is in DEG/GRAD, convert TO Radians
        // Uses negative lookbehind (?<!a) to not touch 'asin'
        expression = expression.replace(/(?<!a)sin\(/g, `Math.sin(${factor}*`);
        expression = expression.replace(/(?<!a)cos\(/g, `Math.cos(${factor}*`);
        expression = expression.replace(/(?<!a)tan\(/g, `Math.tan(${factor}*`);

        // 3. Hyperbolics (Math.sinh/cosh/tanh don't care about DEG/RAD)
        expression = expression.replace(/sinh\(/g, 'Math.sinh(');
        expression = expression.replace(/cosh\(/g, 'Math.cosh(');
        expression = expression.replace(/tanh\(/g, 'Math.tanh(');

        // D. Other Functions
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/ln\(/g, 'Math.log(');
        expression = expression.replace(/√\(/g, 'Math.sqrt(');
        expression = expression.replace(/\^/g, '**');

        // E. Parentheses Balancer (Ensures eval() doesn't fail on "sin(45")
        const openCount = (expression.match(/\(/g) || []).length;
        const closeCount = (expression.match(/\)/g) || []).length;
        expression += ')'.repeat(Math.max(0, openCount - closeCount));

        // F. Final Evaluation
        let result = eval(expression);

        // G. Precision Clean-up (Fixes sin(180) = 1.22e-16)
        if (Math.abs(result) < 1e-10) result = 0;
        result = Number(Math.round(result + 'e12') + 'e-12');

        history.innerHTML = currentInput + ' =';
        currentInput = result.toString();
        waitingForOperand = true;
    } catch (error) {
        currentInput = "Error";
    }
    updateDisplay();
}

// --- 4. UI & Utility Functions ---
function updateDisplay() {
    display.innerHTML = currentInput;
}

function clearAll() {
    currentInput = '0';
    history.innerHTML = '';
    waitingForOperand = false;
    updateDisplay();
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function toggleAngleMode() {
    const modes = ['DEG', 'RAD', 'GRAD'];
    angleMode = modes[(modes.indexOf(angleMode) + 1) % 3];
    modeBadge.innerHTML = angleMode;
}

function toggleInv() {
    invMode = !invMode;
    invBadge.style.opacity = invMode ? '1' : '0.5';
}

function toggleHyp() {
    hypMode = !hypMode;
    hypBadge.style.opacity = hypMode ? '1' : '0.5';
}

// --- 5. Keyboard Support ---
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') append(e.key);
    if (['+', '-', '*', '/', '(', ')', '.', '^'].includes(e.key)) append(e.key);
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === 'Backspace') backspace();
    if (e.key === 'Escape') clearAll();
    // Shortcuts
    if (e.key === 's') handleTrig('sin');
    if (e.key === 'c') handleTrig('cos');
    if (e.key === 't') handleTrig('tan');
});