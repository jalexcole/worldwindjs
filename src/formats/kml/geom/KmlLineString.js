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
import Color from "../../../util/Color";
import KmlElements from "../KmlElements";
import KmlGeometry from "./KmlGeometry";
import KmlStyle from "../styles/KmlStyle";
import Location from "../../../geom/Location";
import KmlNodeTransformers from "../util/KmlNodeTransformers";
import Path from "../../../shapes/Path";
import Position from "../../../geom/Position";
import ShapeAttributes from "../../../shapes/ShapeAttributes";
import SurfacePolyline from "../../../shapes/SurfacePolyline";
import WWUtil from "../../../util/WWUtil";
import WorldWindConstants from "../../../WorldWindConstants";

/**
 * Constructs an KmlLineString object.  Applications shouldn't use this constructor. It is used by
 * {@link KmlFile}. KmlLineString represents one line string.
 * @param options {Object}
 * @param options.objectNode {Node} Node representing LineString.
 * @constructor
 * @alias KmlLineString
 * @classdesc Class representing LineString element of KmlFile
 * @see https://developers.google.com/kml/documentation/kmlreference#linestring
 * @augments KmlGeometry
 */
class KmlLineString extends KmlGeometry {
  constructor(options) {
    super(options);

    this._style = null;
  }
  /**
   * It creates Path representing this LineString unless already initialized.
   * @param styles {Object|null}
   * @param styles.normal {KmlStyle} Style applied when item not highlighted
   * @param styles.highlight {KmlStyle} Style applied when item is highlighted
   */
  createPath(styles, fileCache) {
    if (this.kmlAltitudeMode == WorldWindConstants.CLAMP_TO_GROUND) {
      this._renderable = new SurfacePolyline(
        this.prepareLocations(),
        this.prepareAttributes(styles.normal, fileCache)
      );
    } else {
      this._renderable = new Path(
        this.prepareLocations(),
        this.prepareAttributes(styles.normal, fileCache)
      );
    }
    if (styles.highlight) {
      this._renderable.highlightAttributes = this.prepareAttributes(
        styles.highlight,
        fileCache
      );
    }
    this.moveValidProperties();
  }
  render(dc, kmlOptions) {
    super.render(dc, kmlOptions);

    if (kmlOptions.lastStyle && !this._renderable) {
      this.createPath(kmlOptions.lastStyle, kmlOptions.fileCache);
      dc.redrawRequested = true;
    }

    if (this._renderable) {
      this._renderable.enabled = this.enabled;
      this._renderable.render(dc);
    }
  }
  /**
   * @inheritDoc
   */
  prepareAttributes(style, fileCache) {
    var shapeOptions = (style && style.generate(fileCache)) || {};

    shapeOptions._applyLighting = true;
    shapeOptions._drawOutline = true;
    shapeOptions._drawInterior = true;
    shapeOptions._drawVerticals = this.kmlExtrude || false;
    shapeOptions._outlineStippleFactor = 0;
    shapeOptions._outlineStipplePattern = 61680;
    shapeOptions._enableLighting = true;

    return new ShapeAttributes(KmlStyle.shapeAttributes(shapeOptions));
  }
  /**
   * Prepare locations representing current Line String.
   * @returns {Position[]} Positions representing this LineString.
   */
  prepareLocations() {
    return this.kmlPositions;
  }
  /**
   * Moves KML properties from current object into the internal shape representation.
   */
  moveValidProperties() {
    this._renderable.extrude = this.kmlExtrude || false;
    this._renderable.altitudeMode =
      this.kmlAltitudeMode || WorldWindConstants.ABSOLUTE;
    //noinspection JSUnusedGlobalSymbols
    this._renderable.tesselate = this.kmlTesselate || false;
  }
  /**
   * Two line strings are equal when the properties and positions are equal.
   * @param toCompare {KmlLineString} LineString to compare to.
   * @returns {Boolean} True if the LineStrings are equal.
   */
  equals(toCompare) {
    if (!toCompare) {
      return false;
    }
    var positionsEquals = WWUtil.arrayEquals(
      toCompare.kmlPositions,
      this.kmlPositions
    );
    return (
      positionsEquals &&
      toCompare.kmlExtrude == this.kmlExtrude &&
      toCompare.kmlTessellate == this.kmlTessellate &&
      toCompare.kmlAltitudeMode == this.kmlAltitudeMode
    );
  }
  /**
   * @inheritDoc
   */
  getTagNames() {
    return ["LineString"];
  }
}

Object.defineProperties(KmlLineString.prototype, {
  /**
   * Whether current shape should be extruded.
   * @memberof KmlLineString.prototype
   * @readonly
   * @type {Boolean}
   */
  kmlExtrude: {
    get: function () {
      return (
        this._factory.specific(this, {
          name: "extrude",
          transformer: KmlNodeTransformers.boolean,
        }) || false
      );
    },
  },

  /**
   * Whether tessellation should be used for current node.
   * @memberof KmlLineString.prototype
   * @readonly
   * @type {Boolean}
   */
  kmlTessellate: {
    get: function () {
      return (
        this._factory.specific(this, {
          name: "tessellate",
          transformer: KmlNodeTransformers.boolean,
        }) || false
      );
    },
  },

  /**
   * It represents different modes to count absolute altitude. Possible choices are explained in:
   * https://developers.google.com/kml/documentation/kmlreference#point
   * @memberof KmlLineString.prototype
   * @readonly
   * @type {String}
   */
  kmlAltitudeMode: {
    get: function () {
      return (
        this._factory.specific(this, {
          name: "altitudeMode",
          transformer: KmlNodeTransformers.string,
        }) || WorldWindConstants.ABSOLUTE
      );
    },
  },

  /**
   * Positions representing points used by the LineString.
   * @memberof KmlLineString.prototype
   * @readonly
   * @type {Position[]}
   */
  kmlPositions: {
    get: function () {
      return this._factory.specific(this, {
        name: "coordinates",
        transformer: KmlNodeTransformers.positions,
      });
    },
  },

  /**
   * Returns average of the positions, which are part of the LineString. It averages also the altitudes.
   * @memberof KmlLineString.prototype
   * @readonly
   * @type {Position}
   */
  kmlCenter: {
    get: function () {
      // TODO choose better approximation than just plain average.
      var positions = this.kmlPositions;
      var midLatitude = 0;
      var midLongitude = 0;
      var midAltitude = 0;
      positions.forEach(function (position) {
        midLatitude += position.latitude;
        midLongitude += position.longitude;
        midAltitude += position.altitude;
      });
      return new Position(
        midLatitude / this.kmlPositions.length,
        midLongitude / this.kmlPositions.length,
        midAltitude / this.kmlPositions.length
      );
    },
  },
});

KmlElements.addKey(KmlLineString.prototype.getTagNames()[0], KmlLineString);

export default KmlLineString;
