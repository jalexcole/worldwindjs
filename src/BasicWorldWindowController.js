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
import Angle from "./geom/Angle";
import ArgumentError from "./error/ArgumentError";
import Camera from "./geom/Camera";
import ClickRecognizer from "./gesture/ClickRecognizer";
import DragRecognizer from "./gesture/DragRecognizer";
import GestureRecognizer from "./gesture/GestureRecognizer";
import Logger from "./util/Logger";
import LookAt from "./geom/LookAt";
import Matrix from "./geom/Matrix";
import PanRecognizer from "./gesture/PanRecognizer";
import PinchRecognizer from "./gesture/PinchRecognizer";
import Position from "./geom/Position";
import RotationRecognizer from "./gesture/RotationRecognizer";
import TapRecognizer from "./gesture/TapRecognizer";
import TiltRecognizer from "./gesture/TiltRecognizer";
import Vec2 from "./geom/Vec2";
import Vec3 from "./geom/Vec3";
import WorldWindowController from "./WorldWindowController";
import WWMath from "./util/WWMath";
import WorldWindow from "./WorldWindow";

class BasicWorldWindowController extends WorldWindowController {
  /**
 * Constructs a window controller with basic capabilities.
 * @alias BasicWorldWindowController
 * @constructor
 
 * @classDesc This class provides the default window controller for WorldWind for controlling the globe via user interaction.
 * @param {WorldWindow} worldWindow The WorldWindow associated with this layer.
 */
  constructor(worldWindow) {
    // base class checks for a valid worldWindow
    super(worldWindow);
    // Intentionally not documented.
    this.primaryDragRecognizer = new DragRecognizer(this.wwd, null);
    this.primaryDragRecognizer.addListener(this);

    // Intentionally not documented.
    this.secondaryDragRecognizer = new DragRecognizer(this.wwd, null);
    this.secondaryDragRecognizer.addListener(this);
    this.secondaryDragRecognizer.button = 2; // secondary mouse button

    // Intentionally not documented.
    this.panRecognizer = new PanRecognizer(this.wwd, null);
    this.panRecognizer.addListener(this);

    // Intentionally not documented.
    this.pinchRecognizer = new PinchRecognizer(this.wwd, null);
    this.pinchRecognizer.addListener(this);

    // Intentionally not documented.
    this.rotationRecognizer = new RotationRecognizer(this.wwd, null);
    this.rotationRecognizer.addListener(this);

    // Intentionally not documented.
    this.tiltRecognizer = new TiltRecognizer(this.wwd, null);
    this.tiltRecognizer.addListener(this);

    // Establish the dependencies between gesture recognizers. The pan, pinch and rotate gesture may recognize
    // simultaneously with each other.
    this.panRecognizer.recognizeSimultaneouslyWith(this.pinchRecognizer);
    this.panRecognizer.recognizeSimultaneouslyWith(this.rotationRecognizer);
    this.pinchRecognizer.recognizeSimultaneouslyWith(this.rotationRecognizer);

    // Since the tilt gesture is a subset of the pan gesture, pan will typically recognize before tilt,
    // effectively suppressing tilt. Establish a dependency between the other touch gestures and tilt to provide
    // tilt an opportunity to recognize.
    this.panRecognizer.requireRecognizerToFail(this.tiltRecognizer);
    this.pinchRecognizer.requireRecognizerToFail(this.tiltRecognizer);
    this.rotationRecognizer.requireRecognizerToFail(this.tiltRecognizer);

    // Intentionally not documented.
    // this.tapRecognizer = new TapRecognizer(this.wwd, null);
    // this.tapRecognizer.addListener(this);

    // Intentionally not documented.
    // this.clickRecognizer = new ClickRecognizer(this.wwd, null);
    // this.clickRecognizer.addListener(this);

    // Intentionally not documented.
    this.beginPoint = new Vec2(0, 0);
    this.lastPoint = new Vec2(0, 0);
    this.lastRotation = 0;
    this.lastWheelEvent = 0;
    this.activeGestures = 0;

    /**
     * Internal use only.
     * A copy of the viewing parameters at the start of a gesture as a look at view.
     * @ignore
     */
    this.beginLookAt = new LookAt();

    /**
     * Internal use only.
     * The current state of the viewing parameters during a gesture as a look at view.
     * @ignore
     */
    this.lookAt = new LookAt();
  }

