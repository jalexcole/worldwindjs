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
import ArgumentError from "../error/ArgumentError";
import Logger from "../util/Logger";
import Touch from "../gesture/Touch";
import WorldWindConstants from "../WorldWindConstants";

class GestureRecognizer {
  /**
   * Constructs a base gesture recognizer. This is an abstract base class and not intended to be instantiated
   * directly.
   * @alias GestureRecognizer
   * @constructor
   * @classdesc Gesture recognizers translate user input event streams into higher level actions. A gesture
   * recognizer is associated with an event target, which dispatches mouse and keyboard events to the gesture
   * recognizer. When a gesture recognizer has received enough information from the event stream to interpret the
   * action, it calls its callback functions. Callback functions may be specified at construction or added to the
   * [gestureCallbacks]{@link GestureRecognizer#gestureCallbacks} list after construction.
   * @param {EventTarget} target The document element this gesture recognizer observes for mouse and touch events.
   * @param {Function} callback An optional function to call when this gesture is recognized. If non-null, the
   * function is called when this gesture is recognized, and is passed a single argument: this gesture recognizer,
   * e.g., <code>gestureCallback(recognizer)</code>.
   * @throws {ArgumentError} If the specified target is null or undefined.
   */
  // TODO: evaluate target usage
  constructor(target, callback) {
    if (!target) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "GestureRecognizer",
          "constructor",
          "missingTarget"
        )
      );
    }

    /**
     * Indicates the document element this gesture recognizer observes for UI events.
     * @type {EventTarget}
     * @readonly
     */
    this.target = target;

    /**
     * Indicates whether or not this gesture recognizer is enabled. When false, this gesture recognizer will
     * ignore any events dispatched by its target.
     * @type {Boolean}
     * @default true
     */
    this.enabled = true;

    // Documented with its property accessor below.
    this._state = WorldWindConstants.POSSIBLE;

    // Intentionally not documented.
    this._nextState = null;

    // Documented with its property accessor below.
    this._clientX = 0;

    // Documented with its property accessor below.
    this._clientY = 0;

    // Intentionally not documented.
    this._clientStartX = 0;

    // Intentionally not documented.
    this._clientStartY = 0;

    // Documented with its property accessor below.
    this._translationX = 0;

    // Documented with its property accessor below.
    this._translationY = 0;

    // Intentionally not documented.
    this._translationWeight = 0.4;

    // Documented with its property accessor below.
    this._mouseButtonMask = 0;

    // Intentionally not documented.
    this._touches = [];

    // Intentionally not documented.
    this._touchCentroidShiftX = 0;

    // Intentionally not documented.
    this._touchCentroidShiftY = 0;

    // Documented with its property accessor below.
    this._gestureCallbacks = [];

    // Intentionally not documented.
    this._canRecognizeWith = [];

    // Intentionally not documented.
    this._requiresFailureOf = [];

    // Intentionally not documented.
    this._requiredToFailBy = [];

    // Add the optional gesture callback.
    if (callback) {
      this._gestureCallbacks.push(callback);
    }

    // Intentionally not documented.
    this.listenerList = [];

    // Add this recognizer to the list of all recognizers.
    GestureRecognizer.allRecognizers.push(this);
  }

  // Intentionally not documented.
  static allRecognizers = [];

  /**
   * Indicates this gesture's current state. Possible values are WorldWindConstants.POSSIBLE, WorldWindConstants.FAILED,
   * WorldWindConstants.RECOGNIZED, WorldWindConstants.BEGAN, WorldWindConstants.CHANGED, WorldWindConstants.CANCELLED, and WorldWindConstants.ENDED.
   * @type {String}
   * @default WorldWindConstants.POSSIBLE
   */
  get state() {
    return this._state;
  }
  set state(value) {
    this.transitionToState(value);
  }

  /**
   * Indicates the X coordinate of this gesture.
   * @type {Number}
   */
  get clientX() {
    return this._clientX;
  }
  set clientX(value) {
    this._clientX = value;
  }

  /**
   * Returns the Y coordinate of this gesture.
   * @type {Number}
   */
  get clientY() {
    return this._clientY;
  }
  set clientY(value) {
    this._clientY = value;
  }

  /**
   * Indicates this gesture's translation along the X axis since the gesture started.
   * @type {Number}
   */
  get translationX() {
    return this._translationX;
  }
  set translationX(value) {
    this._translationX = value;
    this._clientStartX = this._clientX;
    this._touchCentroidShiftX = 0;
  }

  /**
   * Indicates this gesture's translation along the Y axis since the gesture started.
   * @type {Number}
   */
  get translationY() {
    return this._translationY;
  }
  set translationY(value) {
    this._translationY = value;
    this._clientStartY = this._clientY;
    this._touchCentroidShiftY = 0;
  }

  /**
   * Indicates the currently pressed mouse buttons as a bitmask.
   * @type {Number}
   * @readonly
   */
  get mouseButtonMask() {
    return this._mouseButtonMask;
  }

  /**
   * Indicates the number of active touches.
   * @type {Number}
   * @readonly
   */
  get touchCount() {
    return this._touches.length;
  }

  /**
   * The list of functions to call when this gesture is recognized.
   * @type {Function[]}
   * @readonly
   */
  get gestureCallbacks() {
    return this._gestureCallbacks;
  }

  /**
   *
   * @param index
   * @returns {Touch}
   * @throws {ArgumentError} If the index is out of range.
   */
  touch(index) {
    if (index < 0 || index >= this._touches.length) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "GestureRecognizer",
          "touch",
          "indexOutOfRange"
        )
      );
    }

    return this._touches[index];
  }

  /**
   *
   * @param recognizer
   */
  recognizeSimultaneouslyWith(recognizer) {
    if (!recognizer) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "GestureRecognizer",
          "recognizeSimultaneouslyWith",
          "The specified gesture recognizer is null or undefined."
        )
      );
    }

    var index = this._canRecognizeWith.indexOf(recognizer);
    if (index == -1) {
      this._canRecognizeWith.push(recognizer);
      recognizer._canRecognizeWith.push(this);
    }
  }

  /**
   *
   * @param recognizer
   * @returns {Boolean}
   */
  canRecognizeSimultaneouslyWith(recognizer) {
    var index = this._canRecognizeWith.indexOf(recognizer);
    return index != -1;
  }

  /**
   *
   * @param recognizer
   */
  requireRecognizerToFail(recognizer) {
    if (!recognizer) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "GestureRecognizer",
          "requireRecognizerToFail",
          "The specified gesture recognizer is null or undefined"
        )
      );
    }

    var index = this._requiresFailureOf.indexOf(recognizer);
    if (index == -1) {
      this._requiresFailureOf.push(recognizer);
      recognizer._requiredToFailBy.push(this);
    }
  }

  /**
   *
   * @param recognizer
   * @returns {Boolean}
   */
  requiresRecognizerToFail(recognizer) {
    var index = this._requiresFailureOf.indexOf(recognizer);
    return index != -1;
  }

  /**
   *
   * @param recognizer
   * @returns {Boolean}
   */
  requiredToFailByRecognizer(recognizer) {
    var index = this._requiredToFailBy.indexOf(recognizer);
    return index != -1;
  }

  /**
   * @protected
   */
  reset() {
    this._state = WorldWindConstants.POSSIBLE;
    this._nextState = null;
    this._clientX = 0;
    this._clientY = 0;
    this._clientStartX = 0;
    this._clientStartY = 0;
    this._translationX = 0;
    this._translationY = 0;
    this._mouseButtonMask = 0;
    this._touches = [];
    this._touchCentroidShiftX = 0;
    this._touchCentroidShiftY = 0;
  }

  /**
   * @protected
   */
  prepareToRecognize() {}

  /**
   *
   * @param event
   * @protected
   */
  mouseDown(event) {}

  /**
   *
   * @param event
   * @protected
   */
  mouseMove(event) {}

  /**
   *
   * @param event
   * @protected
   */
  mouseUp(event) {}

  /**
   *
   * @param touch
   * @protected
   */
  touchStart = function (touch) {};

  /**
   *
   * @param touch
   * @protected
   */
  touchMove = function (touch) {};

  /**
   *
   * @param touch
   * @protected
   */
  touchCancel = function (touch) {};

  /**
   *
   * @param touch
   * @protected
   */
  touchEnd(touch) {}

  // Intentionally not documented.
  transitionToState(newState) {
    this._nextState = null; // clear any pending state transition

    if (newState === WorldWindConstants.FAILED) {
      this._state = newState;
      this.updateRecognizersWaitingForFailure();
      this.resetIfEventsEnded();
    } else if (newState === WorldWindConstants.RECOGNIZED) {
      this.tryToRecognize(newState); // may prevent the transition to Recognized
      if (this._state === newState) {
        this.prepareToRecognize();
        this.notifyListeners();
        this.callGestureCallbacks();
        this.resetIfEventsEnded();
      }
    } else if (newState === WorldWindConstants.BEGAN) {
      this.tryToRecognize(newState); // may prevent the transition to Began
      if (this._state === newState) {
        this.prepareToRecognize();
        this.notifyListeners();
        this.callGestureCallbacks();
      }
    } else if (newState === WorldWindConstants.CHANGED) {
      this._state = newState;
      this.notifyListeners();
      this.callGestureCallbacks();
    } else if (newState === WorldWindConstants.CANCELLED) {
      this._state = newState;
      this.notifyListeners();
      this.callGestureCallbacks();
      this.resetIfEventsEnded();
    } else if (newState === WorldWindConstants.ENDED) {
      this._state = newState;
      this.notifyListeners();
      this.callGestureCallbacks();
      this.resetIfEventsEnded();
    }
  }

  // Intentionally not documented.
  updateRecognizersWaitingForFailure() {
    // Transition gestures that are waiting for this gesture to transition to Failed.
    for (var i = 0, len = this._requiredToFailBy.length; i < len; i++) {
      var recognizer = this._requiredToFailBy[i];
      if (recognizer._nextState != null) {
        recognizer.transitionToState(recognizer._nextState);
      }
    }
  }

  // Intentionally not documented.
  tryToRecognize(newState) {
    // Transition to Failed if another gesture can prevent this gesture from recognizing.
    if (
      GestureRecognizer.allRecognizers.some(
        this.canBePreventedByRecognizer,
        this
      )
    ) {
      this.transitionToState(WorldWindConstants.FAILED);
      return;
    }

    // Delay the transition to Recognized/Began if this gesture is waiting for a gesture in the Possible state.
    if (
      GestureRecognizer.allRecognizers.some(
        this.isWaitingForRecognizerToFail,
        this
      )
    ) {
      this._nextState = newState;
      return;
    }

    // Transition to Failed all other gestures that can be prevented from recognizing by this gesture.
    var prevented = GestureRecognizer.allRecognizers.filter(
      this.canPreventRecognizer,
      this
    );
    for (var i = 0, len = prevented.length; i < len; i++) {
      prevented[i].transitionToState(WorldWindConstants.FAILED);
    }

    this._state = newState;
  }

  // Intentionally not documented.
  canPreventRecognizer(that) {
    return (
      this != that &&
      this.target == that.target &&
      that.state == WorldWindConstants.POSSIBLE &&
      (this.requiredToFailByRecognizer(that) ||
        !this.canRecognizeSimultaneouslyWith(that))
    );
  }

  // Intentionally not documented.
  canBePreventedByRecognizer(that) {
    return (
      this != that &&
      this.target == that.target &&
      that.state == WorldWindConstants.RECOGNIZED &&
      (this.requiresRecognizerToFail(that) ||
        !this.canRecognizeSimultaneouslyWith(that))
    );
  }

  // Intentionally not documented.
  isWaitingForRecognizerToFail(that) {
    return (
      this != that &&
      this.target == that.target &&
      that.state == WorldWindConstants.POSSIBLE &&
      this.requiresRecognizerToFail(that)
    );
  }

  /**
   * Registers a gesture state listener on this GestureRecognizer. Registering state listeners using this function
   * enables applications to receive notifications of gesture recognition.
   *
   * Listeners must implement a gestureStateChanged method to receive notifications. The gestureStateChanged method will
   * receive one parameter containing a reference to the recognizer that changed state.
   *
   * @param listener The function to call when the event occurs.
   * @throws {ArgumentError} If any argument is null or undefined.
   */
  addListener(listener) {
    if (!listener) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "GestureRecognizer",
          "addListener",
          "missingListener"
        )
      );
    }
    this.listenerList.push(listener);
  }

  /**
   * Removes a gesture state listener from this GestureRecognizer. The listener must be the same object passed to
   * addListener. Calling removeListener with arguments that do not identify a currently registered
   * listener has no effect.
   *
   * @param listener The listener to remove. Must be the same object passed to addListener.
   * @throws {ArgumentError} If any argument is null or undefined.
   */
  removeListener(listener) {
    if (!listener) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "GestureRecognizer",
          "removeListener",
          "missingListener"
        )
      );
    }

    var index = this.listenerList.indexOf(listener);
    if (index !== -1) {
      this.listenerList.splice(index, 1); // remove the listener from the list
    }
  }

  // Intentionally not documented.
  notifyListeners() {
    for (var i = 0; i < this.listenerList.length; i++) {
      this.listenerList[i].gestureStateChanged(this);
    }
  }

  // Intentionally not documented.
  callGestureCallbacks() {
    for (var i = 0, len = this._gestureCallbacks.length; i < len; i++) {
      this._gestureCallbacks[i](this);
    }
  }

  // Intentionally not documented.
  onGestureEvent(event) {
    if (!this.enabled) {
      return;
    }

    if (event.defaultPrevented && this.state === WorldWindConstants.POSSIBLE) {
      return; // ignore cancelled events while in the Possible state
    }

    var i, len;

    try {
      if (event.type === "mousedown") {
        this.handleMouseDown(event);
      } else if (event.type === "mousemove") {
        this.handleMouseMove(event);
      } else if (event.type === "mouseup") {
        this.handleMouseUp(event);
      } else if (event.type === "touchstart") {
        for (i = 0, len = event.changedTouches.length; i < len; i++) {
          this.handleTouchStart(event.changedTouches.item(i));
        }
      } else if (event.type === "touchmove") {
        for (i = 0, len = event.changedTouches.length; i < len; i++) {
          this.handleTouchMove(event.changedTouches.item(i));
        }
      } else if (event.type === "touchcancel") {
        for (i = 0, len = event.changedTouches.length; i < len; i++) {
          this.handleTouchCancel(event.changedTouches.item(i));
        }
      } else if (event.type === "touchend") {
        for (i = 0, len = event.changedTouches.length; i < len; i++) {
          this.handleTouchEnd(event.changedTouches.item(i));
        }
      } else if (
        event.type === "pointerdown" &&
        event.pointerType === "mouse"
      ) {
        this.handleMouseDown(event);
      } else if (
        event.type === "pointermove" &&
        event.pointerType === "mouse"
      ) {
        this.handleMouseMove(event);
      } else if (
        event.type === "pointercancel" &&
        event.pointerType === "mouse"
      ) {
        // Intentionally left blank. The W3C Pointer Events specification is ambiguous on what cancel means
        // for mouse input, and there is no evidence that this event is actually generated (6/19/2015).
      } else if (event.type === "pointerup" && event.pointerType === "mouse") {
        this.handleMouseUp(event);
      } else if (
        event.type === "pointerdown" &&
        event.pointerType === "touch"
      ) {
        this.handleTouchStart(event);
      } else if (
        event.type === "pointermove" &&
        event.pointerType === "touch"
      ) {
        this.handleTouchMove(event);
      } else if (
        event.type === "pointercancel" &&
        event.pointerType === "touch"
      ) {
        this.handleTouchCancel(event);
      } else if (event.type === "pointerup" && event.pointerType === "touch") {
        this.handleTouchEnd(event);
      } else {
        Logger.logMessage(
          Logger.LEVEL_INFO,
          "GestureRecognizer",
          "handleEvent",
          "Unrecognized event type: " + event.type
        );
      }
    } catch (e) {
      Logger.logMessage(
        Logger.LEVEL_SEVERE,
        "GestureRecognizer",
        "handleEvent",
        "Error handling event.\n" + e.toString()
      );
    }
  }

  // Intentionally not documented.
  handleMouseDown(event) {
    if (event.type == "mousedown" && this._touches.length > 0) {
      return; // ignore synthesized mouse down events on Android Chrome
    }

    var buttonBit = 1 << event.button;
    if (buttonBit & (this._mouseButtonMask != 0)) {
      return; // ignore redundant mouse down events
    }

    if (this._mouseButtonMask == 0) {
      // first button down
      this._clientX = event.clientX;
      this._clientY = event.clientY;
      this._clientStartX = event.clientX;
      this._clientStartY = event.clientY;
      this._translationX = 0;
      this._translationY = 0;
    }

    this._mouseButtonMask |= buttonBit;
    this.mouseDown(event);
  }

  // Intentionally not documented.
  handleMouseMove(event) {
    if (this._mouseButtonMask == 0) {
      return; // ignore mouse move events when this recognizer does not consider any button to be down
    }

    if (this._clientX == event.clientX && this._clientY == event._clientY) {
      return; // ignore redundant mouse move events
    }

    var dx = event.clientX - this._clientStartX,
      dy = event.clientY - this._clientStartY,
      w = this._translationWeight;
    this._clientX = event.clientX;
    this._clientY = event.clientY;
    this._translationX = this._translationX * (1 - w) + dx * w;
    this._translationY = this._translationY * (1 - w) + dy * w;
    this.mouseMove(event);
  }

  // Intentionally not documented.
  handleMouseUp(event) {
    var buttonBit = 1 << event.button;
    if (buttonBit & (this._mouseButtonMask == 0)) {
      return; // ignore mouse up events for buttons this recognizer does not consider to be down
    }

    this._mouseButtonMask &= ~buttonBit;
    this.mouseUp(event);

    if (this._mouseButtonMask == 0) {
      this.resetIfEventsEnded(); // last button up
    }
  }

  // Intentionally not documented.
  handleTouchStart(event) {
    var touch = new Touch(
      event.identifier || event.pointerId,
      event.clientX,
      event.clientY
    ); // touch events or pointer events
    this._touches.push(touch);

    if (this._touches.length == 1) {
      // first touch
      this._clientX = event.clientX;
      this._clientY = event.clientY;
      this._clientStartX = event.clientX;
      this._clientStartY = event.clientY;
      this._translationX = 0;
      this._translationY = 0;
      this._touchCentroidShiftX = 0;
      this._touchCentroidShiftY = 0;
    } else {
      this.touchesAddedOrRemoved();
    }

    this.touchStart(touch);
  }

  // Intentionally not documented.
  handleTouchMove(event) {
    var index = this.indexOfTouchWithId(event.identifier || event.pointerId); // touch events or pointer events
    if (index == -1) {
      return; // ignore events for touches that did not start in this recognizer's target
    }

    var touch = this._touches[index];
    if (touch.clientX == event.clientX && touch.clientY == event.clientY) {
      return; // ignore redundant touch move events, which we've encountered on Android Chrome
    }

    touch.clientX = event.clientX;
    touch.clientY = event.clientY;

    var centroid = this.touchCentroid(),
      dx = centroid.clientX - this._clientStartX + this._touchCentroidShiftX,
      dy = centroid.clientY - this._clientStartY + this._touchCentroidShiftY,
      w = this._translationWeight;
    this._clientX = centroid.clientX;
    this._clientY = centroid.clientY;
    this._translationX = this._translationX * (1 - w) + dx * w;
    this._translationY = this._translationY * (1 - w) + dy * w;

    this.touchMove(touch);
  }

  // Intentionally not documented.
  handleTouchCancel(event) {
    var index = this.indexOfTouchWithId(event.identifier || event.pointerId); // touch events or pointer events
    if (index == -1) {
      return; // ignore events for touches that did not start in this recognizer's target
    }

    var touch = this._touches[index];
    this._touches.splice(index, 1);
    this.touchesAddedOrRemoved();
    this.touchCancel(touch);
    this.resetIfEventsEnded();
  }

  // Intentionally not documented.
  handleTouchEnd(event) {
    var index = this.indexOfTouchWithId(event.identifier || event.pointerId); // touch events or pointer events
    if (index == -1) {
      return; // ignore events for touches that did not start in this recognizer's target
    }

    var touch = this._touches[index];
    this._touches.splice(index, 1);
    this.touchesAddedOrRemoved();
    this.touchEnd(touch);
    this.resetIfEventsEnded();
  }

  // Intentionally not documented.
  resetIfEventsEnded() {
    if (
      this._state != WorldWindConstants.POSSIBLE &&
      this._mouseButtonMask == 0 &&
      this._touches.length == 0
    ) {
      this.reset();
    }
  }

  // Intentionally not documented.
  touchesAddedOrRemoved() {
    this._touchCentroidShiftX += this._clientX;
    this._touchCentroidShiftY += this._clientY;
    var centroid = this.touchCentroid();
    this._clientX = centroid.clientX;
    this._clientY = centroid.clientY;
    this._touchCentroidShiftX -= this._clientX;
    this._touchCentroidShiftY -= this._clientY;
  }

  // Intentionally not documented.
  touchCentroid() {
    var x = 0,
      y = 0;

    for (var i = 0, len = this._touches.length; i < len; i++) {
      var touch = this._touches[i];
      x += touch.clientX / len;
      y += touch.clientY / len;
    }

    return { clientX: x, clientY: y };
  }

  // Intentionally not documented.
  indexOfTouchWithId(identifier) {
    for (var i = 0, len = this._touches.length; i < len; i++) {
      if (this._touches[i].identifier == identifier) {
        return i;
      }
    }

    return -1;
  }
}
export default GestureRecognizer;
