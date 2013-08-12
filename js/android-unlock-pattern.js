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
				// main container
				var patternTag = document.createElement("div");
				patternTag.className = "patternlockcontainer";


				// horizontal lines
				var linesTag = document.createElement("div");
				linesTag.className = "patternlocklineshorizontalcontainer";
				var elid=["12","23","45","56","78","89"];
				for (var i=0;i<6;i++){
					var lineTag = document.createElement("div");
					lineTag.className = "patternlocklinehorizontal";
					lineTag.id = "line" + elid[i];
					linesTag.appendChild(lineTag);
				}
				patternTag.appendChild(linesTag);

				// vertical lines
				var linesTag = document.createElement("div");
				linesTag.className = "patternlocklinesverticalcontainer";
				var elid=["14","25","36","47","58","69"];
				for (var i=0;i<6;i++){
					var lineTag = document.createElement("div");
					lineTag.className = "patternlocklinevertical";
					lineTag.id = "line" + elid[i];
					linesTag.appendChild(lineTag);
				}
				patternTag.appendChild(linesTag);

				// diagonal lines
				var linesTag = document.createElement("div");
				linesTag.className = "patternlocklinesdiagonalcontainer";
				var elid=["24","35","57","68"];
				for (var i=0;i<4;i++){
					var lineTag = document.createElement("div");
					lineTag.className = "patternlocklinediagonalforward";
					lineTag.id = "line" + elid[i];
					linesTag.appendChild(lineTag);
				}
				patternTag.appendChild(linesTag);
				var linesTag = document.createElement("div");
				var elid=["15","26","48","59"];
				linesTag.className = "patternlocklinesdiagonalcontainer";
				for (var i=0;i<4;i++){
					var lineTag = document.createElement("div");
					lineTag.className = "patternlocklinediagonalbackwards";
					lineTag.id = "line" + elid[i];
					linesTag.appendChild(lineTag);
				}
				patternTag.appendChild(linesTag);

				var buttonHolder = document.createElement("ul");
				for (var i = 1; i < 10; i++) {
					var listButton = document.createElement("li");
					listButton.className = "lock-button";
					listButton.id = "line" + i;
					buttonHolder.appendChild(listButton);
				};
				patternTag.appendChild(buttonHolder);
				el.appendChild(patternTag);
			},

			startDrawing: function(el) {
				console.log("Button Selected" + el.target.id);
				androidUnlockPattern.isDrawing = true;
				el.target.classList.add("patternlockbutton touched");
				androidUnlockPattern.from = "";
				androidUnlockPattern.to = el.target.id.split("patternlockbutton").join("");
				this.inputbox.value = androidUnlockPattern.to;
				this.startbutton = androidUnlockPattern.to;
				return false;
			},

			connectDots: function(el) {
				if(androidUnlockPattern.isDrawing) {
					var thisbutton = el.target.id.split("patternlockbutton").join("");
			
					if(thisbutton != androidUnlockPattern.to){ // touching the same button twice in a row is not allowed (should it ?)
			
						var cn = el.target.className;
						if(cn.indexOf('touched')<0){
							el.target.className = "patternlockbutton touched"
						}else{
							el.target.className = "patternlockbutton touched multiple"
						}
					
						androidUnlockPattern.from = patternlock.to;
						androidUnlockPattern.to = thisbutton;
						
						//update input value
						this.inputbox.value += androidUnlockPattern.to;
						
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
			}
		};
		
		return {
			'ui':ui
		};

	}();

	androidUnlockPattern.ui.init();

})();