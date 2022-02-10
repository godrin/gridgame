const grid = [];
const WIDTH = 4;
let oldClick;
let score = 0;

function generateNew() {
    let r = Math.floor(Math.random() * 2) + 1;
    return Math.pow(2, r);
//   return Math.floor(Math.random()*4)+1;
}

function initGrid(w, h) {
    for (let x = 0; x < w * h; x++) {
        grid.push(generateNew());
    }
}

// game logic


// pos0 = {x:2, y:3, index:20}
function combine(pos0, pos1) {

    if (Math.abs(pos0.x - pos1.x) + Math.abs(pos0.y - pos1.y) != 1) {
        console.log("CANCELLED - wrong position");
        return;
    }

    if (grid[pos0.index] != grid[pos1.index]) {
        console.log("CANCELLED - different value");
        return;
    }

    console.log("combine", pos0, pos1);
    // spiel mechanik
    grid[pos1.index] += grid[pos0.index];
    score += grid[pos1.index];
    grid[pos0.index] = generateNew();
}


function gameClick(pos) {
    if (oldClick) {
        combine(oldClick, pos);
        oldClick = undefined;
    } else {
        oldClick = pos;
    }
}

// framework
function initBox(box, x, y, index) {
    box.addEventListener("mousedown", function (e) {
        oldClick = {x, y, index};
    });
    box.addEventListener("mouseup", function (e) {
        combine(oldClick, {x, y, index});
        repaint();
    });
}

function display(el, grid) {
    el.innerHTML = "";
    for (let index = 0; index < grid.length; index++) {
        let box = document.createElement("play-box");
        box.innerHTML = grid[index];
        initBox(box, index % WIDTH, Math.floor(index / WIDTH), index);
        el.appendChild(box);
    }
}

function displayScore(el, score) {
    el.innerHTML = score;
}

function repaint() {
    display(document.querySelector("play-field"), grid);
    displayScore(document.querySelector("score"), score);
}

initGrid(WIDTH, WIDTH);
repaint();


