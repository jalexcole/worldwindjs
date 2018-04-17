/*
 * Copyright 2015-2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
/**
 * @exports GebcoElevationCoverage
 */
define([
        '../geom/Location',
        '../geom/Sector',
        '../globe/TiledElevationCoverage',
        '../util/WmsUrlBuilder'
    ],
    function (Location,
              Sector,
              TiledElevationCoverage,
              WmsUrlBuilder) {
        "use strict";

        /**
         * Constructs an Earth elevation coverage using GEBCO data.
         * @alias GebcoElevationCoverage
         * @constructor
         * @augments TiledElevationCoverage
         * @classdesc Provides elevations for Earth. Elevations are drawn from the NASA WorldWind elevation service.
         */
        var GebcoElevationCoverage = function () {
            TiledElevationCoverage.call(this,
                Sector.FULL_SPHERE, new Location(45, 45), 6, "application/bil16",
                "GebcoElevations256", 256, 256, 0.008333333333333);

            this.displayName = "GEBCO Earth Elevation Coverage";
            this.minElevation = -11000;
            this.maxElevation = 8850;
            this.pixelIsPoint = false;
            this.urlBuilder = new WmsUrlBuilder("https://worldwind26.arc.nasa.gov/elev", "GEBCO", "", "1.3.0");
        };

        GebcoElevationCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

        return GebcoElevationCoverage;
    });