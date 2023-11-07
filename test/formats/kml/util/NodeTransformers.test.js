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
// import {
//   KmlLinearRing,
//   KmlLineString,
//   XmlDocument,
// } from "../../../../src/WorldWind";
import KmlNodeTransformers from "../../../../src/formats/kml/util/KmlNodeTransformers";
import { afterEach, beforeEach,expect, describe, it } from "vitest";
import XmlDocument from "../../../../src/util/XmlDocument";
import KmlLineString from "../../../../src/formats/kml/geom/KmlLineString";
import KmlLinearRing from "../../../../src/formats/kml/geom/KmlLinearRing";
describe("NodeTransformersTest", function () {
  var exampleDocument =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<kml xmlns="http://www.opengis.net/kml/2.2">' +
    '<MultiGeometry id="7">' +
    '   <LineString id="8">' +
    "       <coordinates>10,10,0 20,10,0</coordinates>" +
    "   </LineString>" +
    '   <LineString id="9">' +
    "       <extrude>0</extrude>" +
    "   </LineString>" +
    '   <LinearRing id="16">' +
    "       <coordinates>10,10,0 20,10,0</coordinates>" +
    "   </LinearRing>" +
    "</MultiGeometry>" +
    '<Placemark id="11">' +
    '   <Point id="13">' +
    "       <extrude>0</extrude>" +
    "   </Point>" +
    "</Placemark>" +
    '<Icon id="10">' +
    "   <x>10</x>" +
    "</Icon>" +
    "</kml>";
  var document = new XmlDocument(exampleDocument).dom();

  it("should correctly return the value of the node", function () {
    var node = document.getElementById("8");
    var result = KmlNodeTransformers.string(node.childNodes[1]);
    expect("10,10,0 20,10,0").toEqual(result);
  });

  it("should correctly retrieve the number from the node", function () {
    var node = document.getElementById("10");
    var result = KmlNodeTransformers.number(node.childNodes[1]);
    expect(10).toEqual(result);
  });

  it("should correctly retrieve the boolean from the node", function () {
    var node = document.getElementById("9");
    var result = KmlNodeTransformers.boolean(node.childNodes[1]);
    expect(false).toEqual(result);
  });

  it("should correctly retrieve the associated element", function () {
    var node = document.getElementById("8");
    var result = KmlNodeTransformers.kmlObject(node);
    expect(result instanceof KmlLineString).toBeTruthy();
  });

  it("should correctly retrieve the value of the attribute", function () {
    var node = document.getElementById("11");
    var result = KmlNodeTransformers.attribute("id")(node);
    expect("11").toEqual(result);
  });

  it("should retrieve the position", function () {
    var node = document.getElementById("8");
    var result = KmlNodeTransformers.positions(node.childNodes[1]);
    expect(result.length).toEqual(2);
  });

  it("should retrieve LinearRing", function () {
    var node = document.getElementById("7");
    var result = KmlNodeTransformers.linearRing(node);
    expect(result instanceof KmlLinearRing).toBeTruthy();
  });
});
