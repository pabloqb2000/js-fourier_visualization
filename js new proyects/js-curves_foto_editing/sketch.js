let addBtn, extremesLimit, resetBtn, imgBox, saveBtn;
let interpBox;
let points = [];
let origImg;
let imgUpdater;
let interpolation;

let imagesRefs = [
	'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/1955134/pexels-photo-1955134.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/533923/pexels-photo-533923.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
	'https://images.pexels.com/photos/351448/pexels-photo-351448.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
];
let usrImgs = 0;
let imagesNames = ["Views", "Lake", "Rock", "Road", "Beach", "Snowy"];

function setup() {
	textFont("Orbitron");
	let c = createCanvas(windowWidth, windowHeight);
	background(32);

	//Create image updaer
	imgUpdater = new ImageUpdater(imagesRefs);

	// Create UI elements
	addBtn = new Button(0,0, width/16, height/30, "Add img", () => navigator.clipboard.readText().then(txt => addImg(txt)));
	extremesLimit = new ToggleButton(0,0,width/16,height/30,"Limits", resetIndex, true);
	saveBtn = new Button(0,0, width/16, height/30, "Save", () => imgUpdater.save());
	resetBtn = new Button(0,0, width/16, height/30, "Reset", resetPnts);
	imgBox = new OptionsBox(imagesNames, height/30, () => imgUpdater.startImg(imgBox.selectedIndex()));
	interpBox = new OptionsBox(["Spline", "Linear", "Poly", "0s spline", "1s spline"], height/30, updateInterp, width/6, height/2 + width/6 + 20);
	
	// Add extreme points
	points.push(new DragCircleConst(createVector(0,0), 4, resetIndex));
	points.push(new DragCircleConst(createVector(width/3,width/3), 4, resetIndex));

	// Create default interpolation
	updateInterp();

	// Start UI
	UI.tableWidth = 2;
	UI.tableHeight = 100;
	UI.widthMargin = width/100;
	UI.distrubute();
}

function draw() {
	// Draw UI and draggable elements
	background(32);
	UI.update();
	UI.draw();
	
	// Build parameters for the interpolation
	interpolation.build();

	// Draw curves
	translate(width/6, height/2 + width/6);
	scale(1,-1);
	strokeJoin(ROUND);
		// Draw grid
	drawGrid();
		// Plot function
	plot(getInterpolation);

	// Draw draggable elements
	noStroke();
	Drag.update();
	Drag.draw();

	// Draw result
	translate(5/12*width, 0);
		// Draw gradient
	drawGradient(getInterpolation);
		// Display img
	scale(1,-1);
	imgUpdater.updateImg(getInterpolation);
	imgUpdater.drawImg();
}

function drawGrid() {
	let l = width/3;
	noFill();

	// lines
	strokeWeight(0.5);
	stroke(180);
	for(let i = 1; i < 4; i++) {
		line(i*l/4, 0, i*l/4, l);
		line(0, i*l/4, l, i*l/4);
	}

	// Big rect
	strokeWeight(1);
	stroke(230);
	rect(0,0, l, l);
}

/**
 * Plot the viven function, function f should be:
 * 		f: R -> R
 * The parameter step determines how smooth should the plot be
 * 
 * @param f Real value function to plot
 */
function plot(f, step=3) {
	let l = width/3;

	noFill();
	stroke(86, 210, 227);
	strokeWeight(1);

	beginShape();
	for(let x=0; x <= 1; x += step/l){
		vertex(x*l, f(x)*l);
	}
	endShape();
}

/**
 * Draws the result gradient of the given function
 */
function drawGradient(f) {
	let l = width/3/256;
	let margin = 40;

	noStroke();
	fill(230);
	rect(-3, -3 - margin, width/3 + 6 + l, 26, 2);
	fill(30);
	rect(-1, -1 - margin, width/3 + 2 + l, 22);
	for(let i = 0; i < 256; i++) {
		fill(f(i/255)*255);
		rect(l*i, -margin, 2*l, 20);
	}
}

/**
 * Adds an image to the select img box
 * 
 * @param t Url of the image to add
 */
function addImg(t) {
	if(t != null && t.length > 7 && t.match("https?://.+\.jpeg|\.jpg|\.png.*") != null) {
		loadImage(t, (img) => {
			// If succeded loading the image
			usrImgs++;
			imgBox.options.push("Img " + usrImgs.toString());
			imgUpdater.imgList.push(t);	
			imgBox.selected = imgBox.options[imgBox.options.length - 1];
			imgBox.onChange();		
		}); 
	} else {
		alert("To add an image copy the URL of an image from internet and click the Add image button, URL should start by http / https and should reference a jpg / png image")
	} 
}

/**
 * Reset the points in the array
 */
function resetPnts() {
	points = [];
	Drag.elements = [];
	points.push(new DragCircleConst(createVector(0,0), 4, resetIndex));
	points.push(new DragCircleConst(createVector(width/3,width/3), 4, resetIndex));
	resetIndex();
}

/**
 * Reset the index of the img updater
 */
function resetIndex() {
	imgUpdater.resetIndex();
}
