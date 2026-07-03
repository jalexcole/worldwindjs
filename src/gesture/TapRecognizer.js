/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
import GestureRecognizer from "./GestureRecognizer";
import WorldWindConstants from "../WorldWindConstants";
/**
 * Constructs a tap gesture recognizer.
 * @alias TapRecognizer
 * @constructor
 * @augments GestureRecognizer
 * @classdesc A concrete gesture recognizer subclass that looks for single or multiple taps.
 * @param {EventTarget} target The document element this gesture recognizer observes for mouse and touch events.
 * @param {Function} callback An optional function to call when this gesture is recognized. If non-null, the
 * function is called when this gesture is recognized, and is passed a single argument: this gesture recognizer,
 * e.g., <code>gestureCallback(recognizer)</code>.
 * @throws {ArgumentError} If the specified target is null or undefined.
 */
class TapRecognizer extends GestureRecognizer{
  constructor(target, callback) {
    super(target, callback);

    /**
     *
     * @type {Number}
     */
    this.numberOfTaps = 1;

    /**
     *
     * @type {Number}
     */
    this.numberOfTouches = 1;

    // Intentionally not documented.
    this.maxTouchMovement = 20;

    // Intentionally not documented.
    this.maxTapDuration = 500;

    // Intentionally not documented.
    this.maxTapInterval = 400;

    // Intentionally not documented.
    this.taps = [];

    // Intentionally not documented.
    this.timeout = null;
  }
  // Documented in superclass.
  reset() {
    GestureRecognizer.prototype.reset.call(this);

    this.taps = [];
    this.cancelFailAfterDelay();
  }
  // Documented in superclass.
  mouseDown(event) {
    if (this.state != WorldWindConstants.POSSIBLE) {
      return;
    }

    this.state = WorldWindConstants.FAILED; // touch gestures fail upon receiving a mouse event
  }
  // Documented in superclass.
  touchStart(touch) {
    if (this.state != WorldWindConstants.POSSIBLE) {
      return;
    }

    var tap;

    if (this.touchCount > this.numberOfTouches) {
      this.state = WorldWindConstants.FAILED;
    } else if (this.touchCount == 1) {
      // first touch started
      tap = {
        touchCount: this.touchCount,
        clientX: this.clientX,
        clientY: this.clientY,
      };
      this.taps.push(tap);
      this.failAfterDelay(this.maxTapDuration); // fail if the tap is down too long
    } else {
      tap = this.taps[this.taps.length - 1];
      tap.touchCount = this.touchCount; // max number of simultaneous touches
      tap.clientX = this.clientX; // touch centroid
      tap.clientY = this.clientY;
    }
  }
  // Documented in superclass.
  touchMove(touch) {
    if (this.state != WorldWindConstants.POSSIBLE) {
      return;
    }

    var dx = this.translationX, dy = this.translationY, distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > this.maxTouchMovement) {
      this.state = WorldWindConstants.FAILED;
    }
  }
  // Documented in superclass.
  touchEnd(touch) {
    if (this.state != WorldWindConstants.POSSIBLE) {
      return;
    }

    if (this.touchCount != 0) {
      return; // wait until the last touch ends
    }

    var tapCount = this.taps.length, tap = this.taps[tapCount - 1];
    if (tap.touchCount != this.numberOfTouches) {
      this.state = WorldWindConstants.FAILED; // wrong number of touches
    } else if (tapCount == this.numberOfTaps) {
      this.clientX = this.taps[0].clientX;
      this.clientY = this.taps[0].clientY;
      this.state = WorldWindConstants.RECOGNIZED;
    } else {
      this.failAfterDelay(this.maxTapInterval); // fail if the interval between taps is too long
    }
  }
  // Documented in superclass.
  touchCancel(touch) {
    if (this.state != WorldWindConstants.POSSIBLE) {
      return;
    }

    this.state = WorldWindConstants.FAILED;
  }
  // Intentionally not documented.
  failAfterDelay(delay) {
    var self = this;
    if (self.timeout) {
      window.clearTimeout(self.timeout);
    }

    self.timeout = window.setTimeout(function () {
      self.timeout = null;
      if (self.state == WorldWindConstants.POSSIBLE) {
        self.state = WorldWindConstants.FAILED; // fail if we haven't already reached a terminal state
      }
    }, delay);
  }
  // Intentionally not documented.
  cancelFailAfterDelay() {
    var self = this;
    if (self.timeout) {
      window.clearTimeout(self.timeout);
      self.timeout = null;
    }
  }
}




export default TapRecognizer;
