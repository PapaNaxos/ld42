////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//function Part(css)
//{
//	css.position = "absolute";
//	this.node = $('<div class="part">').css(css);
//	this.kids = [];
//}

function Part(cls)
{
	this.node = $('<div>').addClass("part " + cls).data('part', this);
	this.kids = [];
	this.up = this;
}

Part.prototype = {
	addChild: function(child){
		this.kids.push(child);
		child.up = this;
		this.node.append( child.node );
		return child;
	},
	addNewChild: function( cls ){
		var child = new Part(cls);
		child.up = this;
		this.kids.push( child );
		this.node.append( child.node );
		return child;
	},
	setAnim: function( anim, timeOut ){
		var parts = this.node.find(".part").add(this.node);
		parts.addClass( anim );
		setTimeout(function(){ parts.removeClass( anim ); }, timeOut);
	}
};

function createChar()
{
	var dude = new Part("char")
		.addNewChild("head")
			.addNewChild("l_eye")
				.addNewChild("pupil").up
				.up
			.addNewChild("r_eye")
				.addNewChild("pupil").up
				.up
			.addNewChild("nose")
			.up
		.addNewChild("mouth").up
	return dude;
}

function createAnimButton(anim, time, text)
{
	return $('<button type="button" class="anim-btn">')
		.data("anim", anim)
		.data("time", time)
		.text(text);
}

function initMicListen()
{
	/* 
	 *	Pulled from:
	 *		https://raw.githubusercontent.com/mdn/voice-change-o-matic-float-data/gh-pages/scripts/app.js
	 * 	And edit to fit the purpose.
	*/
	navigator.getUserMedia = (navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia);

	// set up forked web audio context, for multiple browsers
	// window. is needed otherwise Safari explodes

	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var voiceSelect = document.getElementById("voice");
	var source;
	var stream;

	// grab the mute button to use below

	var mute = document.querySelector('.mute');

	//set up the different audio nodes we will use for the app

	var analyser = audioCtx.createAnalyser();
	analyser.minDecibels = -90;
	analyser.maxDecibels = -10;
	analyser.smoothingTimeConstant = 0.85;

	if (navigator.getUserMedia) {
		console.log('getUserMedia supported.');
		navigator.getUserMedia (
				// constraints - only audio needed for this app
				{
					audio: true
				},

				// Success callback
				function(stream) {
					source = audioCtx.createMediaStreamSource(stream);
					source.connect(analyser);

					visualize(analyser);
					//voiceChange();

				},

				// Error callback
				function(err) {
					console.log('The following gUM error occured: ' + err);
				}
		);
	} else {
		console.log('getUserMedia not supported on your browser!');
	}
	
}

var drawVisual;

var lastTime = 0;
function visualize(analyser) 
{
	//WIDTH = canvas.width;
	//HEIGHT = canvas.height;

	var mouth = gChar.node.find(".mouth");

	//var visualSetting = visualSelect.value;
	//console.log(visualSetting);

	analyser.fftSize = 1024;
	var bufferLength = analyser.fftSize;
	console.log(bufferLength);
	var dataArray = new Float32Array(bufferLength);

	function draw(time) {
		//var dTime = (time - lastTime) * 0.1;
		//console.log(dTime);
		//lastTime = time;
		drawVisual = requestAnimationFrame(draw);

		analyser.getFloatTimeDomainData(dataArray);

		var max = dataArray[0];
		for(var i = 0; i < bufferLength; i++) {
			if( dataArray[i] > max )
				max = dataArray[i];
			//barHeight = (dataArray[i] + 140)*2;
		}
		var currPos = parseFloat(mouth.css("top").replace('px',''));
		var targetPos = 53 + (max*300);

		if (targetPos < 51) targetPos = 51;
		else if (targetPos > 70) targetPos = 70; 
		if (currPos < 51) currPos = 51;
		else if (currPos > 70) currPos = 70; 

		//currPos = targetPos;
		if (targetPos > currPos)
			currPos = currPos + (targetPos - currPos) * 0.4;
			//currPos = (targetPos - currPos) * dTime;
		else
			currPos = currPos + (targetPos - currPos) * 0.8;
			//currPos = (targetPos - currPos) * dTime * 0.5;
			//

		var rot = max*-200;
		if ( rot > -2 ) rot = 0;
		if ( rot < -2 && rot > -8 ) rot = -8;
		if( rot < -45 ) rot = -45;
		if (mouth.hasClass('lookright'))
			rot *= -1;


		//mouth.css('top', 50 + (max*100) + "px");
		mouth.css({
			//'top': currPos + 'px',
			WebkitTransform: 'rotate('+rot+'deg)'
		});

		//console.log(Math.floor(max*100));
	};

	draw();
}

function initRandomAnims()
{
	var anim = function()
	{
		var list = [
			{name: "blink", len: 500},
			{name: "lookright", len: 3000},
			{name: "tilt", len: 3000}
		];

		//choose anim and apply
		var r = Math.floor(Math.random() * 10 * (list.length + 1));
		r = r % (list.length + 1);
		if ( r < list.length )
			gChar.setAnim( list[r].name, list[r].len );

		r = Math.random() * 3 + 4; // between 4 - 10 seconds wait
		setTimeout(anim, r * 1000);
	};

	anim();
}

var gChar;
function charReady()
{ 
	initMicListen();

	//$('body').append( createAnimButton("blink", 500, "Blink!") );
	//$('body').append( createAnimButton("lookright", 3000, "Look Right!") );
	//$('body').append( createAnimButton("tilt", 3000, "tilt!") );

	gChar = createChar();
	gChar.node.appendTo("body");

	$("body").on('click', '.anim-btn', function(){
		gChar.setAnim( $(this).data("anim"), $(this).data("time") );
	});

	initRandomAnims();
}

$(document).ready(charReady);
