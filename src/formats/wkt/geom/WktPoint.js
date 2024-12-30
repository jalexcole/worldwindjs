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
import Position from "../../../geom/Position.js";
import WktElements from "../WktElements";
import WktObject from "./WktObject";
import WktType from "../WktType";
import Offset from "../../../util/Offset";
import WorldWindConstants from "../../../WorldWindConstants";

/**
 * It represents Point
 * @alias WktPoint
 * @augments WktObject
 * @constructor
 */
class WktPoint extends WktObject {
  constructor() {
    super(WktType.SupportedGeometries.POINT);
  }
  /**
   * Default Placemark implementation for the Point and MultiPoint.
   * @param coordinates {Location | Position} Location or Position for the Placemark
   * @return {Placemark} Placemark to be displayed on the map.
   */
  static placemark(coordinates) {
    var placemarkAttributes = new PlacemarkAttributes(null);
    placemarkAttributes._imageScale = 1;
    placemarkAttributes._imageOffset = new Offset(
      WorldWindConstants.OFFSET_FRACTION,
      0.3,
      WorldWindConstants.OFFSET_FRACTION,
      0.0
    );
    placemarkAttributes._imageColor = WorldWindConstants.Color.WHITE;
    placemarkAttributes._labelAttributes._offset = new Offset(
      WorldWindConstants.OFFSET_FRACTION,
      0.5,
      WorldWindConstants.OFFSET_FRACTION,
      1.0
    );
    placemarkAttributes._labelAttributes._color = WorldWindConstants.Color.YELLOW;
    placemarkAttributes._drawLeaderLine = true;
    placemarkAttributes._leaderLineAttributes._outlineColor = WorldWindConstants.Color.RED;
    placemarkAttributes._imageSource =
      WorldWindConstants.configuration.baseUrl + "images/pushpins/castshadow-purple.png";

    var placemark = new Placemark(coordinates, true, placemarkAttributes);
    placemark.altitudeMode = WorldWindConstants.RELATIVE_TO_GROUND;

    return placemark;
  }
  /**
   * It returns Placemark representing this point.
   * @return {Placemark[]}
   */
  shapes() {
    return [WktPoint.placemark(this.coordinates[0])];
  }
}





WktElements["POINT"] = WktPoint;

export default WktPoint;