  // Intentionally not documented.
  onGestureEvent(e) {
    var handled = WorldWindowController.prototype.onGestureEvent.call(this, e);

    if (!handled) {
      if (e.type === "wheel") {
        handled = true;
        this.handleWheelEvent(e);
      } else {
        for (
          var i = 0, len = GestureRecognizer.allRecognizers.length;
          i < len;
          i++
        ) {
          var recognizer = GestureRecognizer.allRecognizers[i];
          if (recognizer.target === this.wwd) {
            handled |= recognizer.onGestureEvent(e); // use or-assignment to indicate if any recognizer handled the event
          }
        }
      }
    }

    return handled;
  }

  // Intentionally not documented.
  gestureStateChanged(recognizer) {
    if (
      recognizer === this.primaryDragRecognizer ||
      recognizer === this.panRecognizer
    ) {
      this.handlePanOrDrag(recognizer);
    } else if (recognizer === this.secondaryDragRecognizer) {
      this.handleSecondaryDrag(recognizer);
    } else if (recognizer === this.pinchRecognizer) {
      this.handlePinch(recognizer);
    } else if (recognizer === this.rotationRecognizer) {
      this.handleRotation(recognizer);
    } else if (recognizer === this.tiltRecognizer) {
      this.handleTilt(recognizer);
    }
    // else if (recognizer === this.clickRecognizer || recognizer === this.tapRecognizer) {
    //     this.handleClickOrTap(recognizer);
    // }
  }

  // Intentionally not documented.
  // BasicWorldWindowController.prototype.handleClickOrTap = function (recognizer) {
  //     if (recognizer.state === WorldWindConstants.RECOGNIZED) {
  //         var pickPoint = this.wwd.canvasCoordinates(recognizer.clientX, recognizer.clientY);
  //
  //         // Identify if the top picked object contains a URL for hyperlinking
  //         var pickList = this.wwd.pick(pickPoint);
  //         var topObject = pickList.topPickedObject();
  //         // If the url object was appended, open the hyperlink
  //         if (topObject &&
  //             topObject.userObject &&
  //             topObject.userObject.userProperties &&
  //             topObject.userObject.userProperties.url) {
  //             window.open(topObject.userObject.userProperties.url, "_blank");
  //         }
  //     }
  // };

  // Intentionally not documented.
  handlePanOrDrag(recognizer) {
    if (this.wwd.globe.is2D()) {
      this.handlePanOrDrag2D(recognizer);
    } else {
      this.handlePanOrDrag3D(recognizer);
    }
  }

  // Intentionally not documented.
  handlePanOrDrag3D(recognizer) {
    var state = recognizer.state,
      tx = recognizer.translationX,
      ty = recognizer.translationY;

    if (state === WorldWindConstants.BEGAN) {
      this.gestureDidBegin();
      this.lastPoint.set(0, 0);
    } else if (state === WorldWindConstants.CHANGED) {
      // Convert the translation from screen coordinates to arc degrees. Use the view's range as a
      // metric for converting screen pixels to meters, and use the globe's radius for converting from meters
      // to arc degrees.
      var lookAt = this.lookAt,
        canvas = this.wwd.canvas,
        globe = this.wwd.globe,
        globeRadius = WWMath.max(globe.equatorialRadius, globe.polarRadius),
        distance = WWMath.max(1, lookAt.range),
        metersPerPixel = WWMath.perspectivePixelSize(
          canvas.clientWidth,
          canvas.clientHeight,
          distance
        ),
        forwardMeters = (ty - this.lastPoint[1]) * metersPerPixel,
        sideMeters = -(tx - this.lastPoint[0]) * metersPerPixel,
        forwardDegrees =
          (forwardMeters / globeRadius) * Angle.RADIANS_TO_DEGREES,
        sideDegrees = (sideMeters / globeRadius) * Angle.RADIANS_TO_DEGREES;

      // Apply the change in latitude and longitude to the view, relative to the current heading.
      var sinHeading = Math.sin(lookAt.heading * Angle.DEGREES_TO_RADIANS),
        cosHeading = Math.cos(lookAt.heading * Angle.DEGREES_TO_RADIANS);

      lookAt.position.latitude +=
        forwardDegrees * cosHeading - sideDegrees * sinHeading;
      lookAt.position.longitude +=
        forwardDegrees * sinHeading + sideDegrees * cosHeading;
      this.lastPoint.set(tx, ty);
      this.applyChanges();
    } else if (
      state === WorldWindConstants.ENDED ||
      state === WorldWindConstants.CANCELLED
    ) {
      this.gestureDidEnd();
    }
  }

