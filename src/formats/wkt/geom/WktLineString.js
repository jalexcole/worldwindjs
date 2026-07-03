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
import WktElements from "../WktElements.js";
import WktType from "../WktType.js";
import WktObject from "./WktObject";

/**
 * It represents WKT LineString.
 * @alias WktLineString
 * @augments WktObject
 * @constructor
 */
class WktLineString extends WktObject{
  constructor() {
    super(WktType.SupportedGeometries.LINE_STRING);
  }
  /**
   * In case of 2D return SurfacePolyline, in case of 3D returns Path.
   * @inheritDoc
   * @return {Path[]|SurfacePolyline[]}
   */
  shapes() {
    if (this._is3d) {
      return [new Path(this.coordinates, new ShapeAttributes(null))];
    } else {
      return [new SurfacePolyline(this.coordinates, new ShapeAttributes(null))];
    }
  }
}

// WktLineString.prototype = Object.create(WktObject.prototype);


WktElements["LINESTRING"] = WktLineString;

export default WktLineString;
