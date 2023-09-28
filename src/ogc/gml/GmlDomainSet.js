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
import ArgumentError from "../../error/ArgumentError";
import GmlRectifiedGrid from "./GmlRectifiedGrid";
import Logger from "../../util/Logger";

var GmlDomainSet = function (element) {
  if (!element) {
    throw new ArgumentError(
      Logger.logMessage(
        Logger.LEVEL_SEVERE,
        "GmlAbstractGeometry",
        "constructor",
        "missingDom"
      )
    );
  }

  this.assembleElement(element);
};

// Internal. Intentionally not documented.
GmlDomainSet.prototype.assembleElement = function (element) {
  var children = element.children || element.childNodes;
  for (var c = 0; c < children.length; c++) {
    var child = children[c];

    if (child.localName === "RectifiedGrid") {
      this.rectifiedGrid = new GmlRectifiedGrid(child);
    }
  }
};

export default GmlDomainSet;
