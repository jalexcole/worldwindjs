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
import ShapeEditorConstants from "./ShapeEditorConstants";
import Placemark from "../../shapes/Placemark";

// Internal use only.
class PlacemarkEditorFragment {
  constructor() { }
  // Internal use only.
  canHandle(shape) {
    return shape instanceof Placemark;
  }
  // Internal use only.
  createShadowShape(shape) {
    return new Placemark(shape.position, null, shape.attributes);
  }
  // Internal use only.
  getShapeCenter(shape) {
    return shape.position;
  }
  // Internal use only.
  initializeControlElements(shape,
    controlPoints,
    shadowControlPoints,
    accessories,
    resizeControlPointAttributes,
    rotateControlPointAttributes,
    moveControlPointAttributes) {
    if (moveControlPointAttributes) {
      // we will use the same Placemark as control point
      shape.userProperties.purpose = ShapeEditorConstants.DRAG;
      controlPoints.push(shape);
    }
  }
  // Internal use only.
  updateControlElements(shape,
    globe,
    controlPoints) {
    controlPoints[0].position = shape.position;
  }
  // Internal use only.
  reshape(shape,
    globe,
    controlPoint,
    currentPosition,
    previousPosition) {
    return false;
  }
}

PlacemarkEditorFragment.prototype = Object.create(
  BaseSurfaceEditorFragment.prototype
);







export default PlacemarkEditorFragment;
