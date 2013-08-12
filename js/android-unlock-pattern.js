/**
 * Main JS file for Android Unlock
 * 
 * @author Rizwan Iqbal <mailme@rizwaniqbal.com>
 */

(function(undefined) {
	"use strict"

	var androidUnlockPattern = function() {

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
						console.log("Button Selected");
						e.target.classList.add('touched');
					}
				}, false);

				document.addEventListener('mouseover', function(e) {
					if ( matches.call( e.target, config.buttonClass) ) {
						console.log("Button Moved");
					}
				}, false);

				document.addEventListener('mouseup', function(e) {
					if ( matches.call( e.target, config.buttonClass) ) {
						console.log("Stop Selection");
					}
				}, false);

				// This is strictly for Mobile / Windows 8 touch machines / phones
				document.addEventListener('touchstart', function(e) {
					if ( matches.call( e.target, config.buttonClass) ) {
						console.log("Button Selected");
						e.target.classList.add('touched');
					}
				}, false);

				document.addEventListener('touchmove', function(e) {
					if ( matches.call( e.target, config.buttonClass) ) {
						console.log("Button Moved");
					}
				}, false);

				document.addEventListener('touchend', function(e) {
					if ( matches.call( e.target, config.buttonClass) ) {
						console.log("Stop Selection");
					}
				}, false);
				return this;
			}
		};

		var helpers = {
			generate: function(el) {
				var buttonHolder = document.createElement("ul");
				for (var i = 1; i < 10; i++) {
					var listButton = document.createElement("li");
					listButton.className = "lock-button";
					listButton.id = "line" + i;
					buttonHolder.appendChild(listButton);
				};
				el.appendChild(buttonHolder);
			}
		};
		
		return {
			'ui':ui
		};

	}();

	androidUnlockPattern.ui.init();

})();