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

// Vitest global setup: registers the custom matchers that were previously
// installed per-suite via Jasmine's jasmine.addMatchers(CustomMatchers), and
// starts a static file server standing in for Karma's "../base/" convention
// so tests that XHR-load fixture files (XML, KML, GeoTIFF, ...) still work.

import { expect } from "vitest";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const mimeTypes = {
  ".xml": "application/xml",
  ".kml": "application/vnd.google-earth.kml+xml",
  ".tif": "image/tiff",
  ".asc": "text/plain",
};

function startFixtureServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const requestedPath = decodeURIComponent(req.url.split("?")[0]);
      const filePath = path.join(projectRoot, requestedPath);
      if (!filePath.startsWith(projectRoot)) {
        res.writeHead(403);
        res.end();
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end();
          return;
        }
        res.writeHead(200, {
          "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(data);
      });
    });
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

const fixtureServer = await startFixtureServer();
fixtureServer.unref();
globalThis.__TEST_FIXTURE_BASE_URL__ = `http://127.0.0.1:${fixtureServer.address().port}`;

// happy-dom's XMLHttpRequest returns a Uint8Array (not a spec-compliant
// ArrayBuffer) for responseType "arraybuffer". Normalize it so code written
// against the real XHR spec (e.g. `dataSource instanceof ArrayBuffer` checks)
// works the same under test as it does in a browser.
if (globalThis.XMLHttpRequest) {
  const xhrBaseProto = Object.getPrototypeOf(globalThis.XMLHttpRequest.prototype);
  const originalResponse = Object.getOwnPropertyDescriptor(xhrBaseProto, "response");
  if (originalResponse && originalResponse.get) {
    Object.defineProperty(xhrBaseProto, "response", {
      configurable: true,
      get() {
        var value = originalResponse.get.call(this);
        if (value instanceof Uint8Array) {
          return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
        }
        return value;
      },
    });
  }
}

// happy-dom's HTMLCanvasElement.getContext() always returns null (no actual
// rasterization support). Delegate to the "canvas" package (node-canvas), the
// same one example-node/ uses to give a real 2D context outside a browser, so
// tests that render to a canvas and inspect pixel data still work.
if (globalThis.HTMLCanvasElement) {
  const { createCanvas } = await import("canvas");
  globalThis.HTMLCanvasElement.prototype.getContext = function (contextType) {
    if (contextType !== "2d") {
      return null;
    }
    if (!this.__nodeCanvas) {
      this.__nodeCanvas = createCanvas(this.width || 300, this.height || 150);
    }
    return this.__nodeCanvas.getContext("2d");
  };
}

// happy-dom's querySelector(All) fails to match tag names that contain an
// underscore (e.g. COLLADA's <float_array>, <library_effects>), always
// returning an empty/null result even though the element exists. Fall back
// to getElementsByTagName-based matching, but only for selectors this bug
// actually affects: a bare tag name, or a chain of tag names joined by the
// descendant combinator (e.g. "library_effects effect") — the only forms
// used anywhere in this codebase. Anything else keeps its native result.
function isPlainTagChain(selector) {
  return selector
    .trim()
    .split(/\s+/)
    .every(function (part) {
      return /^[A-Za-z][\w-]*$/.test(part);
    });
}

function tagChainFallback(root, selector) {
  var parts = selector.trim().split(/\s+/);
  var lastTag = parts[parts.length - 1];
  var candidates = Array.prototype.slice.call(root.getElementsByTagName(lastTag));
  if (parts.length === 1) {
    return candidates;
  }
  var ancestorTags = parts.slice(0, -1);
  return candidates.filter(function (el) {
    var tagIndex = ancestorTags.length - 1;
    var node = el.parentElement;
    while (node && tagIndex >= 0) {
      if (node.tagName === ancestorTags[tagIndex]) {
        tagIndex--;
      }
      node = node.parentElement;
    }
    return tagIndex < 0;
  });
}

function findOwnerPrototype(proto, methodName) {
  while (proto && !Object.hasOwn(proto, methodName)) {
    proto = Object.getPrototypeOf(proto);
  }
  return proto;
}

