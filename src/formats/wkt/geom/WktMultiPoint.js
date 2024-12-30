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
import Placemark from "../../../shapes/Placemark";
import PlacemarkAttributes from "../../../shapes/PlacemarkAttributes";
import WktElements from "../WktElements";
import WktObject from "./WktObject";
import WktPoint from "./WktPoint";
import WktType from "../WktType";

/**
 * It represents multiple points.
 * @alias WktMultiPoint
 * @augments WktObject
 * @constructor
 */
class WktMultiPoint extends WktObject{
  constructor() {
    super(WktType.SupportedGeometries.MULTI_POINT);
  }
  /**
   * Specific for Multi objects as it depicts the boundaries.
   */
  commaWithoutCoordinates() { }
  /**
   * It returns Placemark for each point.
   * @inheritDoc
   * @return {Placemark[]}
   */
  shapes() {
    return this.coordinates.map(
      function (coordinate) {
        return WktPoint.placemark(coordinate);
      }.bind(this)
    );
  }
}

WktElements["MULTIPOINT"] = WktMultiPoint;

export default WktMultiPoint;
