/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import BaseSurfaceEditorFragment from "./BaseSurfaceEditorFragment";
import Location from "../../geom/Location";
import ShapeEditorConstants from "./ShapeEditorConstants";
import SurfaceEllipse from "../../shapes/SurfaceEllipse";

// Internal use only.
var SurfaceEllipseEditorFragment = function () {};

SurfaceEllipseEditorFragment.prototype = Object.create(
  BaseSurfaceEditorFragment.prototype
);

// Internal use only.
SurfaceEllipseEditorFragment.prototype.canHandle = function (shape) {
  if (shape instanceof Function) {
    return shape.name === "SurfaceEllipse";
  }
  return shape instanceof SurfaceEllipse;
};

// Internal use only.
SurfaceEllipseEditorFragment.prototype.createShadowShape = function (shape) {
  return new SurfaceEllipse(
    shape.center,
    shape.majorRadius,
    shape.minorRadius,
    shape.heading,
    shape.attributes
  );
};

// Internal use only.
SurfaceEllipseEditorFragment.prototype.getShapeCenter = function (shape) {
  return shape.center;
};

// Internal use only.
SurfaceEllipseEditorFragment.prototype.isRegularShape = function () {
  return true;
};

// Internal use only.
SurfaceEllipseEditorFragment.prototype.initializeControlElements = function (
  shape,
  controlPoints,
  shadowControlPoints,
  accessories,
  resizeControlPointAttributes,
  rotateControlPointAttributes
) {
  if (resizeControlPointAttributes) {
    this.createControlPoint(
      controlPoints,
      resizeControlPointAttributes,
      ShapeEditorConstants.WIDTH
    );
    this.createControlPoint(
      controlPoints,
      resizeControlPointAttributes,
      ShapeEditorConstants.HEIGHT
    );
  }

  if (rotateControlPointAttributes) {
    this.createControlPoint(
      controlPoints,
      rotateControlPointAttributes,
      ShapeEditorConstants.ROTATION
    );

    this.createRotationAccessory(accessories, rotateControlPointAttributes);
  }
};

// Internal use only.
SurfaceEllipseEditorFragment.prototype.updateControlElements = function (
  shape,
  globe,
  controlPoints,
  shadowControlPoints,
  accessories
) {
  var length = controlPoints.length;

  if (length > 0) {
    for (var i = 0; i < length; i++) {
      if (
        controlPoints[i].userProperties.purpose === ShapeEditorConstants.WIDTH
      ) {
        Location.greatCircleLocation(
          shape.center,
          90 + shape.heading,
          shape.majorRadius / globe.equatorialRadius,
          controlPoints[i].position
        );
        controlPoints[i].userProperties.size = shape.majorRadius;
      }

      if (
        controlPoints[i].userProperties.purpose === ShapeEditorConstants.HEIGHT
      ) {
        Location.greatCircleLocation(
          shape.center,
          shape.heading,
          shape.minorRadius / globe.equatorialRadius,
          controlPoints[i].position
        );
        controlPoints[i].userProperties.size = shape.minorRadius;
      }

      if (
        controlPoints[i].userProperties.purpose ===
        ShapeEditorConstants.ROTATION
      ) {
        Location.greatCircleLocation(
          shape.center,
          shape.heading,
          (1.6 * shape.minorRadius) / globe.equatorialRadius,
          controlPoints[i].position
        );

        controlPoints[i].userProperties.rotation = shape.heading;

        this.updateRotationAccessory(
          shape.center,
          controlPoints[i].position,
          accessories
        );
      }
    }
  }
};

// Internal use only.
SurfaceEllipseEditorFragment.prototype.reshape = function (
  shape,
  globe,
  controlPoint,
  currentPosition,
  previousPosition
) {
  var delta = this.computeControlPointDelta(
    globe,
    currentPosition,
    previousPosition
  );
  var vector = this.computeControlPointDelta(
    globe,
    controlPoint.position,
    shape.center
  ).normalize();

  if (controlPoint.userProperties.purpose === ShapeEditorConstants.WIDTH) {
    var majorRadius = shape.majorRadius + delta.dot(vector) * 2;
    if (majorRadius > 0) {
      shape.majorRadius = majorRadius;
    }
  } else if (
    controlPoint.userProperties.purpose === ShapeEditorConstants.HEIGHT
  ) {
    var minorRadius = shape.minorRadius + delta.dot(vector) * 2;
    if (minorRadius > 0) {
      shape.minorRadius = minorRadius;
    }
  } else if (
    controlPoint.userProperties.purpose === ShapeEditorConstants.ROTATION
  ) {
    var oldHeading = Location.greatCircleAzimuth(
      shape.center,
      previousPosition
    );
    var deltaHeading =
      Location.greatCircleAzimuth(shape.center, currentPosition) - oldHeading;
    shape.heading = this.normalizedHeading(shape.heading, deltaHeading);
  }
};

export default SurfaceEllipseEditorFragment;