  // Intentionally not documented.
  handlePanOrDrag2D(recognizer) {
    var state = recognizer.state,
      x = recognizer.clientX,
      y = recognizer.clientY,
      tx = recognizer.translationX,
      ty = recognizer.translationY;

    if (state === WorldWindConstants.BEGAN) {
      this.gestureDidBegin();
      this.beginPoint.set(x, y);
      this.lastPoint.set(x, y);
    } else if (state === WorldWindConstants.CHANGED) {
      var x1 = this.lastPoint[0],
        y1 = this.lastPoint[1],
        x2 = this.beginPoint[0] + tx,
        y2 = this.beginPoint[1] + ty;

      this.lastPoint.set(x2, y2);

      var lookAt = this.lookAt,
        globe = this.wwd.globe,
        ray = this.wwd.rayThroughScreenPoint(
          this.wwd.canvasCoordinates(x1, y1)
        ),
        point1 = new Vec3(0, 0, 0),
        point2 = new Vec3(0, 0, 0),
        origin = new Vec3(0, 0, 0);

      if (!globe.intersectsLine(ray, point1)) {
        return;
      }

      ray = this.wwd.rayThroughScreenPoint(this.wwd.canvasCoordinates(x2, y2));
      if (!globe.intersectsLine(ray, point2)) {
        return;
      }

      // Transform the original view's modelview matrix to account for the gesture's change.
      var modelview = Matrix.fromIdentity();
      this.wwd.lookAtToViewingTransform(lookAt, modelview);
      modelview.multiplyByTranslation(
        point2[0] - point1[0],
        point2[1] - point1[1],
        point2[2] - point1[2]
      );

      // Compute the globe point at the screen center from the perspective of the transformed view.
      modelview.extractEyePoint(ray.origin);
      modelview.extractForwardVector(ray.direction);
      if (!globe.intersectsLine(ray, origin)) {
        return;
      }

      // Convert the transformed modelview matrix to a set of view properties, then apply those
      // properties to this view.
      var params = modelview.extractViewingParameters(
        origin,
        lookAt.roll,
        globe,
        {}
      );
      lookAt.position.copy(params.origin);
      lookAt.range = params.range;
      lookAt.heading = params.heading;
      lookAt.tilt = params.tilt;
      lookAt.roll = params.roll;
      this.applyChanges();
    } else if (
      state === WorldWindConstants.ENDED ||
      state === WorldWindConstants.CANCELLED
    ) {
      this.gestureDidEnd();
    }
  }

  // Intentionally not documented.
  handleSecondaryDrag(recognizer) {
    var state = recognizer.state,
      tx = recognizer.translationX,
      ty = recognizer.translationY;

    if (state === WorldWindConstants.BEGAN) {
      this.gestureDidBegin();
    } else if (state === WorldWindConstants.CHANGED) {
      // Compute the current translation from screen coordinates to degrees. Use the canvas dimensions as a
      // metric for converting the gesture translation to a fraction of an angle.
      var lookAt = this.lookAt,
        headingDegrees = (180 * tx) / this.wwd.canvas.clientWidth,
        tiltDegrees = (90 * ty) / this.wwd.canvas.clientHeight;

      // Apply the change in heading and tilt to this view's corresponding properties.
      lookAt.heading = this.beginLookAt.heading + headingDegrees;
      lookAt.tilt = this.beginLookAt.tilt + tiltDegrees;
      this.applyChanges();
    } else if (
      state === WorldWindConstants.ENDED ||
      state === WorldWindConstants.CANCELLED
    ) {
      this.gestureDidEnd();
    }
  }

  // Intentionally not documented.
  handlePinch(recognizer) {
    var state = recognizer.state,
      scale = recognizer.scale;

    if (state === WorldWindConstants.BEGAN) {
      this.gestureDidBegin();
    } else if (state === WorldWindConstants.CHANGED) {
      if (scale !== 0) {
        // Apply the change in pinch scale to this view's range, relative to the range when the gesture
        // began.
        var lookAt = this.lookAt;
        lookAt.range = this.beginLookAt.range / scale;
        this.applyChanges();
      }
    } else if (
      state === WorldWindConstants.ENDED ||
      state === WorldWindConstants.CANCELLED
    ) {
      this.gestureDidEnd();
    }
  }

  // Intentionally not documented.
  handleRotation(recognizer) {
    var state = recognizer.state,
      rotation = recognizer.rotation;

    if (state === WorldWindConstants.BEGAN) {
      this.gestureDidBegin();
      this.lastRotation = 0;
    } else if (state === WorldWindConstants.CHANGED) {
      // Apply the change in gesture rotation to this view's current heading. We apply relative to the
      // current heading rather than the heading when the gesture began in order to work simultaneously with
      // pan operations that also modify the current heading.
      var lookAt = this.lookAt;
      lookAt.heading -= rotation - this.lastRotation;
      this.lastRotation = rotation;
      this.applyChanges();
    } else if (
      state === WorldWindConstants.ENDED ||
      state === WorldWindConstants.CANCELLED
    ) {
      this.gestureDidEnd();
    }
  }