function patchQuerySelectors(proto) {
  var querySelectorOwner = findOwnerPrototype(proto, "querySelector");
  if (querySelectorOwner) {
    const originalQuerySelector = querySelectorOwner.querySelector;
    querySelectorOwner.querySelector = function (selector) {
      var result = originalQuerySelector.call(this, selector);
      if (!result && selector.includes("_") && isPlainTagChain(selector)) {
        var matches = tagChainFallback(this, selector);
        return matches.length ? matches[0] : null;
      }
      return result;
    };
  }

  var querySelectorAllOwner = findOwnerPrototype(proto, "querySelectorAll");
  if (querySelectorAllOwner) {
    const originalQuerySelectorAll = querySelectorAllOwner.querySelectorAll;
    querySelectorAllOwner.querySelectorAll = function (selector) {
      var result = originalQuerySelectorAll.call(this, selector);
      if ((!result || result.length === 0) && selector.includes("_") && isPlainTagChain(selector)) {
        var matches = tagChainFallback(this, selector);
        matches.item = function (i) {
          return this[i];
        };
        return matches;
      }
      return result;
    };
  }
}

if (globalThis.Element) {
  patchQuerySelectors(globalThis.Element.prototype);
}
if (globalThis.Document) {
  patchQuerySelectors(globalThis.Document.prototype);
}

function compareNumbers(actual, expected, precision) {
  var pow = Math.pow(10, precision + 1);
  var delta = Math.abs(expected - actual);
  var maxDelta = Math.pow(10, -precision) / 2;

  return Math.round(delta * pow) / pow <= maxDelta;
}

expect.extend({
  toBeVec2(actual, expected) {
    var pass = actual[0] === expected[0] && actual[1] === expected[1];
    return {
      pass,
      message: () =>
        `expected [${actual}] ${pass ? "not " : ""}to be Vec2 [${expected}]`,
    };
  },
  toBeVec3(actual, expected) {
    var pass =
      actual[0] === expected[0] &&
      actual[1] === expected[1] &&
      actual[2] === expected[2];
    return {
      pass,
      message: () =>
        `expected [${actual}] ${pass ? "not " : ""}to be Vec3 [${expected}]`,
    };
  },
  toBeCloseToVec2(actual, expected, precision) {
    var pass =
      compareNumbers(actual[0], expected[0], precision) &&
      compareNumbers(actual[1], expected[1], precision);
    return {
      pass,
      message: () =>
        `expected [${actual}] ${pass ? "not " : ""}to be close to Vec2 [${expected}]`,
    };
  },
  toBeCloseToVec3(actual, expected, precision) {
    var pass =
      compareNumbers(actual[0], expected[0], precision) &&
      compareNumbers(actual[1], expected[1], precision) &&
      compareNumbers(actual[2], expected[2], precision);
    return {
      pass,
      message: () =>
        `expected [${actual}] ${pass ? "not " : ""}to be close to Vec3 [${expected}]`,
    };
  },
  toBeCloseToPosition(
    actual,
    expected,
    latitudePrecision,
    longitudePrecision,
    altitudePrecision
  ) {
    var pass =
      compareNumbers(actual.latitude, expected.latitude, latitudePrecision) &&
      compareNumbers(
        actual.longitude,
        expected.longitude,
        longitudePrecision
      ) &&
      compareNumbers(actual.altitude, expected.altitude, altitudePrecision);
    return {
      pass,
      message: () =>
        `expected ${actual} ${pass ? "not " : ""}to be close to position ${expected}`,
    };
  },
  toEqualVec3(actual, expected, delta) {
    var difference = actual.distanceTo(expected);
    var pass = difference <= delta;
    return {
      pass,
      message: () =>
        `Expected ${actual} to equal ${expected}, but the difference is ${difference}`,
    };
  },
  toBeSector(actual, expected) {
    var pass =
      actual.minLatitude === expected.minLatitude &&
      actual.maxLatitude === expected.maxLatitude &&
      actual.minLongitude === expected.minLongitude &&
      actual.maxLongitude === expected.maxLongitude;
    return {
      pass,
      message: () =>
        `expected sector ${pass ? "not " : ""}to equal ${expected}`,
    };
  },
});
