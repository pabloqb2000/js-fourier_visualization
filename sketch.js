var N = 1600 // number of input samples
let path;
let P;
let drawings = ['treble-clef']

let done=false;
async function preload() {
	//let svg = await fetch("https://gist.githubusercontent.com/mbostock/a4fd7a68925d4039c22996cc1d4862ce/raw/d813a42956d311d73fee336e1b5aac899c835883/fourier.svg")
	let svg = await fetch("https://raw.githubusercontent.com/pabloqb2000/js-fourier_visualization/gh-pages/svg/" + drawings[0] + ".svg")
	.then(response => response.text())
	.then(text => (new DOMParser).parseFromString(text, "image/svg+xml"))
	.then(svg => svg.documentElement);

	viewbox = svg.viewBox.baseVal

	let path2 = svg.querySelector("path")
    l = path2.getTotalLength()
    P = Array.from({length: N}, (_, i) => {
        const {x, y} = path2.getPointAtLength(i / N * l);
        return [x - viewbox.width / 2, y - viewbox.height / 2];
    })
	console.log(P);
	done=true;
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
	scale(1,-1);
	
	noFill();
	stroke(230);
	strokeWeight(2);
	beginShape();
	for(let p of P) {
		vertex(p[0]*20, p[1]*20);
	}
	endShape();
	strokeWeight(5);
	stroke(255, 0, 0);
	let i = frameCount % P.length;
	point(P[i][0]*20, P[i][1]*20);
}
