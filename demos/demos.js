var initId = 0;
var world = createWorld();
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;

function setupWorld(did) {
	if (!did) did = 0;
	world = createWorld();
	initId += did;
	initId %= demos.InitWorlds.length;
	if (initId < 0) initId = demos.InitWorlds.length + initId;
	demos.InitWorlds[initId](world);
}
function setupNextWorld() { setupWorld(1); }
function setupPrevWorld() { setupWorld(-1); }
function step(cnt) {
	var stepping = false;
	var timeStep = 1.0/60;
	var iteration = 1;
	world.Step(timeStep, iteration);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	drawWorld(world, ctx);
	setTimeout('step(' + (cnt || 0) + ')', 10);
}
jQuery(window).bind('load', function() {
	setupWorld();
	ctx = jQuery('canvas')[0].getContext('2d');
	var canvasElm = jQuery('canvas')[0];
	canvasWidth = parseInt(canvasElm.width);
	canvasHeight = parseInt(canvasElm.height);
	canvasLeft = jQuery('canvas').offset().left;
	canvasTop = jQuery('canvas').offset().top;
	jQuery('canvas').bind('click', function(e) {
		if (Math.random() < 0.5) 
			demos.top.createBall(world, e.offsetX, e.offsetY);
		else 
			createBox(world, e.offsetX, e.offsetY, 10, 10, false);
	});
	jQuery('canvas').bind('contextmenu', function(e) {
		if (e.preventDefault) e.preventDefault();
		setupPrevWorld();
		return false;
	});
	step();
});
