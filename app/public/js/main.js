// Shorthand document
var doc = document;

// Declare vars
var view = doc.getElementById('view');
var rota = doc.getElementById('rota');

var display = doc.getElementById('turn-display').childNodes[1];
var hulk = doc.getElementById('hulk');

// Prevent scrolling and unwanted movement
view.addEventListener('touchstart',function(e){	e.preventDefault(); });

// Add event listeners
rota.addEventListener('touchstart',onTouchStart);
rota.addEventListener('touchmove',onTouchMove);
rota.addEventListener('touchend',onTouchEnd);


// Logic
var start = [{x:0,y:0},{x:0,y:0}];//{x:0,y:0};
var move = [{x:0,y:0},{x:0,y:0}];//{x:0,y:0};
var delta = {x:0,y:0};

var angle = 0;
var lastAngle = 0;

var start_time, end_time;

var is_gesture = false;

// Handlers
function onTouchStart(e){
	
	var ets = e.touches;

	start[0]['x'] = ets[0].clientX;
	start[0]['y'] = ets[0].clientY;

	if(ets.length === 1){

		is_gesture = false;
		hulk.style.cssText = '-webkit-transform:scale(0.9);';
		$(view).prepend('<div id="hulk-mini"></div>');

	}else if(ets.length === 2){
		
		is_gesture = true;

		start_time = new Date();

		start[1]['x'] = ets[1].clientX;
		start[1]['y'] = ets[1].clientY;	
	}
};

function onTouchMove(e){

	// Store movement positions
	move[0]['x'] = e.touches[0].clientX;
	move[0]['y'] = e.touches[0].clientY;

	if(is_gesture){

		move[1]['x'] = e.touches[1].clientX;
		move[1]['y'] = e.touches[1].clientY;

		// Fetch angle calc
		angle = calculateRotation(start,move) + lastAngle;
	}else{
		angle = getAngle(move[0],start[0]) + lastAngle;
	}
	
	// Update UI
	rota.style.cssText = '-webkit-transform:rotate('+angle+'deg);';
};

function onTouchEnd(e){

	// Set previous angle to prevent jump-back
	lastAngle = angle;
	var newDegree = lastAngle;

	end_time = new Date();

	var turn_time = 333;
	if((end_time-start_time) > 290){
		turn_time = 0;
	}else{
		newDegree += 360;
	}
	

	$(rota).animate({'rotate':(newDegree)+'deg'},turn_time);


	// Update display
	var displayAngle = Math.abs(lastAngle);
	if(displayAngle > 360){ displayAngle -= 360; }
	display.innerHTML = Math.floor(displayAngle)+' degrees';

	hulk.style.cssText = '-webkit-transform:scale(0);';
	$('#hulk-mini').remove();

};


// Via hammer.js
function calculateRotation(pos_start, pos_move){
	if(pos_start.length == 2 && pos_move.length == 2) {
	    var start_rotation = getAngle(pos_start[1], pos_start[0]);
	    var end_rotation = getAngle(pos_move[1], pos_move[0]);
	    return end_rotation - start_rotation;
	}
	return 0;
}
function getAngle( pos1, pos2 ){
	return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * 180 / Math.PI;
}