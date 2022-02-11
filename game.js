const grid = [];
const WIDTH = 5;
const MAX_LENGTH = 100;

let hoverStack = [];
let score = 0;
let scoreToAdd = 0;


// basic tools
function inRect(pos, rect) {
	return pos.x>=rect.left && pos.y>=rect.top && pos.x<=rect.right && pos.y<=rect.bottom;
}

function objectEqual(a, b) {
    return JSON.stringify(a) == JSON.stringify(b);
}

function arrayContains(array, needle) {
    let index = array.find(function (e) {
        return objectEqual(e, needle);
    });
    return !!index;
}

// grid management

function generateNew() {
    let r = Math.floor(Math.random() * 3);
    return Math.pow(2, r);
}

function initGrid(w, h) {
    for (let x = 0; x < w * h; x++) {
        grid.push(generateNew());
    }
}

function combinableByIndex(index0, index1) {
    return grid[index0] == grid[index1];
}

function checkCombinable(pos0, pos1) {
    if (Math.abs(pos0.x - pos1.x) + Math.abs(pos0.y - pos1.y) != 1) {
        console.log("CANCELLED - wrong position");
        return false;
    }

    if (!combinableByIndex(pos0.index, pos1.index)) {
        console.log("CANCELLED - different value");
        return false;
    }
    return true;
}

// game logic

function checkSolvable() {
    for (let x = 0; x < WIDTH - 1; x++) {
        for (let y = 0; y < WIDTH - 1; y++) {
            let i = x + y * WIDTH;
            if (combinableByIndex(i, i + 1) || combinableByIndex(i, i + WIDTH)) {
                console.log("COMBINABLE", x, y);
                return true;
            }
        }
    }
    return false;
}

function calculateScoreToAdd(posStack) {

	let lastPos = posStack[posStack.length - 1];
	if("aufrunden" == "aufrunden") {
    let temp = grid[lastPos.index] * posStack.length;

	
    let exp = Math.ceil(Math.log(temp) / Math.log(2));

    return Math.pow(2, exp);
	} else {
    

	}
}

// pos0 = {x:2, y:3, index:20}
function combine(posStack) {
    if (posStack.length < 2) {
        return;
    }
    // spiel mechanik
    for (let pos of posStack.slice(0, -1)) {
        grid[pos.index] = generateNew();
    }

    // scoreToAdd = calculateScoreToAdd(posStack);
    let lastPos = posStack[posStack.length - 1];
    grid[lastPos.index] = scoreToAdd;
    score += scoreToAdd;
		playSound();
    scoreToAdd = 0;
    displayScore()
}


function combinableStack(hoverStack, pos) {
    if (arrayContains(hoverStack, pos)) {
        return false;
    }
    return checkCombinable(hoverStack[hoverStack.length - 1], pos);
}



/////////////////////////////
// event management

function initBox(box, pos) {
    box.addEventListener("mousedown", function (e) {
        box.className = "active";
        hoverStack = [pos];
    });
    box.addEventListener("mousemove", function (e) {
        if (hoverStack.length > 0 && hoverStack.length < MAX_LENGTH) {
            if (hoverStack.length > 1 && objectEqual(hoverStack[hoverStack.length - 2], pos)) {
                let last = hoverStack.pop();
                last.box.className = "";
            }
            if (combinableStack(hoverStack, pos)) {
                box.className = "active";
                hoverStack.push(pos);
                // scoreToAdd = calculateScoreToAdd(hoverStack);
                // console.log(scoreToAdd)
                // displayScore()
            }
            scoreToAdd = calculateScoreToAdd(hoverStack);
            displayScore()
        }
    });
}

function findBox(playField, ev) {
		let curpos = {x: ev.touches[0].clientX, y: ev.touches[0].clientY};

		// find right box
		let boxes = playField.querySelectorAll("play-box");
		for(let box of boxes) {
			let rect = box.getBoundingClientRect();
			if(inRect(curpos, rect)) {
				return box;
			}
		}
	return null;
}

function initGlobalEventListeners() {
	document.addEventListener("mouseup", function (e) {
		console.log("hoverStack", hoverStack);

		for (let pos of hoverStack) {
			pos.box.className = "";
		}
		combine(hoverStack);
		repaint();
		hoverStack = [];
		if (!checkSolvable()) {
			setLost();
		}
	});

	let playField = document.querySelector("play-field");

	playField.addEventListener("touchstart", function(ev) {
		let box = findBox(playField, ev);
		if(box) {
				box.dispatchEvent(new CustomEvent("mousedown"));
		}
	});
	playField.addEventListener("touchmove", function(ev) {
		let box = findBox(playField, ev);
		if(box) {
				box.dispatchEvent(new CustomEvent("mousemove"));
		}
	});
	playField.addEventListener("touchend", function(ev) {
		document.dispatchEvent(new CustomEvent("mouseup"));
	});
}
/////////////////////////////
// Painting

function setLost() {
    document.querySelector("body").className = "lost";
}

function paintBox(grid, index, el) {
    el.className = "";
    el.innerHTML = grid[index];
}

function display(el, grid) {
    if (el.children.length == 0) {
        for (let index = 0; index < grid.length; index++) {
            let box = document.createElement("play-box");
            paintBox(grid, index, box);
            initBox(box, {x: index % WIDTH, y: Math.floor(index / WIDTH), index, box});
            el.appendChild(box);
        }
    } else {
        for (let index = 0; index < grid.length; index++) {
            let box = el.children[index];
            paintBox(grid, index, box);
        }
    }
	displayScore();
}

function displayScore() {
    const scoreElement = document.querySelector("score");
    const scoreAddElement = document.querySelector("score-to-add");

    scoreElement.innerHTML = `${score}`;
    scoreAddElement.innerHTML = (scoreToAdd !== 0) ? ` +${scoreToAdd}` : '';
}

function playSound() {
	if(document.querySelector("input").checked) {
		var audio = new Audio('unbenannt.mp3');
		audio.play();
	}
}

function initSound() {
	if(window.localStorage.getItem("sound")=="enabled") {
		document.querySelector("input").checked = true;
	} else {
		document.querySelector("input").checked = false;
	}

	document.querySelector("input").addEventListener("change", function(ev) {
		console.log("EV",ev);
		window.localStorage.setItem("sound",ev.target.checked?"enabled":"disabled");
	});
}

function repaint() {
  display(document.querySelector("play-field"), grid);
	displayScore()
}


function initStyle() {
	document.documentElement.style.setProperty('--play-field-dimension', WIDTH.toString());
}

initStyle();
initSound();
initGrid(WIDTH, WIDTH);
repaint();
initGlobalEventListeners();
