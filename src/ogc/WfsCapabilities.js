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
import ArgumentError from "../error/ArgumentError";
import Logger from "../util/Logger";
import OwsLanguageString from "./ows/OwsLanguageString";
import OwsServiceIdentification from "./ows/OwsServiceIdentification";
import OwsServiceProvider from "./ows/OwsServiceProvider";

/**
 * Constructs an WFS Capabilities instance from an XML DOM.
 * @alias WFSCapabilities
 * @constructor
 * @classdesc Represents a WFS Capabilities document. This object holds as properties all the fields
 * specified in the given WFS Capabilities document. Most fields can be accessed as properties named
 * according to their document names converted to camel case. For example, "version", "service.title",
 * "service.contactInformation.contactPersonPrimary".
 * @param {{}} xmlDom An XML DOM representing the WFS Capabilities document.
 * @throws {ArgumentError} If the specified XML DOM is null or undefined.
 */
class WfsCapabilities {
  constructor(xmlDom) {
    if (!xmlDom) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WfsCapabilities",
          "constructor",
          "No XML DOM specified."
        )
      );
    }

    this.assembleDocument(xmlDom);
  }
  static assembleOperations(element) {
    var operations = [];

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName == "Operation") {
        operations.push(child.textContent);
      }
    }

    return operations;
  }
  static assembleFeatureType(element) {
    var featureType = {};

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName == "Name") {
        featureType.name = child.textContent;
      } else if (child.localName == "Title") {
        featureType.title = child.textContent;
      } else if (child.localName == "Abstract") {
        featureType.abstract = child.textContent;
      } else if (child.localName == "Keywords") {
        featureType.keywords = featureType.keywords || [];
        featureType.keywords = WfsCapabilities.assembleKeywords(child);
      } else if (child.localName == "DefaultSRS") {
        featureType.defaultSRS = child.textContent;
      } else if (child.localName == "OtherSRS") {
        featureType.otherSRS = featureType.otherSRS || [];
        featureType.otherSRS.push(child.textContent);
      } else if (child.localName == "WGS84BoundingBox") {
        featureType.wgs84BoundingBox = WfsCapabilities.assembleBoundingBox(child);
      } else if (child.localName == "DefaultCRS") {
        featureType.defaultCRS = child.textContent;
      } else if (child.localName == "OtherCRS") {
        featureType.otherCRS = featureType.otherCRS || [];
        featureType.otherCRS.push(child.textContent);
      } else if (child.localName == "OutputFormats") {
        featureType.outputFormats = WfsCapabilities.assembleOutputFormats(child);
      } else if (child.localName == "MetadataURL") {
        featureType.metadataUrl = WfsCapabilities.assembleMetadataUrl(child);
      }
    }

    return featureType;
  }
  static assembleBoundingBox(element) {
    var result = {};

    var crs = element.getAttribute("crs");
    if (crs) {
      result.crs = crs;
    }

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "LowerCorner") {
        var lc = child.textContent.split(" ");
        result.lowerCorner = [parseFloat(lc[0]), parseFloat(lc[1])];
      } else if (child.localName === "UpperCorner") {
        var uc = child.textContent.split(" ");
        result.upperCorner = [parseFloat(uc[0]), parseFloat(uc[1])];
      }
    }

    return result;
  }
  static assembleOutputFormats(element) {
    var outputFormats = [];

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "Format") {
        outputFormats.push(child.textContent);
      }
    }

    return outputFormats;
  }
  static assembleMetadataUrl(element) {
    var metadataUrl = {};

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];
      // TODO: This code is currently non-functional and will need upgrades when WFS functionality is addressed.
      // In IE 11, element.childNodes can contain more than just Element objects. When this code is upgraded, ensure
      // that the element objects accessed here are actually instances of Element. This is done elsewhere
      // by checking for an appropriate value in the localName attribute which has the side effect of ensuring
      // the correct object type.
      if (child.localName === "MetadataURL") {
        metadataUrl.format = child.getAttribute("format");
        metadataUrl.type = child.getAttribute("type");
      }
    }

    return outputFormats;
  }
  static assembleKeywords(element) {
    var keywords = [];

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "Keyword") {
        keywords.push(child.textContent);
      }
    }

    return keywords;
  }
  static assembleConformance(element) {
    var conformance = [];

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "Constraint") {
        var constraint;
        constraint = WfsCapabilities.assembleConstraint(child);
        constraint.name = child.getAttribute("name");
        conformance.push(constraint);
      }
    }

    return conformance;
  }
  static assembleConstraint(element) {
    var constraint = {};

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];
      if (child.localName === "DefaultValue") {
        constraint.defaultValue = child.textContent;
      }
    }

    return constraint;
  }
  static assembleIdCapabilities(element) {
    var idCapabilities = {};

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "ResourceIdentifier") {
        idCapabilities.resourceIdentifier = child.getAttribute("name");
      }
    }

    return idCapabilities;
  }
  static assembleScalarCapabilities(element) {
    var scalarCapabilities = {};

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "ComparisonOperators") {
        scalarCapabilities.comparisonOperators =
          WfsCapabilities.assembleComparisonOperators(child);
      } else if (child.localName === "ArithmeticOperators") {
        scalarCapabilities.arithmeticOperators =
          WfsCapabilities.assembleArithmeticOperators(child);
      }
    }

    return scalarCapabilities;
  }
  static assembleComparisonOperators(element) {
    var comparisonOperators = [];

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "ComparisonOperator") {
        comparisonOperators.push(child.textContent);
      }
    }

    return comparisonOperators;
  }
  static assembleArithmeticOperators(element) {
    var arithmeticOperators = {};

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "Functions") {
        arithmeticOperators.functions =
          WfsCapabilities.assembleArithmeticFunctions(child);
      }
    }

    return arithmeticOperators;
  }
  static assembleArithmeticFunctions(element) {
    var functionNames = [];

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "FunctionNames") {
        functionNames = WfsCapabilities.assembleFunctionNames(child);
      }
    }

    return functionNames;
  }
  static assembleFunctionNames(element) {
    var functionNames = [];

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "FunctionName") {
        var functionName = {
          name: child.textContent,
          nArgs: child.getAttribute("nArgs"),
        };
        functionNames.push(functionName);
      }
    }

    return functionNames;
  }
  static assembleSpatialCapabilities(element) {
    var spatialCapabilities = {};

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "GeometryOperands") {
        spatialCapabilities.geometryOperands =
          WfsCapabilities.assembleGeometryOperands(child);
      } else if (child.localName === "SpatialOperators") {
        spatialCapabilities.spatialOperators =
          WfsCapabilities.assembleSpatialOperators(child);
      }
    }

    return spatialCapabilities;
  }
  static assembleGeometryOperands(element) {
    var geometryOperands = [];

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "GeometryOperand") {
        geometryOperands.push(child.getAttribute("name"));
      }
    }

    return geometryOperands;
  }
  static assembleSpatialOperators(element) {
    var spatialOperators = [];

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "SpatialOperator") {
        spatialOperators.push(child.getAttribute("name"));
      }
    }

    return spatialOperators;
  }
  static assembleFunctions(element) {
    var functions = [];

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "Function") {
        functions.push(WfsCapabilities.assembleFunction(child));
      }
    }

    return functions;
  }
  static assembleFunction(element) {
    var _function = {};

    _function.name = element.getAttribute("name");
    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "Returns") {
        _function.returns = child.textContent;
      } else if (child.localName === "Arguments") {
        _function.arguments = WfsCapabilities.assembleArguments(child);
      }
    }

    return _function;
  }
  static assembleArguments(element) {
    var _arguments = [];

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "Argument") {
        _arguments.push(WfsCapabilities.assembleArgument(child));
      }
    }

    return _arguments;
  }
  static assembleArgument(element) {
    var argument = {};

    argument.name = element.getAttribute("name");
    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "Type") {
        argument.type = child.textContent;
      }
    }

    return argument;
  }
  assembleDocument(dom) {
    var root = dom.documentElement;

    this.version = root.getAttribute("version");
    this.updateSequence = root.getAttribute("updateSequence");

    var children = root.children || root.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "ServiceIdentification") {
        this.serviceIdentification = new OwsServiceIdentification(child);
      } else if (child.localName === "ServiceProvider") {
        this.serviceProvider = new OwsServiceProvider(child);
      } else if (child.localName === "OperationsMetadata") {
        this.operationsMetadata = new OwsOperationsMetadata(child);
      } else if (child.localName === "FeatureTypeList") {
        this.featureTypeList = this.assembleFeatureTypeList(child);
      } else if (child.localName === "Filter_Capabilities") {
        this.filterCapabilities = this.assembleFilterCapabilities(child);
      }
    }
  }
  assembleFeatureTypeList(element) {
    var featureTypeList = {};

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName == "Operations") {
        featureTypeList.operations = featureTypeList.operations || [];
        try {
          featureTypeList.operations = WfsCapabilities.assembleOperations(child);
        } catch (e) {
          Logger.logMessage(
            Logger.LEVEL_SEVERE,
            "WfsCapabilities",
            "constructor",
            "Exception reading WFS operations description: " + e.message
          );
        }
      } else if (child.localName == "FeatureType") {
        featureTypeList.featureType = featureTypeList.featureType || [];
        try {
          featureTypeList.featureType.push(
            WfsCapabilities.assembleFeatureType(child)
          );
        } catch (e) {
          Logger.logMessage(
            Logger.LEVEL_SEVERE,
            "WfsCapabilities",
            "constructor",
            "Exception reading WFS operations description: " + e.message
          );
        }
      }
    }

    return featureTypeList;
  }
  assembleFilterCapabilities(element) {
    var filterCapabilities = {};

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
      var child = children[c];

      if (child.localName === "Conformance") {
        filterCapabilities.conformance =
          WfsCapabilities.assembleConformance(child);
      } else if (child.localName === "Id_Capabilities") {
        filterCapabilities.idCapabilities =
          WfsCapabilities.assembleIdCapabilities(child);
      } else if (child.localName === "Scalar_Capabilities") {
        filterCapabilities.scalarCapabilities =
          WfsCapabilities.assembleScalarCapabilities(child);
      } else if (child.localName === "Spatial_Capabilities") {
        filterCapabilities.spatialCapabilities =
          WfsCapabilities.assembleSpatialCapabilities(child);
      } else if (child.localName === "Functions") {
        filterCapabilities.functions = WfsCapabilities.assembleFunctions(child);
      }
    }

    return filterCapabilities;
  }
}

























export default WfsCapabilities;
