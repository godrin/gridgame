const grid = [];
const WIDTH = 4;
const MAX_LENGTH = 100;
let hoverStack = [];
//oldClick;
let score = 0;

function generateNew() {
		let r = Math.floor(Math.random()*3);
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

		if(!combinableByIndex(pos0.index, pos1.index)) {
				console.log("CANCELLED - different value");
				return false;
		}
		return true;
}

// game logic

function checkSolvable() {
		for(let x=0; x<WIDTH-1; x++) {
				for(let y=0; y<WIDTH-1; y++) {
						let i = x + y * WIDTH;
						if(combinableByIndex(i, i+1) || combinableByIndex(i, i + WIDTH)) {
								console.log("COMBINABLE", x,y);
								return true;
						}
				}
		}
		return false;
}

// pos0 = {x:2, y:3, index:20}
function combine(posStack) {
		if(posStack.length<2) {
				return;
		}
		// spiel mechanik
		for(let pos of posStack.slice(0,-1)) {
				grid[pos.index] = generateNew();
		}
		let lastPos = posStack[posStack.length-1];
		let baseExp = Math.log(grid[lastPos.index]) / Math.log(2);

		score += grid[lastPos.index] = Math.pow(2,baseExp + posStack.length-1);
}

function objectEqual(a, b) {
		return JSON.stringify(a) == JSON.stringify(b);
}
function arrayContains(array, needle) {
		let index = array.find(function(e) { return objectEqual(e, needle); });
		return !!index;
}

function combinableStack(hoverStack, pos) {
		if(arrayContains(hoverStack, pos)) {
				return false;
		}
		return checkCombinable(hoverStack[hoverStack.length-1], pos);
}


function lost() {
		document.querySelector("body").className = "lost";
}

// framework
function initBox(box, pos) {
		box.addEventListener("mousedown", function (e) {
				box.className = "active";
				hoverStack = [pos];
		});
		box.addEventListener("mousemove", function (e) {
				if(hoverStack.length>0 && hoverStack.length<MAX_LENGTH) {
						if(hoverStack.length>1 && objectEqual(hoverStack[hoverStack.length-2], pos)) {
								var last = hoverStack.pop();
								last.box.className = "";
						}
						if(combinableStack(hoverStack, pos)) {
								box.className = "active";
								hoverStack.push(pos);
						}
				}
		});
}

function setLost() {
		document.querySelector("body").className="lost";
}
document.addEventListener("mouseup", function (e) {
		console.log("hoverStack", hoverStack);

		for(let pos of hoverStack) {
				pos.box.className = "";
		}
		combine(hoverStack);
		repaint();
		hoverStack = [];
    if(!checkSolvable()) {
				setLost();
		}
});

function paintBox(grid, index, el) {
		el.className = "";
		el.innerHTML = grid[index];
}

function display(el, grid) {
		if(el.children.length == 0) {
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
}

function displayScore(el, score) {
		el.innerHTML = score;
}

function repaint() {
		display(document.querySelector("play-field"), grid);
		displayScore(document.querySelector("score"), score);
}


function initStyle() {
	document.documentElement.style.setProperty('--play-field-dimension', WIDTH.toString());
}

initStyle();
initGrid(WIDTH, WIDTH);
repaint();
