/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
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
define([
    './HrefResolver',
    './../KmlElements',
    '../KmlObject',
    './NodeTransformers'
], function (HrefResolver,
             KmlElements,
             KmlObject,
             NodeTransformers) {
    "use strict";

    /**
     * Constructs an ItemIcon. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias ItemIcon
     * @constructor
     * @classdesc Contains the data associated with Kml Item Icon
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml Item Icon.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#itemicon
     * @augments KmlObject
     */
    var ItemIcon = function (options) {
        KmlObject.call(this, options);
    };

    ItemIcon.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(ItemIcon.prototype, {
        /**
         * Specifies the current state of the NetworkLink or Folder. Possible values are open, closed, error,
         * fetching0, fetching1, and fetching2. These values can be combined by inserting a space between two values
         * (no comma).
         * @memberof ItemIcon.prototype
         * @readonly
         * @type {String}
         */
        kmlState: {
            get: function () {
                return this._factory.specific(this, {name: 'state', transformer: NodeTransformers.string});
            }
        }
    });

    /**
     * It returns valid URL usable for remote resources.
     * @param fileCache {KmlFileCache} Cache needed to retrieve data urls from remote locations.
     * @returns {String} URL to use.
     */
    ItemIcon.prototype.kmlHref = function(fileCache) {
        return new HrefResolver(
            this._factory.specific(this, {name: 'href', transformer: NodeTransformers.string}), fileCache
        ).url();
    };

    /**
     * @inheritDoc
     */
    ItemIcon.prototype.getTagNames = function () {
        return ['ItemIcon'];
    };

    KmlElements.addKey(ItemIcon.prototype.getTagNames()[0], ItemIcon);

    return ItemIcon;
});