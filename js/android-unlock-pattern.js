/**
 * Main JS file for Android Unlock
 * 
 * @author Rizwan Iqbal <mailme@rizwaniqbal.com>
 */

(function(undefined) {
	// "use strict"

	var androidUnlockPattern = function() {

		isDrawing:false;
		from:"";
		to:"";

		var config = {
			autostart: true,
			container: '.pattern-unlock-container',
			buttonClass: '.lock-button',
			setPattern: '#setButton',
			unlockPattern: '#checkButton'
		};

		var ui = {
			/**
			 * Initialize the whole UI. Make things work!!
			 * Ideally we would paing the whole UI using this.
			 * Cause we need this in 4 hours, lets skip that and have UI setup
			 */
			init: function() {
				ui.bindings();
				if( config.autostart ) {
					var container = document.querySelector(config.container);;
					helpers.generate(container);
				}
			},

			/**
			 * Event bindings on the DOM. Call it before painting the div.
			 */
			bindings: function() {
				//Bind the Pagination click events
				var matches;

				(function(doc) {
					matches = 
					doc.matchesSelector ||
					doc.webkitMatchesSelector ||
					doc.mozMatchesSelector ||
					doc.oMatchesSelector ||
					doc.msMatchesSelector;
				})(document.documentElement);

				//This way we add just one listener in place of adding multiple listeners
				document.addEventListener('click', function(e) {
					if ( matches.call( e.target, config.setPattern) ) {
						console.log("Setting Pattern");
					}
					if ( matches.call( e.target, config.unlockPattern) ) {
						console.log("Unlocking Pattern");
					}
				}, false);

				document.addEventListener('mousedown', function(e) {
					if ( matches.call( e.target, config.buttonClass) ) {
						console.log(e);
						helpers.startDrawing(e);
					}
				}, false);

				document.addEventListener('mouseover', function(e) {
					if ( matches.call( e.target, config.buttonClass) ) {
						helpers.connectDots(e);
					}
				}, false);

				document.addEventListener('mouseup', function(e) {
					if ( matches.call( e.target, config.buttonClass) ) {
						console.log("Stop Selection" + e.target.id);
						e.target.classList.add('touched');
						androidUnlockPattern.isDrawing = false;
					}
				}, false);

				// This is for Touch Devices
				document.addEventListener('touchstart', function(e) {
					if ( matches.call( e.target, config.buttonClass) ) {
						console.log("Button Selected" + e.target.id);
						e.target.classList.add('touched');
					}
				}, false);

				document.addEventListener('touchmove', function(e) {
					if ( matches.call( e.target, config.buttonClass) ) {
						if(androidUnlockPattern.isDrawing) {
							console.log("Button Moved" + e.target.id);
							e.target.classList.add('touched');
						}
					}
				}, false);

				document.addEventListener('touchend', function(e) {
					if ( matches.call( e.target, config.buttonClass) ) {
						console.log("Stop Selection" + e.target.id);
						e.target.classList.add('touched');
						androidUnlockPattern.isDrawing = false;
					}
				}, false);
				return this;
			}
		};

		var helpers = {

			generate: function(el) {
				// 
				// All attempts with canvas failed so we had to resort to this
				// 
				var patternTag = document.createElement("div");
				patternTag.className = "patternContainer";


				// horizontal lines
				var linesTag = document.createElement("div");
				linesTag.className = "horizontalContainer";
				var elid=["12","23","45","56","78","89"];
				for (var i=0;i<6;i++){
					var lineTag = document.createElement("div");
					lineTag.className = "horizontalLine";
					lineTag.id = "line" + elid[i];
					linesTag.appendChild(lineTag);
				}
				patternTag.appendChild(linesTag);

				// vertical lines
				var linesTag = document.createElement("div");
				linesTag.className = "verticalContainer";
				var elid=["14","25","36","47","58","69"];
				for (var i=0;i<6;i++){
					var lineTag = document.createElement("div");
					lineTag.className = "verticalLine";
					lineTag.id = "line" + elid[i];
					linesTag.appendChild(lineTag);
				}
				patternTag.appendChild(linesTag);

				// diagonal lines
				var linesTag = document.createElement("div");
				linesTag.className = "diagonalContainer";
				var elid=["24","35","57","68"];
				for (var i=0;i<4;i++){
					var lineTag = document.createElement("div");
					lineTag.className = "forwardDiagonal";
					lineTag.id = "line" + elid[i];
					linesTag.appendChild(lineTag);
				}
				patternTag.appendChild(linesTag);
				var linesTag = document.createElement("div");
				var elid=["15","26","48","59"];
				linesTag.className = "diagonalContainer";
				for (var i=0;i<4;i++){
					var lineTag = document.createElement("div");
					lineTag.className = "backwardDiagonal";
					lineTag.id = "line" + elid[i];
					linesTag.appendChild(lineTag);
				}
				patternTag.appendChild(linesTag);

				var buttonHolder = document.createElement("ul");
				for (var i = 1; i < 10; i++) {
					var listButton = document.createElement("li");
					listButton.className = "lock-button";
					listButton.id = "pattern-button" + i;
					buttonHolder.appendChild(listButton);
				};
				patternTag.appendChild(buttonHolder);
				el.appendChild(patternTag);
			},

			startDrawing: function(el) {
				console.log("Button Selected" + el.target.id);
				androidUnlockPattern.isDrawing = true;
				el.target.classList.add("pattern-button");
				el.target.classList.add("touched");
				androidUnlockPattern.from = "";
				androidUnlockPattern.to = el.target.id.split("pattern-button").join("");
				// this.inputbox.value = androidUnlockPattern.to;
				this.startbutton = androidUnlockPattern.to;
				return false;
			},

			connectDots: function(el) {
				if(androidUnlockPattern.isDrawing) {
					var thisbutton = el.target.id.split("pattern-button").join("");
			
					if(thisbutton != androidUnlockPattern.to){ // touching the same button twice in a row is not allowed (should it ?)
			
						var cn = el.target.className;
						if(cn.indexOf('touched')<0){
							el.target.className = "pattern-button touched"
						}else{
							el.target.className = "pattern-button touched multiple"
						}
					
						androidUnlockPattern.from = androidUnlockPattern.to;
						androidUnlockPattern.to = thisbutton;
						
						//update input value
						// this.inputbox.value += androidUnlockPattern.to;
						
						// display line between 2 buttons 
						var thisline = document.getElementById("line" + androidUnlockPattern.from + androidUnlockPattern.to);
						if (androidUnlockPattern.to <  androidUnlockPattern.from){
							thisline = document.getElementById("line" + androidUnlockPattern.to + androidUnlockPattern.from);
						}
						if (thisline){
							thisline.style.visibility = 'visible';
						}
					}
				}
				return(false);
			},

			buttontouchmove:function(el){
				if(el.target.touches.length == 1){
					var touch = el.target.touches[0];
								
					// find position relative to first button
					var b1 = document.getElementById("pattern-button1");
					var b2 = document.getElementById("pattern-button2");
					var p = helpers.findPos(b1);
					var p2 = helpers.findPos(b2);
					var cox = parseInt(touch.pageX) - parseInt(p[0])
					var coy = parseInt(touch.pageY) - parseInt(p[1])
					var gridsize =  p2[0] - p[0] // bit stupid no ?
					
				
					// on what button are we over now?
					// grid 3x3 to sequential nummber
					var buttonnr = Math.min(2,Math.max(0,Math.floor(cox/gridsize))) + (Math.min(2,Math.max(0,Math.floor(coy/gridsize)))*3) + 1;
									
					if (buttonnr != androidUnlockPattern.to){
						// only trigger if the touch is near the middle of the button
						// otherwise diagonal moves are impossible
						var distancex = (cox % gridsize);
						var distancey = (coy % gridsize);
						if ((distancex< (gridsize/2)) && (distancey < (gridsize/2))){
							// we're over a new button
							var newbutton = document.getElementById("pattern-button" + buttonnr)
							androidUnlockPattern.connectDots(newbutton);
						}			
					}
				}
			},

			findPos: function(obj) {
				var curleft = curtop = 0;
				if (obj.offsetParent) {
					do {
						curleft += obj.offsetLeft;
						curtop += obj.offsetTop;
					} while (obj = obj.offsetParent);
					return [curleft,curtop];
				}
			}
		};
		
		return {
			'ui':ui
		};

	}();

	androidUnlockPattern.ui.init();

})();