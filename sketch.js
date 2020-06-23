let N = 600; // number of input samples
let path = null, svg, viewbox, done=false;
let drawings = [{name: 'clef', s: 1},
				{name: 'fourier', s: 1},
				{name: 'pi', s: 1},
				{name: 'treble-clef', s: 20}]
let ind = 2;
let circlesSld, speedSld, showBtn;
let circles = [];
let drawn = [];

async function preload() {
	svg = await fetch("https://raw.githubusercontent.com/pabloqb2000/js-fourier_visualization/gh-pages/svg/" + drawings[ind].name + ".svg")
	.then(response => response.text())
	.then(text => (new DOMParser).parseFromString(text, "image/svg+xml"))
	.then(svg => svg.documentElement);

	path = svg.querySelector("path");

	done=true;
}

function setup() {
	textFont("Orbitron");
	createCanvas(windowWidth, windowHeight);
	background(32);

	// Create UI elements
	circlesSld = new Slider(1, 15, 13, 0,0, width/12, height/60, 1, "Circles", true, 0, restart)
	speedSld   = new Slider(0.1, 2, 1, 0,0, width/12, height/60, null, "Speed", false);
	showBtn = new ToggleButton(0,0, width/12, height/30, "Circles", null, true);

	// Start UI
	UI.tableWidth = 1;
	UI.tableHeight = 100;
	UI.distrubute();
}

function draw() {
	// Draw UI and draggable elements
	background(32);
	UI.update();
	UI.draw();
	
	translate(13/24*width, height/2);
	text(frameRate().toFixed(2), 0, height/2.5)
	
	if(circles.length != 0) {
		noFill();
		strokeWeight(1);
		stroke(128);
		push();
		let sum = new Complex();
		for(let c of circles) {
			c.update();
			sum.add(c.draw(sum));
		}
		pop();

		drawn.push(sum);
		if(drawn.length > N)
			drawn.splice(0,1);

		strokeWeight(2);
		strokeCap(SQUARE);
		for(let i = 1; i < drawn.length; i++) {
			stroke(230, sqrt(i/N) * 255);
			let z0 = drawn[i-1];
			let z1 = drawn[i];
			line(z0.r, z0.i, z1.r, z1.i);
		}

	} else if (done) {
		restart();
	}
}

/**
 * Reset all the circles and restart drawing the path
 */
function restart() {
	circles = [];
	drawn = [];
	for(let i = 0; i < circlesSld.value; i++) {
		let f = ceil(i/2)*(-1)**i;
		circles.push(new Circle(f));
	}
}

/**
 * Returns the coordinates of the path
 * at the corresponding length t
 */
function pathPt(t) {
	viewbox = svg.viewBox.baseVal;
	const {x, y} = path.getPointAtLength(t * path.getTotalLength());
	return new Complex(x - viewbox.width/2, y - viewbox.height/2).mult(height/viewbox.height/1.5);
}
