let N = 1600; // number of input samples
let path = null, svg, viewbox;
let drawings = [{name: 'clef', s: 1},
				{name: 'fourier', s: 1},
				{name: 'pi', s: 1},
				{name: 'treble-clef', s: 20}]
let ind = 2;

async function preload() {
	svg = await fetch("https://raw.githubusercontent.com/pabloqb2000/js-fourier_visualization/gh-pages/svg/" + drawings[ind].name + ".svg")
	.then(response => response.text())
	.then(text => (new DOMParser).parseFromString(text, "image/svg+xml"))
	.then(svg => svg.documentElement);

	path = svg.querySelector("path");
}

function setup() {
	textFont("Orbitron");
	createCanvas(windowWidth, windowHeight);
	background(32);

	// Create UI elements

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
	scale(1,1);
	
	if(path != null) {
		noFill();
		stroke(230);
		strokeWeight(2);
		beginShape();
		for(let i = 0; i < N; i++) {
			let z = pathPt(i/N);
			vertex(z.r, z.i);
		}
		endShape();
		strokeWeight(5);
		stroke(255, 0, 0);
		//let i = frameCount % P.length;
		//point(P[i][0]*drawings[ind].s, P[i][1]*drawings[ind].s);
	}
}

/**
 * Returns the coordinates of the path
 * at the corresponding length t
 */
function pathPt(t) {
	viewbox = svg.viewBox.baseVal;
	const {x, y} = path.getPointAtLength(t * path.getTotalLength());
	return new Complex([x - viewbox.width/2, y - viewbox.height/2]).mult(drawings[ind].s);
}
