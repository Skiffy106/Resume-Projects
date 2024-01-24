var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ruleInput = document.getElementById("ruleInput");
var automatonWidth = 100; // Number of cells in the automaton
var automaton = Array.from({ length: automatonWidth }, (_, i) =>
  i === Math.floor(automatonWidth / 2) ? 1 : 0
);

var generations = []; // Store the history of generations
var cellWidth = canvas.width / automaton.length;
var cellHeight = 10; // Height of each row
var animationSpeed = 100; // Delay in milliseconds

function applyRules(left, center, right, rule) {
  // Convert the rule to binary and pad zeros
  var binaryRule = rule.toString(2).padStart(8, "0");
  // Get the index corresponding to the binary state of left, center, right
  var index = parseInt(
    left.toString() + center.toString() + right.toString(),
    2
  );
  // Return the result based on the rule
  return parseInt(binaryRule.charAt(7 - index), 10);
}

function updateAutomaton(rule) {
  var nextAutomaton = [];
  for (var i = 0; i < automaton.length; i++) {
    var left = automaton[(i - 1 + automaton.length) % automaton.length];
    var center = automaton[i];
    var right = automaton[(i + 1) % automaton.length];
    nextAutomaton[i] = applyRules(left, center, right, rule);
  }
  automaton = nextAutomaton;

  // Store the current generation in the history
  generations.push([...automaton]);

  // Scroll up if the canvas is filled
  if (generations.length * cellHeight > canvas.height) {
    ctx.clearRect(0, 0, canvas.width, cellHeight);
    generations.shift(); // Remove the oldest generation
  }
}

function drawAutomaton() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var gen = 0; gen < generations.length; gen++) {
    for (var i = 0; i < automaton.length; i++) {
      if (generations[gen][i] === 1) {
        ctx.fillRect(i * cellWidth, gen * cellHeight, cellWidth, cellHeight);
      }
    }
  }
}

ruleInput.addEventListener("input", function () {
  automaton = Array.from({ length: automatonWidth }, (_, i) =>
    i === Math.floor(automatonWidth / 2) ? 1 : 0
  );
  generations = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function animate() {
  var rule = parseInt(ruleInput.value) || 30; // Default to rule 30 if input is invalid
  updateAutomaton(rule);
  drawAutomaton();
  setTimeout(animate, animationSpeed);
}

// Start the animation loop
animate();
