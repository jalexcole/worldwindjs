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

import WorldWindConstants from "../WorldWindConstants";
import GestureRecognizer from "./GestureRecognizer";

/**
 * Constructs a pan gesture recognizer.
 * @alias PanRecognizer
 * @constructor
 * @augments GestureRecognizer
 * @classdesc A concrete gesture recognizer subclass that looks for touch panning gestures.
 * @param {EventTarget} target The document element this gesture recognizer observes for mouse and touch events.
 * @param {Function} callback An optional function to call when this gesture is recognized. If non-null, the
 * function is called when this gesture is recognized, and is passed a single argument: this gesture recognizer,
 * e.g., <code>gestureCallback(recognizer)</code>.
 * @throws {ArgumentError} If the specified target is null or undefined.
 */
class PanRecognizer extends GestureRecognizer {
  constructor(target, callback) {
    super(target, callback);

    /**
     *
     * @type {Number}
     */
    this.minNumberOfTouches = 1;

    /**
     *
     * @type {Number}
     */
    this.maxNumberOfTouches = Number.MAX_VALUE;

    // Intentionally not documented.
    this.interpretDistance = 20;
  }
  // Documented in superclass.
  mouseDown(event) {
    if (this.state == WorldWindConstants.POSSIBLE) {
      this.state = WorldWindConstants.FAILED; // touch gestures fail upon receiving a mouse event
    }
  }
  // Documented in superclass.
  touchMove(touch) {
    if (this.state == WorldWindConstants.POSSIBLE) {
      if (this.shouldInterpret()) {
        if (this.shouldRecognize()) {
          this.state = WorldWindConstants.BEGAN;
        } else {
          this.state = WorldWindConstants.FAILED;
        }
      }
    } else if (this.state == WorldWindConstants.BEGAN || this.state == WorldWindConstants.CHANGED) {
      this.state = WorldWindConstants.CHANGED;
    }
  }
  // Documented in superclass.
  touchEnd(touch) {
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
    if (this.touchCount == 0) {
      // last touch cancelled
      if (this.state == WorldWindConstants.POSSIBLE) {
        this.state = WorldWindConstants.FAILED;
      } else if (this.state == WorldWindConstants.BEGAN ||
        this.state == WorldWindConstants.CHANGED) {
        this.state = WorldWindConstants.CANCELLED;
      }
    }
  }
  // Documented in superclass.
  prepareToRecognize() {
    // set translation to zero when the pan begins
    this.translationX = 0;
    this.translationY = 0;
  }
  /**
   *
   * @returns {boolean}
   * @protected
   */
  shouldInterpret() {
    var dx = this.translationX, dy = this.translationY, distance = Math.sqrt(dx * dx + dy * dy);
    return distance > this.interpretDistance; // interpret touches when the touch centroid moves far enough
  }
  /**
   *
   * @returns {boolean}
   * @protected
   */
  shouldRecognize() {
    var touchCount = this.touchCount;
    return (
      touchCount != 0 &&
      touchCount >= this.minNumberOfTouches &&
      touchCount <= this.maxNumberOfTouches
    );
  }
}



export default PanRecognizer;
