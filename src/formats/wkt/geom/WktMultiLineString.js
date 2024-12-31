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
import Path from "../../../shapes/Path";
import ShapeAttributes from "../../../shapes/ShapeAttributes";
import SurfacePolyline from "../../../shapes/SurfacePolyline";
import WktObject from "./WktObject.js";
import WktType from "../WktType";

class WktMultiLineString extends WktObject {
  // WktElements["MULTILINESTRING"] = WktMultiLineString;

  /**
   * It represents multiple line string as one object.
   * @alias WktMultiLineString
   *
   * @constructor
   */
  constructor() {
    super(WktType.SupportedGeometries.LINE_STRING);
    this.objectBoundaries = [];
  }
  /**
   * Specific for Multi objects as it depicts the boundaries.
   */
  commaWithoutCoordinates() {
    this.objectBoundaries.push(this.coordinates.slice());
    this.coordinates = [];
  }
  /**
   * In case of 2D it returns SurfacePolyline, In case of 3D return Path.
   * @inheritDoc
   * @return {Path[]|SurfacePolyline[]}
   */
  shapes() {
    this.commaWithoutCoordinates(); // This needs to be more careful and probably move to the stuff
    return this.objectBoundaries.map(
      function (boundaries) {
        return new Path(boundaries, new ShapeAttributes(null));
      }.bind(this)
    );
  }
}








export default WktMultiLineString;
