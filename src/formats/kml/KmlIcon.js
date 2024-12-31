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
import KmlLink from "./KmlLink";
import KmlElements from "./KmlElements";
import KmlNodeTransformers from "./util/KmlNodeTransformers";

/**
 * Constructs an KmlIcon. Applications usually don't call this constructor. It is called by {@link KmlFile} as
 * objects from Kml file are read. This object is already concrete implementation.
 * @alias KmlIcon
 * @classdesc Contains the data associated with Icon node.
 * @param options {Object}
 * @param options.objectNode {Node} Node representing icon in the document.
 * @constructor
 * @throws {ArgumentError} If the node is null or undefined.
 * @see https://developers.google.com/kml/documentation/kmlreference#icon
 * @augments KmlLink
 */
class KmlIcon extends KmlLink{
  constructor(options) {
    super(options);
  }
  /**
   * @inheritDoc
   */
  getTagNames() {
    return ["Icon"];
  }
}

Object.defineProperties(KmlIcon.prototype, {
  /**
   * The href can contain a pallet of icons. In this case this is offset from left border.
   * @memberof KmlIcon.prototype
   * @readonly
   * @type {Number}
   */
  kmlX: {
    get: function () {
      return this._factory.specific(this, {
        name: "gx:x",
        transformer: KmlNodeTransformers.number,
      });
    },
  },

  /**
   * The href can contain a pallet of icons. In this case this is offset from top border.
   * @memberof KmlIcon.prototype
   * @readonly
   * @type {Number}
   */
  kmlY: {
    get: function () {
      return this._factory.specific(this, {
        name: "gx:y",
        transformer: KmlNodeTransformers.number,
      });
    },
  },

  /**
   * The href can contain a pallet of icons. In this case this is width of the icon on the pallete.
   * @memberof KmlIcon.prototype
   * @readonly
   * @type {Number}
   */
  kmlW: {
    get: function () {
      return this._factory.specific(this, {
        name: "gx:w",
        transformer: KmlNodeTransformers.number,
      });
    },
  },

  /**
   * The href can contain a pallet of icons. In this case this is height of the icon on the palette.
   * @memberof KmlIcon.prototype
   * @readonly
   * @type {Number}
   */
  kmlH: {
    get: function () {
      return this._factory.specific(this, {
        name: "gx:h",
        transformer: KmlNodeTransformers.number,
      });
    },
  },
});


KmlElements.addKey(KmlIcon.prototype.getTagNames()[0], KmlIcon);

export default KmlIcon;
