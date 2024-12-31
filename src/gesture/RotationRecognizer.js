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

import Angle from "../geom/Angle";
import GestureRecognizer from "./GestureRecognizer";

/**
 * Constructs a rotation gesture recognizer.
 * @alias RotationRecognizer
 * @constructor
 * @augments GestureRecognizer
 * @classdesc A concrete gesture recognizer subclass that looks for two finger rotation gestures.
 * @param {EventTarget} target The document element this gesture recognizer observes for mouse and touch events.
 * @param {Function} callback An optional function to call when this gesture is recognized. If non-null, the
 * function is called when this gesture is recognized, and is passed a single argument: this gesture recognizer,
 * e.g., <code>gestureCallback(recognizer)</code>.
 * @throws {ArgumentError} If the specified target is null or undefined.
 */
class RotationRecognizer extends GestureRecognizer{
  constructor(target, callback) {
    super(target, callback);

    // Intentionally not documented.
    this._rotation = 0;

    // Intentionally not documented.
    this._offsetRotation = 0;

    // Intentionally not documented.
    this.referenceAngle = 0;

    // Intentionally not documented.
    this.interpretThreshold = 20;

    // Intentionally not documented.
    this.weight = 0.4;

    // Intentionally not documented.
    this.rotationTouches = [];
  }
  // Documented in superclass.
  reset() {
    GestureRecognizer.prototype.reset.call(this);

    this._rotation = 0;
    this._offsetRotation = 0;
    this.referenceAngle = 0;
    this.rotationTouches = [];
  }
  // Documented in superclass.
  mouseDown(event) {
    if (this.state == WorldWindConstants.POSSIBLE) {
      this.state = WorldWindConstants.FAILED; // touch gestures fail upon receiving a mouse event
    }
  }
  // Documented in superclass.
  touchStart(touch) {
    if (this.rotationTouches.length < 2) {
      if (this.rotationTouches.push(touch) == 2) {
        this.referenceAngle = this.currentTouchAngle();
        this._offsetRotation += this._rotation;
        this._rotation = 0;
      }
    }
  }
  // Documented in superclass.
  touchMove(touch) {
    if (this.rotationTouches.length == 2) {
      if (this.state == WorldWindConstants.POSSIBLE) {
        if (this.shouldRecognize()) {
          this.state = WorldWindConstants.BEGAN;
        }
      } else if (this.state == WorldWindConstants.BEGAN ||
        this.state == WorldWindConstants.CHANGED) {
        var angle = this.currentTouchAngle(), newRotation = Angle.normalizedDegrees(angle - this.referenceAngle), w = this.weight;
        this._rotation = this._rotation * (1 - w) + newRotation * w;
        this.state = WorldWindConstants.CHANGED;
      }
    }
  }
  // Documented in superclass.
  touchEnd(touch) {
    var index = this.rotationTouches.indexOf(touch);
    if (index != -1) {
      this.rotationTouches.splice(index, 1);
    }

    // Transition to the ended state if this was the last touch.
    if (this.touchCount == 0) {
      // last touch ended
      if (this.state == WorldWindConstants.POSSIBLE) {
        this.state = WorldWindConstants.FAILED;
      } else if (this.state == WorldWindConstants.BEGAN ||
        this.state == WorldWindConstants.CHANGED) {
        this.state = WorldWindConstants.ENDED;
      }
    }
  }
  // Documented in superclass.
  touchCancel(touch) {
    var index = this.rotationTouches.indexOf(touch);
    if (index != -1) {
      this.rotationTouches.splice(index, 1);

      // Transition to the cancelled state if this was the last touch.
      if (this.touchCount == 0) {
        if (this.state == WorldWindConstants.POSSIBLE) {
          this.state = WorldWindConstants.FAILED;
        } else if (this.state == WorldWindConstants.BEGAN ||
          this.state == WorldWindConstants.CHANGED) {
          this.state = WorldWindConstants.CANCELLED;
        }
      }
    }
  }
  // Documented in superclass.
  prepareToRecognize() {
    this.referenceAngle = this.currentTouchAngle();
    this._rotation = 0;
  }
  // Intentionally not documented.
  shouldRecognize() {
    var angle = this.currentTouchAngle(), rotation = Angle.normalizedDegrees(angle - this.referenceAngle);

    return Math.abs(rotation) > this.interpretThreshold;
  }
  // Intentionally not documented.
  currentTouchAngle() {
    var touch0 = this.rotationTouches[0], touch1 = this.rotationTouches[1], dx = touch0.clientX - touch1.clientX, dy = touch0.clientY - touch1.clientY;

    return Math.atan2(dy, dx) * Angle.RADIANS_TO_DEGREES;
  }
}

Object.defineProperties(RotationRecognizer.prototype, {
  rotation: {
    get: function () {
      return this._rotation + this._offsetRotation;
    },
  },
});










export default RotationRecognizer;
