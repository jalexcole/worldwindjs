/* 
 * Copyright (c) 2016, 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */

/**
 * The KeyboardControls module provides keyboard controls for the globe.
 * Note: the canvas must be focusable; this can be accomplished by establishing the "tabindex" 
 * on the canvas element.
 * 
 * @returns {KeyboardControls}
 * 
 * @@author Bruce Schubert
 */
define([
    '../geom/Location',
    '../geom/LookAt'],
    function (
        Location, LookAt) {
        "use strict";
        /**
         * Creates a KeyboardController that dispatches keystrokes from the 
         * WorldWindow to the Camera. Note: the WorldWindow's canvas must be focusable;
         * this can be accomplished by establishing the "tabindex" on the canvas element.
         * @param {WorldWindow} wwd The keyboard event generator.
         * @returns {KeyboardControls}
         */
        var KeyboardControls = function (wwd) {
            this.wwd = wwd;
            this.enabled = true;
            
            // The tabindex must be set for the keyboard controls to work
            var tabIndex = this.wwd.canvas.tabIndex;
            if (typeof tabIndex === 'undefined' || tabIndex < 0) {
                this.wwd.canvas.tabIndex = 0;
            }

            var self = this;
            this.wwd.addEventListener('keydown', function (event) {
                  self.handleKeyDown(event);
            });
            this.wwd.addEventListener('keyup', function (event) {
                  self.handleKeyUp(event);
            });
            // Ensure keyboard controls are operational by setting the focus to the canvas
            this.wwd.addEventListener("click", function (event) {
                if (self.enabled) {
                  self.wwd.canvas.focus();
                }
            });
            
            /**
             * The incremental amount to increase or decrease the eye distance (for zoom) each cycle.
             * @type {Number}
             */
            this.zoomIncrement = 0.01;

            /**
             * The scale factor governing the pan speed. Increased values cause faster panning.
             * @type {Number}
             */
            this.panIncrement = 0.0000000005;

            /**
             * Internal use only.
             * The current state of the viewing parameters during an operation as a look at view.
             * @ignore
             */
            this.lookAt = new LookAt();

        };

        /**
         * Controls the globe with the keyboard.
         * @param {KeyboardEvent} event
         */
        KeyboardControls.prototype.handleKeyDown = function (event) {
          
            if (!this.enabled) {
                return;
            }
            
            // TODO: find a way to make this code portable for different keyboard layouts
            if (event.keyCode === 187 || event.keyCode === 61) {        // + key || +/= key
                this.handleZoom("zoomIn");
                event.preventDefault();
            }
            else if (event.keyCode === 189 || event.keyCode === 173) {  // - key || _/- key
                this.handleZoom("zoomOut");
                event.preventDefault();
            }
            else if (event.keyCode === 37) {    // Left arrow
                this.handlePan("panLeft");
                event.preventDefault();
            }
            else if (event.keyCode === 38) {    // Up arrow
                this.handlePan("panUp");
                event.preventDefault();
            }
            else if (event.keyCode === 39) {    // Right arrow
                this.handlePan("panRight");
                event.preventDefault();
            }
            else if (event.keyCode === 40) {    // Down arrow
                this.handlePan("panDown");
                event.preventDefault();
            }
            else if (event.keyCode === 78) {    // N key
                this.resetHeading();
                event.preventDefault();
            }
            else if (event.keyCode === 82) {    // R key
                this.resetHeadingAndTilt();
                event.preventDefault();
            }
        };

        /**
         * Reset the view to North up.
         */
        KeyboardControls.prototype.resetHeading = function () {
            this.wwd.cameraAsLookAt(this.lookAt);
            this.lookAt.heading = Number(0);
            this.wwd.cameraFromLookAt(this.lookAt);
            this.wwd.redraw();
        };

        /**
         * Reset the view to North up and nadir.
         */
        KeyboardControls.prototype.resetHeadingAndTilt = function () {
            this.wwd.cameraAsLookAt(this.lookAt);
            this.lookAt.heading = 0;
            this.lookAt.tilt = 0;
            this.wwd.cameraFromLookAt(this.lookAt);
            this.wwd.redraw();
        };

        /**
         * 
         * @param {KeyupEvent} event
         */
        KeyboardControls.prototype.handleKeyUp = function (event) {
            if (this.activeOperation) {
                this.activeOperation = null;
                event.preventDefault();
            }
        };

        /**
         * 
         * @param {type} operation
         */
        KeyboardControls.prototype.handleZoom = function (operation) {
            this.activeOperation = this.handleZoom;
            this.wwd.cameraAsLookAt(this.lookAt);

            // This function is called by the timer to perform the operation.
            var self = this, // capture 'this' for use in the function
                setRange = function () {
                    if (self.activeOperation) {
                        if (operation === "zoomIn") {
                            self.lookAt.range *= (1 - self.zoomIncrement);
                        } else if (operation === "zoomOut") {
                            self.lookAt.range *= (1 + self.zoomIncrement);
                        }
                        self.wwd.cameraFromLookAt(self.lookAt);
                        self.wwd.redraw();
                        setTimeout(setRange, 50);
                    }
                };
            setTimeout(setRange, 50);
        };

        /**
         * 
         * @param {String} operation
         */
        KeyboardControls.prototype.handlePan = function (operation) {
            this.activeOperation = this.handlePan;
            this.wwd.cameraAsLookAt(this.lookAt);

            // This function is called by the timer to perform the operation.
            var self = this, // capture 'this' for use in the function
                setLookAtLocation = function () {
                    if (self.activeOperation) {
                        var heading = self.lookAt.heading,
                            distance = self.panIncrement * self.lookAt.range;

                        switch (operation) {
                            case 'panUp' :
                                break;
                            case 'panDown' :
                                heading -= 180;
                                break;
                            case 'panLeft' :
                                heading -= 90;
                                break;
                            case 'panRight' :
                                heading += 90;
                                break;
                        }
                        // Update the cameras's lookAt Position
                        Location.greatCircleLocation(
                            self.lookAt.position,
                            heading,
                            distance,
                            self.lookAt.position);
                        self.wwd.cameraFromLookAt(self.lookAt);
                        self.wwd.redraw();
                        setTimeout(setLookAtLocation, 50);
                    }
                };
            setTimeout(setLookAtLocation, 50);
        };

        return KeyboardControls;
    }
);

