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
import Location from "../../../geom/Location";
import Position from "../../../geom/Position";
import WktElements from "../WktElements";
import WktObject from "./WktObject";
import WktType from "../WktType";

/**
 * This item can contain other geometries to be shown.
 * @alias WktGeometryCollection
 * @augments WktObject
 * @constructor
 */
class WktGeometryCollection extends WktObject{
  constructor() {
    super(WktType.SupportedGeometries.GEOMETRY_COLLECTION);

    this.objects = [];
  }
  /**
   * It takes an object and adds it among those, it will render
   * @param object {WktObject} Object to be added to this collection.
   */
  add(object) {
    this.objects.push(object);
  }
  /**
   * In geometry collection the coordinates should belong to the currently parsed object.
   * Array containing latitude, longitude and potentially either altitude or LRS.
   * @inheritDoc
   */
  addCoordinates(coordinates) {
    var object = this.objects[this.objects.length - 1];
    if (this._is3d) {
      object.coordinates.push(
        new Position(coordinates[0], coordinates[1], coordinates[2] || 0)
      );
    } else {
      object.coordinates.push(new Location(coordinates[0], coordinates[1]));
    }
  }
  /**
   * It returns representation for all shapes in the GeometryCollection.
   * @inheritDoc
   * @return {Renderable[]}
   */
  shapes() {
    var shapes = [];

    this.objects.forEach(function (associatedShapes) {
      associatedShapes.shapes().forEach(function (shape) {
        shapes.push(shape);
      });
    });

    return shapes;
  }
}

// WktGeometryCollection.prototype = Object.create(WktObject.prototype);

WktElements["GEOMETRYCOLLECTION"] = WktGeometryCollection;

export default WktGeometryCollection;