  // Intentionally not documented.
  handleTilt(recognizer) {
    var state = recognizer.state,
      ty = recognizer.translationY;

    if (state === WorldWindConstants.BEGAN) {
      this.gestureDidBegin();
    } else if (state === WorldWindConstants.CHANGED) {
      // Compute the gesture translation from screen coordinates to degrees. Use the canvas dimensions as a
      // metric for converting the translation to a fraction of an angle.
      var tiltDegrees = (-90 * ty) / this.wwd.canvas.clientHeight;
      // Apply the change in heading and tilt to this view's corresponding properties.
      var lookAt = this.lookAt;
      lookAt.tilt = this.beginLookAt.tilt + tiltDegrees;
      this.applyChanges();
    } else if (
      state === WorldWindConstants.ENDED ||
      state === WorldWindConstants.CANCELLED
    ) {
      this.gestureDidEnd();
    }
  }

  // Intentionally not documented.
  handleWheelEvent(event) {
    var lookAt = this.lookAt;
    var timeStamp = event.timeStamp;
    if (timeStamp - this.lastWheelEvent > 500) {
      this.wwd.cameraAsLookAt(lookAt);
      this.lastWheelEvent = timeStamp;
    }
    // Normalize the wheel delta based on the wheel delta mode. This produces a roughly consistent delta across
    // browsers and input devices.
    var normalizedDelta;
    if (event.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
      normalizedDelta = event.deltaY;
    } else if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      normalizedDelta = event.deltaY * 40;
    } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      normalizedDelta = event.deltaY * 400;
    }

    // Compute a zoom scale factor by adding a fraction of the normalized delta to 1. When multiplied by the
    // view's range, this has the effect of zooming out or zooming in depending on whether the delta is
    // positive or negative, respectfully.
    var scale = 1 + normalizedDelta / 1000;

    // Apply the scale to this view's properties.
    lookAt.range *= scale;
    this.applyChanges();
  }

  /**
   * Internal use only.
   * Limits the properties of a look at view to prevent unwanted navigation behaviour and update camera view.
   * @ignore
   */
  applyChanges() {
    var lookAt = this.lookAt;

    // Clamp latitude to between -90 and +90, and normalize longitude to between -180 and +180.
    lookAt.position.latitude = WWMath.clamp(lookAt.position.latitude, -90, 90);
    lookAt.position.longitude = Angle.normalizedDegreesLongitude(
      lookAt.position.longitude
    );

    // Clamp range to values greater than 1 in order to prevent degenerating to a first-person lookAt when
    // range is zero.
    lookAt.range = WWMath.clamp(lookAt.range, 1, Number.MAX_VALUE);

    // Normalize heading to between -180 and +180.
    lookAt.heading = Angle.normalizedDegrees(lookAt.heading);

    // Clamp tilt to between 0 and +90 to prevent the viewer from going upside down.
    lookAt.tilt = WWMath.clamp(lookAt.tilt, 0, 90);

    // Normalize roll to between -180 and +180.
    lookAt.roll = Angle.normalizedDegrees(lookAt.roll);

    // Apply 2D limits when the globe is 2D.
    if (this.wwd.globe.is2D()) {
      // Clamp range to prevent more than 360 degrees of visible longitude. Assumes a 45 degree horizontal
      // field of view.
      var maxRange = 2 * Math.PI * this.wwd.globe.equatorialRadius;
      lookAt.range = WWMath.clamp(lookAt.range, 1, maxRange);

      // Force tilt to 0 when in 2D mode to keep the viewer looking straight down.
      lookAt.tilt = 0;
    }

    // Update camera view.
    this.wwd.cameraFromLookAt(lookAt);
    this.wwd.redraw();
  }

  /**
   * Internal use only.
   * Sets common variables at the beginning of gesture.
   * @ignore
   */
  gestureDidBegin() {
    if (this.activeGestures++ === 0) {
      this.wwd.cameraAsLookAt(this.beginLookAt);
      this.lookAt.copy(this.beginLookAt);
    }
  }

  gestureDidEnd() {
    // this should always be the case, but we check anyway
    if (this.activeGestures > 0) {
      this.activeGestures--;
    }
  }
}
export default BasicWorldWindowController;
