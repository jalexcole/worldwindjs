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

import Location from "../geom/Location";
import Sector from "../geom/Sector";
import TiledElevationCoverage from "./TiledElevationCoverage";
import WmsUrlBuilder from "../util/WmsUrlBuilder";

/**
 * Constructs an Earth elevation coverage using GEBCO data.
 * @alias GebcoElevationCoverage
 * @constructor
 * @augments TiledElevationCoverage
 * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA WorldWind elevation service.
 */
var GebcoElevationCoverage = function () {
  TiledElevationCoverage.call(this, {
    coverageSector: Sector.FULL_SPHERE,
    resolution: 0.008333333333333,
    retrievalImageFormat: "application/bil16",
    minElevation: -11000,
    maxElevation: 8850,
    urlBuilder: new WmsUrlBuilder(
      "https://worldwind26.arc.nasa.gov/elev",
      "GEBCO",
      "",
      "1.3.0"
    ),
  });

  this.displayName = "GEBCO Earth Elevation Coverage";
};

GebcoElevationCoverage.prototype = Object.create(
  TiledElevationCoverage.prototype
);

export default GebcoElevationCoverage;
