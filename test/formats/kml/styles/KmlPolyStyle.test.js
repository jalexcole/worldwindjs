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
// import { KmlPolyStyle, XmlDocument } from "../../../../src/WorldWind";
import { beforeAll, beforeEach, describe,expect, it } from "vitest";
import XmlDocument from "../../../../src/util/XmlDocument";
import KmlPolyStyle from "../../../../src/formats/kml/styles/KmlPolyStyle";
        describe ("KmlPolyStyle", function(){

        var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
            "<PolyStyle id=\"1\">" +
            "   <color>ffffffff</color>" +
            "   <colorMode>normal</colorMode>" +
            "   <fill>1</fill>" +
            "   <outline>0</outline>" +
            "</PolyStyle>" +
            "</kml>";


                var kmlRepresentation = new XmlDocument(validKml).dom();
                var polyStyle = new KmlPolyStyle({objectNode:
                    kmlRepresentation.getElementsByTagName("PolyStyle")[0]});
            it ("should have the Fill and Outline properties", function(){
                expect(polyStyle.kmlFill).toEqual(true);
                expect(polyStyle.kmlOutline).toEqual(false);

            });

        });
