let N = 600; // number of input samples
let path = [], svg = [], done=false; // Svg variables
let drawings = [{name: 'clef', s: 1},
				{name: 'fourier', s: 1},
				{name: 'pi', s: 1},
				{name: 'treble-clef', s: 20}]; // Drawing parameters
let ind = 0; // Index of the last calculated circle
let dt = 0.5e-2; // dt to use in the aproximation of the integral

let circlesSld, speedSld, zoomSld, showBtn, followBtn; // UI
let circles = []; // Circles list
let drawn = []; // list of positions in the path being drawn

async function preload() {
	for(let d of drawings) {		
		let s = await fetch("https://raw.githubusercontent.com/pabloqb2000/js-fourier_visualization/gh-pages/svg/" + d.name + ".svg")
		.then(response => response.text())
		.then(text => (new DOMParser).parseFromString(text, "image/svg+xml"))
		.then(svg => svg.documentElement);
		svg.push(s);

		let p = s.querySelector("path");
		path.push(p);
	}

	restart();

	done=true;
}

function setup() {
	textFont("Orbitron");
	createCanvas(windowWidth, windowHeight);
	background(32);

	// Create UI elements
	circlesSld = new Slider(1, 200, 13, 0,0, width/12, height/60, 1, "Circles", true, 0, restart)
	speedSld   = new Slider(0.1, 3, 1, 0,0, width/12, height/60, null, "Speed", false);
	zoomSld    = new Slider(0.03, 10, 1,0,0, width/12, height/60, null, "Zoom");
	showBtn = new ToggleButton(0,0, width/12, height/30, "Circles", null, true);
	followBtn = new ToggleButton(0,0, width/12, height/30, "Follow");

	// Start UI
	UI.tableWidth = 1;
	UI.tableHeight = 100;
	UI.distrubute();
}

function draw() {
	// Draw UI elements
	background(32);
	UI.update();
	UI.draw();
	
	// Translate to the center
	translate(13/24*width, height/2);
	
	// Draw fps for debugging
	noStroke();
	fill(200);
	textAlign(CENTER);
	text(frameRate().toFixed(2) + " fps", 0, height/2.5);
	
	if(circles.length == circlesSld.value) {
		// Zoom
		scale(zoomSld.value, zoomSld.value);

		// Update the circles
		let sum = new Complex();
		for(let c of circles) {
			sum.add(c.update());
		}

		// Translate to the end if follow is active
		if(followBtn.active)
			translate(-sum.r, -sum.i);

		// Update the path
		drawn.push(sum);
		if(drawn.length > N)
			drawn.splice(0,1);

		// Draw the circles
		noFill();
		strokeWeight(1/zoomSld.value);
		stroke(128);
		sum = new Complex();
		for(let c of circles) {
			sum.add(c.draw(sum));
		}

		// Draw the path
		strokeWeight(2);
		strokeCap(SQUARE);
		for(let i = 1; i < drawn.length; i++) {
			stroke(86, 210, 227, sqrt(i/N) * 255);
			let z0 = drawn[i-1];
			let z1 = drawn[i];
			line(z0.r, z0.i, z1.r, z1.i);
		}

	} else if (done) {
		addCircle();
		drawProgressbar();
	} else {
		drawProgressbar();
	}
}

/**
 * Reset all the circles and restart drawing the path
 */
function restart() {
	circles = [];
	drawn = [];
	ind = 0;
}

/**
 * Calculate 1 more circles and add it to the list
 */
function addCircle() {
	let n = 1; // Number of circles to add
	if(ind < circlesSld.value) {
		for(let i = 0; i < min(n, circlesSld.value - ind); i++) {
			let f = ceil(ind/2)*(-1)**ind;
			circles.push(new Circle(f));
			ind++;
		}
	}
}

/**
 * Returns the coordinates of the path
 * at the corresponding length t
 */
function pathPt(t) {
	let n = 3;
	let viewbox = svg[n].viewBox.baseVal;
	const {x, y} = path[n].getPointAtLength(t * path[n].getTotalLength());
	return new Complex(x - viewbox.width/2, y - viewbox.height/2).mult(height/viewbox.height/1.5);
}

function drawProgressbar() {
	let load = ind / circlesSld.value;
	// Text
	let txt = "...";
	fill(230);
	noStroke();
	text("Loading " + txt.substr(0, floor((millis() % 2000)/500)), 0, 25);
	text((load * 100).toFixed(0) + " %", 0, -50);
	// Inner rectangle
	fill(227, 103, 86);
	rect(-width/10, -40, width/5*load, 30, 5);
	// Outside rectangle
	rectMode(CENTER);
	noFill();
	stroke(230);
	strokeWeight(2);
	rect(0, -25, width/5, 30, 5);
	rectMode(CORNER);
}
