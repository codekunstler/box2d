function drawWorld(world, context) {
	for (var j = world.m_jointList; j; j = j.m_next) {
		drawJoint(j, context);
	}
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			drawShape(s, context);
		}
	}
}
function drawJoint(joint, context) {
	var b1 = joint.m_body1;
	var b2 = joint.m_body2;
	var x1 = b1.m_position;
	var x2 = b2.m_position;
	var p1 = joint.GetAnchor1();
	var p2 = joint.GetAnchor2();
	context.strokeStyle = '#FF0000';
	context.beginPath();
	switch (joint.m_type) {
	case b2Joint.e_distanceJoint:
		context.moveTo(p1.x, p1.y);
		context.lineTo(p2.x, p2.y);
		break;

	case b2Joint.e_pulleyJoint:
		// TODO
		break;

	default:
		if (b1 == world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.lineTo(x2.x, x2.y);
		}
		else if (b2 == world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.lineTo(x1.x, x1.y);
		}
		else {
			context.moveTo(x1.x, x1.y);
			context.lineTo(p1.x, p1.y);
			context.lineTo(x2.x, x2.y);
			context.lineTo(p2.x, p2.y);
		}
		break;
	}
	context.stroke();
}
function drawShape(shape, context) {
	context.strokeStyle = '#000000';
	context.beginPath();
	switch (shape.m_type) {
	case b2Shape.e_circleShape:
		{
			var circle = shape;
			var pos = circle.m_position;
			var r = circle.m_radius;
			var segments = 16.0;
			var theta = 0.0;
			var dtheta = 2.0 * Math.PI / segments;
			// draw circle
			context.moveTo(pos.x + r, pos.y);
			for (var i = 0; i < segments; i++) {
				var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
				var v = b2Math.AddVV(pos, d);
				context.lineTo(v.x, v.y);
				theta += dtheta;
			}
			context.lineTo(pos.x + r, pos.y);
	
			// draw radius
			context.moveTo(pos.x, pos.y);
			var ax = circle.m_R.col1;
			var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
			context.lineTo(pos2.x, pos2.y);
		}
		break;
	case b2Shape.e_polyShape:
		{
			var poly = shape;
			var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
			context.moveTo(tV.x, tV.y);
			for (var i = 0; i < poly.m_vertexCount; i++) {
				var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				context.lineTo(v.x, v.y);
			}
			context.lineTo(tV.x, tV.y);
		}
		break;
	}
	context.stroke();
}
function createWorld() {
	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set(-1000, -1000);
	worldAABB.maxVertex.Set(1000, 1000);
	var gravity = new b2Vec2(0, 100);
	var doSleep = true;
	var world = new b2World(worldAABB, gravity, doSleep);
	createGround(world);
	createBox(world, -11, 125, 10, 250);
	createBox(world, 511, 125, 10, 250);
	return world;
}
function createGround(world) {
	var groundSd = new b2BoxDef();
	groundSd.extents.Set(1000, 50);
	groundSd.restitution = 0.2;
	var groundBd = new b2BodyDef();
	groundBd.AddShape(groundSd);
	groundBd.position.Set(-500, 351);
	return world.CreateBody(groundBd)
}
function createBall(world, x, y) {
	var ballSd = new b2CircleDef();
	ballSd.density = 1.0;
	ballSd.radius = 20;
	ballSd.restitution = 1.0;
	ballSd.friction = 0;
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	ballBd.position.Set(x,y);
	return world.CreateBody(ballBd);
}
function createBox(world, x, y, width, height, fixed) {
	if (typeof(fixed) == 'undefined') fixed = true;
	var boxSd = new b2BoxDef();
	if (!fixed) boxSd.density = 1.0;
	boxSd.extents.Set(width, height);
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);
	return world.CreateBody(boxBd)
}
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
var demos = {};
demos.InitWorlds = [];
demos.top = {};
demos.top.createBall = function(world, x, y, rad, fixed) {
	var ballSd = new b2CircleDef();
	if (!fixed) ballSd.density = 1.0;
	ballSd.radius = rad || 10;
	ballSd.restitution = 0.2;
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	ballBd.position.Set(x,y);
	return world.CreateBody(ballBd);
};
demos.top.createPoly = function(world, x, y, points, fixed) {
	var polySd = new b2PolyDef();
	if (!fixed) polySd.density = 1.0;
	polySd.vertexCount = points.length;
	for (var i = 0; i < points.length; i++) {
		polySd.vertices[i].Set(points[i][0], points[i][1]);
	}
	var polyBd = new b2BodyDef();
	polyBd.AddShape(polySd);
	polyBd.position.Set(x,y);
	return world.CreateBody(polyBd)
};
demos.top.initWorld = function(world) {
	demos.top.createBall(world, 350, 100, 50, true);
	demos.top.createPoly(world, 100, 100, [[0, 0], [10, 30], [-10, 30]], true);
	demos.top.createPoly(world, 150, 150, [[0, 0], [10, 30], [-10, 30]], true);
	var pendulum = createBox(world, 150, 100, 20, 20, false);
	var jointDef = new b2RevoluteJointDef();
	jointDef.body1 = pendulum;
	jointDef.body2 = world.GetGroundBody();
	jointDef.anchorPoint = pendulum.GetCenterPosition();
	world.CreateJoint(jointDef);

	var seesaw = demos.top.createPoly(world, 300, 200, [[0, 0], [100, 30], [-100, 30]]);
	jointDef.body1 = seesaw;
	jointDef.anchorPoint = seesaw.GetCenterPosition();
	world.CreateJoint(jointDef);
};
demos.InitWorlds.push(demos.top.initWorld);
demos.stack = {};
demos.stack.initWorld = function(world) {
	var sd = new b2BoxDef();
	var bd = new b2BodyDef();
	bd.AddShape(sd);
	sd.density = 1.0;
	sd.friction = 0.5;
	sd.extents.Set(10, 10);

	var i;
	for (i = 0; i < 8; i++) {
		bd.position.Set(500/2-Math.random()*2-1, (250-5-i*22));
		world.CreateBody(bd);
	}
	for (i = 0; i < 8; i++) {
		bd.position.Set(500/2-100-Math.random()*5+i, (250-5-i*22));
		world.CreateBody(bd);
	}
	for (i = 0; i < 8; i++) {
		bd.position.Set(500/2+100+Math.random()*5-i, (250-5-i*22));
		world.CreateBody(bd);
	}
}
demos.InitWorlds.push(demos.stack.initWorld);
demos.compound = {};
demos.compound.createCompoundBall = function(world, x, y) {
	var ballSd1 = new b2CircleDef();
	ballSd1.density = 1.0;
	ballSd1.radius = 20;
	ballSd1.restitution = 0.2;
	ballSd1.localPosition.Set(-20, 0);
	var ballSd2 = new b2CircleDef();
	ballSd2.density = 1.0;
	ballSd2.radius = 20;
	ballSd2.restitution = 0.2;
	ballSd2.localPosition.Set(20, 0);
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd1);
	ballBd.AddShape(ballSd2);
	ballBd.position.Set(x, y);
	return world.CreateBody(ballBd);
}
demos.compound.createCompoundPoly = function(world, x, y) {
	var points = [[-30, 0], [30, 0], [0, 15]];
	var polySd1 = new b2PolyDef();
	polySd1.vertexCount = points.length;
	for (var i = 0; i < points.length; i++) {
		polySd1.vertices[i].Set(points[i][0], points[i][1]);
	}
	polySd1.localRotation = 0.3524 * Math.PI;
	var R1 = new b2Mat22(polySd1.localRotation);
	polySd1.localPosition = b2Math.b2MulMV(R1, new b2Vec2(30, 0));
	polySd1.density = 1.0;
	var polySd2 = new b2PolyDef();
	polySd2.vertexCount = points.length;
	for (var i = 0; i < points.length; i++) {
		polySd2.vertices[i].Set(points[i][0], points[i][1]);
	}
	polySd2.localRotation = -0.3524 * Math.PI;
	var R2 = new b2Mat22(polySd2.localRotation);
	polySd2.localPosition = b2Math.b2MulMV(R2, new b2Vec2(-30, 0));
	var polyBd = new b2BodyDef();
	polyBd.AddShape(polySd1);
	polyBd.AddShape(polySd2);
	polyBd.position.Set(x,y);
	return world.CreateBody(polyBd)
}
demos.compound.initWorld = function(world) {
	var i;
	for (i = 1; i <= 4; i++) {
		demos.compound.createCompoundPoly(world, 150 + 3 * Math.random(), 40 * i);
	}
	for (i = 1; i <= 4; i++) {
		demos.compound.createCompoundBall(world, 350 + 3 * Math.random(), 45 * i);
	}
}
demos.InitWorlds.push(demos.compound.initWorld);
demos.pendulum = {};
demos.pendulum.initWorld = function(world) {
	var i;
	var ground = world.GetGroundBody();
	var jointDef = new b2RevoluteJointDef();
	var L = 150;
	for (i = 0; i < 4; i++) {
		jointDef.anchorPoint.Set(250 + 40 * i, 200 - L);
		jointDef.body1 = ground;
		jointDef.body2 = createBall(world, 250 + 40 * i, 200);
		world.CreateJoint(jointDef);
	}
	jointDef.anchorPoint.Set(250 - 40, 200 - L);
	jointDef.body1 = ground;
	jointDef.body2 = createBall(world, 250 - 40 - L, 200 - L);
	world.CreateJoint(jointDef);
}
demos.InitWorlds.push(demos.pendulum.initWorld);
demos.crank = {};
demos.crank.initWorld = function(world) {
	var ground = world.m_groundBody;

	// Define crank.
	var sd = new b2BoxDef();
	sd.extents.Set(5, 25);
	sd.density = 1.0;

	var bd = new b2BodyDef();
	bd.AddShape(sd);
	
	var rjd = new b2RevoluteJointDef();

	var prevBody = ground;

	bd.position.Set(500/2, 210);
	var body = world.CreateBody(bd);

	rjd.anchorPoint.Set(500/2, 235);
	rjd.body1 = prevBody;
	rjd.body2 = body;
	rjd.motorSpeed = -1.0 * Math.PI;
	rjd.motorTorque = 500000000.0;
	rjd.enableMotor = true;
	world.CreateJoint(rjd);

	prevBody = body;

	// Define follower.
	sd.extents.Set(5, 45);
	bd.position.Set(500/2, 140);
	body = world.CreateBody(bd);

	rjd.anchorPoint.Set(500/2, 185);
	rjd.body1 = prevBody;
	rjd.body2 = body;
	rjd.enableMotor = false;
	world.CreateJoint(rjd);

	prevBody = body;

	// Define piston
	sd.extents.Set(20, 20);
	bd.position.Set(500/2, 95);
	body = world.CreateBody(bd);

	rjd.anchorPoint.Set(500/2, 95);
	rjd.body1 = prevBody;
	rjd.body2 = body;
	world.CreateJoint(rjd);

	var pjd = new b2PrismaticJointDef();
	pjd.anchorPoint.Set(500/2, 95);
	pjd.body1 = ground;
	pjd.body2 = body;
	pjd.axis.Set(0.0, 1.0);
	pjd.motorSpeed = 0.0; // joint friction
	pjd.motorForce = 100000.0;
	pjd.enableMotor = true;

	world.CreateJoint(pjd);

	// Create a payload
	sd.density = 2.0;
	bd.position.Set(500/2, 10);
	world.CreateBody(bd);
}
demos.InitWorlds.push(demos.crank.initWorld);
var initId = 0;
var world = createWorld();
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;

setupWorld();

ctx = document.getElementById("canvas").getContext('2d');
var canvasElm = document.getElementById("canvas");
var bodyOffsets =document.getElementById("canvas").getBoundingClientRect();
canvasWidth = parseInt(canvasElm.width);
canvasHeight = parseInt(canvasElm.height);
canvasLeft = bodyOffsets.left;
canvasTop = bodyOffsets.top;
document.getElementById("canvas").onclick = function (e){
	if (Math.random() < 0.5) {
		demos.top.createBall(world, e.layerX, e.layerY);
	} else { 
		createBox(world, e.layerX, e.layerY, 10, 10, false);
	}
}
document.getElementById("canvas").oncontextmenu = function(e){
	if (e.preventDefault) e.preventDefault();
	setupPrevWorld();
	return false;
};
step();


