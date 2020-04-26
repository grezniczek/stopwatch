
var	stopwatch = function() {
	
	// Private vars
	var startAt = 0; // Time of last start / resume (0 if not already running)
	var elapsedTime	= 0;
	var lap_count = 0;
	var max_laps = 10; // maximum number of laps (to be set by user)
	var lap = new Array(max_laps).fill(0);

	var	now	= function() {
		return (new Date()).getTime(); // captures current time value in milliseconds
	};
 
	/* Public methods */
		
	// Start or resume
	this.start = function() {
		startAt = startAt ? startAt : now();
	};
		
	// Duration
	this.time = function() {
		return elapsedTime + (startAt ? now() - startAt : 0);
	};

	// Stop timer
	this.stop = function() {
		elapsedTime = startAt ? elapsedTime + now() - startAt : elapsedTime;
		startAt = 0; // resets startAt so that timer does not continue
	};

	// Boolean to check if startTime is zero
	this.started = function() {
		return this.startTime == 0 ? false : true;
	};

	// Capture time for multiple laps
	this.capture = function() {
		capturedTime = startAt ? elapsedTime + now() - startAt : elapsedTime;
			if (lap[lap_count] == 0) {
				lap[lap_count] = capturedTime;
			}
		lap_count += 1; // increase lap count by one after each assignment
		return lap;
	};

	// Reset all variables
	this.reset = function() {
		elapsedTime = capturedTime = startAt = lap_count = 0;
		lap.fill(0);
	};

	// Capture number of laps counted
	this.lapCount = function() {
		return lap_count;	
	}

	// Capture lap times
	this.lap = function() {
		return lap[lap_count];
	};

	// Capture first lap time
	this.lap1 = function() {
		return lap[0];
	};

	// Capture second lap time
	this.lap2 = function() {
		return lap[1];
	};
			
	// Capture third lap time
	this.lap3 = function() {
		return lap[2];
	};
						
	// Capture fourth lap time
	this.lap4 = function() {
		return lap[3];
	};
						
	// Capture fifth lap time
	this.lap5 = function() {
		return lap[4];
	};

	// Capture sixth lap time
	this.lap6 = function() {
		return lap[5];
	};

	// Capture seventh lap time
	this.lap7 = function() {
		return lap[6];
	};

	// Capture eigth lap time
	this.lap8 = function() {
		return lap[7];
	};

	// Capture ninth lap time
	this.lap9 = function() {
		return lap[8];
	};

	// Capture tenth lap time
	this.lap10 = function() {
		return lap[9];
	};
			 
};

var x = new stopwatch();
var $time;
var $lap1 = '';
var $lap2 = '';
var $lap3 = '';
var $lap4 = '';
var $lap5 = '';
var $lap6 = '';
var $lap7 = '';
var $lap8 = '';
var $lap9 = '';
var $lap10 = '';
var clocktimer;
var max = x.maxLaps();
var count = x.lapCount();
var lapId = 0; // used by the addLap() function to keep track of IDs

function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}

function formatTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';

	h = Math.floor( time / (60 * 60 * 1000) );
	time = time % (60 * 60 * 1000);
	m = Math.floor( time / (60 * 1000) );
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;

	newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
	return newTime;
}

function show() {
	$time = document.getElementById('time');
	$lap1 = document.getElementById('lap1');
	$lap2 = document.getElementById('lap2');
	$lap3 = document.getElementById('lap3');
	$lap4 = document.getElementById('lap4');
	$lap5 = document.getElementById('lap5');
	$lap6 = document.getElementById('lap6');
	$lap7 = document.getElementById('lap7');
	$lap8 = document.getElementById('lap8');
	$lap9 = document.getElementById('lap9');
	$lap10 = document.getElementById('lap10');
	update();
}

function update() {
	$time.innerHTML = formatTime(x.time());
	$lap1.innerHTML = "Lap 1: " + formatTime(x.lap1());
	$lap2.innerHTML = "Lap 2: " + formatTime(x.lap2());
	$lap3.innerHTML = "Lap 3: " + formatTime(x.lap3());
	$lap4.innerHTML = "Lap 4: " + formatTime(x.lap4());
	$lap5.innerHTML = "Lap 5: " + formatTime(x.lap5());
	$lap6.innerHTML = "Lap 6: " + formatTime(x.lap6());
	$lap7.innerHTML = "Lap 7: " + formatTime(x.lap7());
	$lap8.innerHTML = "Lap 8: " + formatTime(x.lap8());
	$lap9.innerHTML = "Lap 9: " + formatTime(x.lap9());
	$lap10.innerHTML = "Lap 10: " + formatTime(x.lap10());
}

//function addLap() {
//	lapId++; // increment lapId to get a unique ID for each new element
//	var html = '<a href="" onclick="javascript:removeElement('Lap ' + lapId + ''); return false;">Remove</a>';
//	addElement('Lap', 'p', 'Lap' + lapId, innerHtml);
//}

function addElement(parentId, elementTag, elementId, innerHtml) {
	// Adds an element to the document
	var p = document.getElementById(parentId);
	var newElement = document.createElement(elementTag);
	newElement.setAttribute('id', elementId);
	newElement.innerHTML = innerHtml;
	p.appendChild(newElement);
}

function removeElement(elementId) {
	// Removes an element from the document
	var element = document.getElementById(elementId);
	element.parentNode.removeChild(element);
}

function onStart() {
	document.getElementById("start").removeEventListener("click", listener2, false);
	start();
	document.getElementById("capture").style.visibility = 'visible'; // show capture button
  	document.getElementById("start").innerHTML = "Stop & Capture";
  
	document.getElementById("start").addEventListener("click", listener1, false);
}

function listener1() {
	onCapture();
	onStop();
}

function listener2() {
	onStart();
}

function start() {
	clocktimer = setInterval("update()", 1); // set timer with 1 ms intervals
	x.start();
}

function stop() {
	x.stop();
	clearInterval(clocktimer);
	update();
}

function capture() {
	x.capture();
	//addLap();
	update();
}

 function onStop() {
	document.getElementById("start").removeEventListener("click", listener1, false);
	stop();
	document.getElementById("capture").style.visibility = 'hidden'; // hide capture button 
	document.getElementById("start").innerHTML = "Start";
	
	document.getElementById("start").addEventListener("click", listener2, false);
}

function onCapture() {
  capture();
  //if (count === (max - 1)) {
	//document.getElementById("capture").style.visibility = 'hidden'; // show capture button until last lap
  //}
}

function reset() {
	x.reset();
	update();
}