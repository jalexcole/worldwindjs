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
import Angle from "./Angle";
import ArgumentError from "../error/ArgumentError";
import Location from "./Location";
import Logger from "../util/Logger";
import Vec3 from "./Vec3";
import WWMath from "../util/WWMath";

/**
 * Constructs a Sector from specified minimum and maximum latitudes and longitudes in degrees.
 * @alias Sector
 * @constructor
 * @classdesc Represents a rectangular region in geographic coordinates in degrees.
 * @param {Number} minLatitude The sector's minimum latitude in degrees.
 * @param {Number} maxLatitude The sector's maximum latitude in degrees.
 * @param {Number} minLongitude The sector's minimum longitude in degrees.
 * @param {Number} maxLongitude The sector's maximum longitude in degrees.
 */
class Sector {
  constructor(minLatitude, maxLatitude, minLongitude, maxLongitude) {
    /**
     * This sector's minimum latitude in degrees.
     * @type {Number}
     */
    this.minLatitude = minLatitude;
    /**
     * This sector's maximum latitude in degrees.
     * @type {Number}
     */
    this.maxLatitude = maxLatitude;
    /**
     * This sector's minimum longitude in degrees.
     * @type {Number}
     */
    this.minLongitude = minLongitude;
    /**
     * This sector's maximum longitude in degrees.
     * @type {Number}
     */
    this.maxLongitude = maxLongitude;
  }
  /**
   * Computes bounding sectors from a list of locations that span the dateline.
   * @param {Location[]} locations The locations to bound.
   * @returns {Sector[]} Two sectors, one in the eastern hemisphere and one in the western hemisphere.
   * Returns null if the computed bounding sector has zero width or height.
   * @throws {ArgumentError} If the specified array is null, undefined or empty or the number of locations
   * is less than 2.
   */
  static splitBoundingSectors(locations) {
    if (!locations || locations.length < 2) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "Sector",
          "splitBoundingSectors",
          "missingArray"
        )
      );
    }

    var minLat = 90;
    var minLon = 180;
    var maxLat = -90;
    var maxLon = -180;

    var lastLocation = null;

    for (var idx = 0, len = locations.length; idx < len; idx += 1) {
      var location = locations[idx];

      var lat = location.latitude;
      if (lat < minLat) {
        minLat = lat;
      }
      if (lat > maxLat) {
        maxLat = lat;
      }

      var lon = location.longitude;
      if (lon >= 0 && lon < minLon) {
        minLon = lon;
      }
      if (lon <= 0 && lon > maxLon) {
        maxLon = lon;
      }

      if (lastLocation != null) {
        var lastLon = lastLocation.longitude;
        if (WWMath.signum(lon) != WWMath.signum(lastLon)) {
          if (Math.abs(lon - lastLon) < 180) {
            // Crossing the zero longitude line too
            maxLon = 0;
            minLon = 0;
          }
        }
      }
      lastLocation = location;
    }

    if (minLat === maxLat && minLon === maxLon) {
      return null;
    }

    return [
      new Sector(minLat, maxLat, minLon, 180), // Sector on eastern hemisphere.
      new Sector(minLat, maxLat, -180, maxLon), // Sector on western hemisphere.
    ];
  }
  /**
   * Sets this sector's latitudes and longitudes to those of a specified sector.
   * @param {Sector} sector The sector to copy.
   * @returns {Sector} This sector, set to the values of the specified sector.
   * @throws {ArgumentError} If the specified sector is null or undefined.
   */
  copy(sector) {
    if (!sector) {
      throw new ArgumentError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "Sector", "copy", "missingSector")
      );
    }

    this.minLatitude = sector.minLatitude;
    this.maxLatitude = sector.maxLatitude;
    this.minLongitude = sector.minLongitude;
    this.maxLongitude = sector.maxLongitude;

    return this;
  }
  /**
   * Indicates whether this sector has width or height.
   * @returns {Boolean} true if this sector's minimum and maximum latitudes or minimum and maximum
   * longitudes do not differ, otherwise false.
   */
  isEmpty() {
    return (
      this.minLatitude === this.maxLatitude &&
      this.minLongitude === this.maxLongitude
    );
  }
  /**
   * Returns the angle between this sector's minimum and maximum latitudes, in degrees.
   * @returns {Number} The difference between this sector's minimum and maximum latitudes, in degrees.
   */
  deltaLatitude() {
    return this.maxLatitude - this.minLatitude;
  }
  /**
   * Returns the angle between this sector's minimum and maximum longitudes, in degrees.
   * @returns {Number} The difference between this sector's minimum and maximum longitudes, in degrees.
   */
  deltaLongitude() {
    return this.maxLongitude - this.minLongitude;
  }
  /**
   * Returns the angle midway between this sector's minimum and maximum latitudes.
   * @returns {Number} The mid-angle of this sector's minimum and maximum latitudes, in degrees.
   */
  centroidLatitude() {
    return 0.5 * (this.minLatitude + this.maxLatitude);
  }
  /**
   * Returns the angle midway between this sector's minimum and maximum longitudes.
   * @returns {Number} The mid-angle of this sector's minimum and maximum longitudes, in degrees.
   */
  centroidLongitude() {
    return 0.5 * (this.minLongitude + this.maxLongitude);
  }
  /**
   * Computes the location of the angular center of this sector, which is the mid-angle of each of this sector's
   * latitude and longitude dimensions.
   * @param {Location} result A pre-allocated {@link Location} in which to return the computed centroid.
   * @returns {Location} The specified result argument containing the computed centroid.
   * @throws {ArgumentError} If the result argument is null or undefined.
   */
  centroid(result) {
    if (!result) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "Sector",
          "centroid",
          "missingResult"
        )
      );
    }

    result.latitude = this.centroidLatitude();
    result.longitude = this.centroidLongitude();

    return result;
  }
  /**
   * Returns this sector's minimum latitude in radians.
   * @returns {Number} This sector's minimum latitude in radians.
   */
  minLatitudeRadians() {
    return this.minLatitude * Angle.DEGREES_TO_RADIANS;
  }
  /**
   * Returns this sector's maximum latitude in radians.
   * @returns {Number} This sector's maximum latitude in radians.
   */
  maxLatitudeRadians() {
    return this.maxLatitude * Angle.DEGREES_TO_RADIANS;
  }
  /**
   * Returns this sector's minimum longitude in radians.
   * @returns {Number} This sector's minimum longitude in radians.
   */
  minLongitudeRadians() {
    return this.minLongitude * Angle.DEGREES_TO_RADIANS;
  }
  /**
   * Returns this sector's maximum longitude in radians.
   * @returns {Number} This sector's maximum longitude in radians.
   */
  maxLongitudeRadians() {
    return this.maxLongitude * Angle.DEGREES_TO_RADIANS;
  }
  /**
   * Modifies this sector to encompass an array of specified locations.
   * @param {Location[]} locations An array of locations. The array may be sparse.
   * @returns {Sector} This sector, modified to encompass all locations in the specified array.
   * @throws {ArgumentError} If the specified array is null, undefined or empty or has fewer than two locations.
   */
  setToBoundingSector(locations) {
    if (!locations || locations.length < 2) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "Sector",
          "setToBoundingSector",
          "missingArray"
        )
      );
    }

    var minLatitude = 90, maxLatitude = -90, minLongitude = 180, maxLongitude = -180;

    for (var idx = 0, len = locations.length; idx < len; idx += 1) {
      var location = locations[idx];

      if (!location) {
        continue;
      }

      minLatitude = Math.min(minLatitude, location.latitude);
      maxLatitude = Math.max(maxLatitude, location.latitude);
      minLongitude = Math.min(minLongitude, location.longitude);
      maxLongitude = Math.max(maxLongitude, location.longitude);
    }

    this.minLatitude = minLatitude;
    this.maxLatitude = maxLatitude;
    this.minLongitude = minLongitude;
    this.maxLongitude = maxLongitude;

    return this;
  }
  /**
   * Indicates whether this sector intersects a specified sector.
   * This sector intersects the specified sector when each sector's boundaries either overlap with the specified
   * sector or are adjacent to the specified sector.
   * The sectors are assumed to have normalized angles (angles within the range [-90, 90] latitude and
   * [-180, 180] longitude).
   * @param {Sector} sector The sector to test intersection with. May be null or undefined, in which case this
   * function returns false.
   * @returns {Boolean} true if the specifies sector intersections this sector, otherwise false.
   */
  intersects(sector) {
    // Assumes normalized angles: [-90, 90], [-180, 180].
    return (
      sector &&
      this.minLongitude <= sector.maxLongitude &&
      this.maxLongitude >= sector.minLongitude &&
      this.minLatitude <= sector.maxLatitude &&
      this.maxLatitude >= sector.minLatitude
    );
  }
  /**
   * Indicates whether this sector intersects a specified sector exclusive of the sector boundaries.
   * This sector overlaps the specified sector when the union of the two sectors defines a non-empty sector.
   * The sectors are assumed to have normalized angles (angles within the range [-90, 90] latitude and
   * [-180, 180] longitude).
   * @param {Sector} sector The sector to test overlap with. May be null or undefined, in which case this
   * function returns false.
   * @returns {Boolean} true if the specified sector overlaps this sector, otherwise false.
   */
  overlaps(sector) {
    // Assumes normalized angles: [-90, 90], [-180, 180].
    return (
      sector &&
      this.minLongitude < sector.maxLongitude &&
      this.maxLongitude > sector.minLongitude &&
      this.minLatitude < sector.maxLatitude &&
      this.maxLatitude > sector.minLatitude
    );
  }
  /**
   * Indicates whether this sector fully contains a specified sector.
   * This sector contains the specified sector when the specified sector's boundaries are completely contained
   * within this sector's boundaries, or are equal to this sector's boundaries.
   * The sectors are assumed to have normalized angles (angles within the range [-90, 90] latitude and
   * [-180, 180] longitude).
   * @param {Sector} sector The sector to test containment with. May be null or undefined, in which case this
   * function returns false.
   * @returns {Boolean} true if the specified sector contains this sector, otherwise false.
   */
  contains(sector) {
    // Assumes normalized angles: [-90, 90], [-180, 180].
    return (
      sector &&
      this.minLatitude <= sector.minLatitude &&
      this.maxLatitude >= sector.maxLatitude &&
      this.minLongitude <= sector.minLongitude &&
      this.maxLongitude >= sector.maxLongitude
    );
  }
  /**
   * Indicates whether this sector contains a specified geographic location.
   * @param {Number} latitude The location's latitude in degrees.
   * @param {Number} longitude The location's longitude in degrees.
   * @returns {Boolean} true if this sector contains the location, otherwise false.
   */
  containsLocation(latitude, longitude) {
    // Assumes normalized angles: [-90, 90], [-180, 180].
    return (
      this.minLatitude <= latitude &&
      this.maxLatitude >= latitude &&
      this.minLongitude <= longitude &&
      this.maxLongitude >= longitude
    );
  }
  /**
   * Sets this sector to the intersection of itself and a specified sector.
   * @param {Sector} sector The sector to intersect with this one.
   * @returns {Sector} This sector, set to its intersection with the specified sector.
   * @throws {ArgumentError} If the specified sector is null or undefined.
   */
  intersection(sector) {
    if (!sector instanceof Sector) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "Sector",
          "intersection",
          "missingSector"
        )
      );
    }

    // Assumes normalized angles: [-180, 180], [-90, 90].
    if (this.minLatitude < sector.minLatitude)
      this.minLatitude = sector.minLatitude;
    if (this.maxLatitude > sector.maxLatitude)
      this.maxLatitude = sector.maxLatitude;
    if (this.minLongitude < sector.minLongitude)
      this.minLongitude = sector.minLongitude;
    if (this.maxLongitude > sector.maxLongitude)
      this.maxLongitude = sector.maxLongitude;

    // If the sectors do not overlap in either latitude or longitude, then the result of the above logic results in
    // the max being greater than the min. In this case, set the max to indicate that the sector is empty in
    // that dimension.
    if (this.maxLatitude < this.minLatitude) this.maxLatitude = this.minLatitude;
    if (this.maxLongitude < this.minLongitude)
      this.maxLongitude = this.minLongitude;

    return this;
  }
  /**
   * Returns a list of the Lat/Lon coordinates of a Sector's corners.
   *
   * @returns {Array} an array of the four corner locations, in the order SW, SE, NE, NW
   */
  getCorners() {
    var corners = [];

    corners.push(new Location(this.minLatitude, this.minLongitude));
    corners.push(new Location(this.minLatitude, this.maxLongitude));
    corners.push(new Location(this.maxLatitude, this.maxLongitude));
    corners.push(new Location(this.maxLatitude, this.minLongitude));

    return corners;
  }
  /**
   * Returns an array of {@link Vec3} that bounds the specified sector on the surface of the specified
   * {@link Globe}. The returned points enclose the globe's surface terrain in the sector,
   * according to the specified vertical exaggeration, minimum elevation, and maximum elevation. If the minimum and
   * maximum elevation are equal, this assumes a maximum elevation of 10 + the minimum.
   *
   * @param {Globe} globe the globe the extent relates to.
   * @param {Number} verticalExaggeration the globe's vertical surface exaggeration.
   *
   * @returns {Vec3} a set of points that enclose the globe's surface on the specified sector. Can be turned into a {@link BoundingBox}
   * with the setToVec3Points method.
   *
   * @throws {ArgumentError} if the globe is null.
   */
  computeBoundingPoints(globe,
    verticalExaggeration) {
    // TODO: Refactor this method back to computeBoundingBox.
    // This method was originally computeBoundingBox and returned a BoundingBox. This created a circular dependency between
    // Sector and BoundingBox that the Karma unit test suite doesn't appear to like. If we discover a way to make Karma handle this
    // situation, we should refactor this method.
    if (globe === null) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "Sector",
          "computeBoundingBox",
          "missingGlobe"
        )
      );
    }

    var minAndMaxElevations = globe.minAndMaxElevationsForSector(this);

    // Compute the exaggerated minimum and maximum heights.
    var minHeight = minAndMaxElevations[0] * verticalExaggeration;
    var maxHeight = minAndMaxElevations[1] * verticalExaggeration;

    if (minHeight === maxHeight) maxHeight = minHeight + 10; // Ensure the top and bottom heights are not equal.

    var points = [];
    var corners = this.getCorners();
    for (var i = 0; i < corners.length; i++) {
      points.push(
        globe.computePointFromPosition(
          corners[i].latitude,
          corners[i].longitude,
          minHeight,
          new Vec3(0, 0, 0)
        )
      );
      points.push(
        globe.computePointFromPosition(
          corners[i].latitude,
          corners[i].longitude,
          maxHeight,
          new Vec3(0, 0, 0)
        )
      );
    }

    // A point at the centroid captures the maximum vertical dimension.
    var centroid = this.centroid(new Location(0, 0));
    points.push(
      globe.computePointFromPosition(
        centroid.latitude,
        centroid.longitude,
        maxHeight,
        new Vec3(0, 0, 0)
      )
    );

    // If the sector spans the equator, then the curvature of all four edges need to be taken into account. The
    // extreme points along the top and bottom edges are located at their mid-points, and the extreme points along
    // the left and right edges are on the equator. Add points with the longitude of the sector's centroid but with
    // the sector's min and max latitude, and add points with the sector's min and max longitude but with latitude
    // at the equator. See WWJINT-225.
    if (this.minLatitude < 0 && this.maxLatitude > 0) {
      points.push(
        globe.computePointFromPosition(
          this.minLatitude,
          centroid.longitude,
          maxHeight,
          new Vec3(0, 0, 0)
        )
      );
      points.push(
        globe.computePointFromPosition(
          this.maxLatitude,
          centroid.longitude,
          maxHeight,
          new Vec3(0, 0, 0)
        )
      );
      points.push(
        globe.computePointFromPosition(
          0,
          this.minLongitude,
          maxHeight,
          new Vec3(0, 0, 0)
        )
      );
      points.push(
        globe.computePointFromPosition(
          0,
          this.maxLongitude,
          maxHeight,
          new Vec3(0, 0, 0)
        )
      );
    }



    // If the sector is located entirely in the southern hemisphere, then the curvature of its top edge needs to be
    // taken into account. The extreme point along the top edge is located at its mid-point. Add a point with the
    // longitude of the sector's centroid but with the sector's max latitude. See WWJINT-225.
    else if (this.minLatitude < 0) {
      points.push(
        globe.computePointFromPosition(
          this.maxLatitude,
          centroid.longitude,
          maxHeight,
          new Vec3(0, 0, 0)
        )
      );
    }



    // If the sector is located entirely in the northern hemisphere, then the curvature of its bottom edge needs to
    // be taken into account. The extreme point along the bottom edge is located at its mid-point. Add a point with
    // the longitude of the sector's centroid but with the sector's min latitude. See WWJINT-225.
    else {
      points.push(
        globe.computePointFromPosition(
          this.minLatitude,
          centroid.longitude,
          maxHeight,
          new Vec3(0, 0, 0)
        )
      );
    }

    // If the sector spans 360 degrees of longitude then is a band around the entire globe. (If one edge is a pole
    // then the sector looks like a circle around the pole.) Add points at the min and max latitudes and longitudes
    // 0, 180, 90, and -90 to capture full extent of the band.
    if (this.deltaLongitude() >= 360) {
      var minLat = this.minLatitude;
      points.push(
        globe.computePointFromPosition(minLat, 0, maxHeight, new Vec3(0, 0, 0))
      );
      points.push(
        globe.computePointFromPosition(minLat, 90, maxHeight, new Vec3(0, 0, 0))
      );
      points.push(
        globe.computePointFromPosition(minLat, -90, maxHeight, new Vec3(0, 0, 0))
      );
      points.push(
        globe.computePointFromPosition(minLat, 180, maxHeight, new Vec3(0, 0, 0))
      );

      var maxLat = this.maxLatitude;
      points.push(
        globe.computePointFromPosition(maxLat, 0, maxHeight, new Vec3(0, 0, 0))
      );
      points.push(
        globe.computePointFromPosition(maxLat, 90, maxHeight, new Vec3(0, 0, 0))
      );
      points.push(
        globe.computePointFromPosition(maxLat, -90, maxHeight, new Vec3(0, 0, 0))
      );
      points.push(
        globe.computePointFromPosition(maxLat, 180, maxHeight, new Vec3(0, 0, 0))
      );
    } else if (this.deltaLongitude() > 180) {
      // Need to compute more points to ensure the box encompasses the full sector.
      var cLon = centroid.longitude;
      var cLat = centroid.latitude;

      // centroid latitude, longitude midway between min longitude and centroid longitude
      var lon = (this.minLongitude + cLon) / 2;
      points.push(
        globe.computePointFromPosition(cLat, lon, maxHeight, new Vec3(0, 0, 0))
      );

      // centroid latitude, longitude midway between centroid longitude and max longitude
      lon = (cLon + this.maxLongitude) / 2;
      points.push(
        globe.computePointFromPosition(cLat, lon, maxHeight, new Vec3(0, 0, 0))
      );

      // centroid latitude, longitude at min longitude and max longitude
      points.push(
        globe.computePointFromPosition(
          cLat,
          this.minLongitude,
          maxHeight,
          new Vec3(0, 0, 0)
        )
      );
      points.push(
        globe.computePointFromPosition(
          cLat,
          this.maxLongitude,
          maxHeight,
          new Vec3(0, 0, 0)
        )
      );
    }

    return points;
  }
  /**
   * Sets this sector to the union of itself and a specified sector.
   * @param {Sector} sector The sector to union with this one.
   * @returns {Sector} This sector, set to its union with the specified sector.
   * @throws {ArgumentError} if the specified sector is null or undefined.
   */
  union(sector) {
    if (!sector instanceof Sector) {
      throw new ArgumentError(
        Logger.logMessage(Logger.LEVEL_SEVERE, "Sector", "union", "missingSector")
      );
    }

    // Assumes normalized angles: [-180, 180], [-90, 90].
    if (this.minLatitude > sector.minLatitude)
      this.minLatitude = sector.minLatitude;
    if (this.maxLatitude < sector.maxLatitude)
      this.maxLatitude = sector.maxLatitude;
    if (this.minLongitude > sector.minLongitude)
      this.minLongitude = sector.minLongitude;
    if (this.maxLongitude < sector.maxLongitude)
      this.maxLongitude = sector.maxLongitude;

    return this;
  }
  /**
   * Computes the Cartesian coordinates of a Sector's center.
   *
   * @param globe The globe associated with the sector.
   * @param exaggeration The vertical exaggeration to apply.
   *
   * @return the Cartesian coordinates of the sector's center.
   *
   * @throws IllegalArgumentException if <code>globe</code> is null.
   */
  computeCenterPoint(globe, exaggeration) {
    if (globe == null) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.Level.LEVEL_SEVERE,
          "Sector",
          "computeCornerPoints",
          "missingGlobe"
        )
      );
    }

    var lat = 0.5 * (this.minLatitude + this.maxLatitude);
    var lon = 0.5 * (this.minLongitude + this.maxLongitude);
    return globe.computePointFromPosition(
      lat,
      lon,
      exaggeration * globe.elevationAtLocation(lat, lon),
      Vec3.zero()
    );
  }
  /**
   * Computes the Cartesian coordinates of a Sector's corners.
   *
   * @param globe The globe associated with the sector.
   * @param exaggeration The vertical exaggeration to apply.
   *
   * @return an array of four Cartesian points.
   *
   * @throws IllegalArgumentException if <code>globe</code> is null.
   */
  computeCornerPoints(globe, exaggeration) {
    if (!globe) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.Level.LEVEL_SEVERE,
          "Sector",
          "computeCornerPoints",
          "missingGlobe"
        )
      );
    }
    var corners = new Array(4);

    var minLat = this.minLatitude;
    var maxLat = this.maxLatitude;
    var minLon = this.minLongitude;
    var maxLon = this.maxLongitude;

    corners[0] = globe.computePointFromPosition(
      minLat,
      minLon,
      exaggeration * globe.elevationAtLocation(minLat, minLon),
      Vec3.zero()
    );
    corners[1] = globe.computePointFromPosition(
      minLat,
      maxLon,
      exaggeration * globe.elevationAtLocation(minLat, maxLon),
      Vec3.zero()
    );
    corners[2] = globe.computePointFromPosition(
      maxLat,
      maxLon,
      exaggeration * globe.elevationAtLocation(maxLat, maxLon),
      Vec3.zero()
    );
    corners[3] = globe.computePointFromPosition(
      maxLat,
      minLon,
      exaggeration * globe.elevationAtLocation(maxLat, minLon),
      Vec3.zero()
    );
    this.cornerPoints = new Array(corners.length);
    for (var i = 0, len = corners.length; i < len; i++) {
      this.cornerPoints[i] = Vec3.fromVec3(corners[i]);
    }

    return corners;
  }
  /**
   * Returns an approximation of the distance in model coordinates between the
   * surface geometry defined by this sector and the specified model
   * coordinate point. The returned value represents the shortest distance
   * between the specified point and this sector's corner points or its center
   * point. The draw context defines the globe and the elevations that are
   * used to compute the corner points and the center point.
   *
   * @param dc The draw context defining the surface geometry.
   * @param point The model coordinate point to compute a distance to.
   *
   * @return The distance between this sector's surface geometry and the
   * specified point, in model coordinates.
   *
   * @throws IllegalArgumentException if any argument is null.
   */
  distanceTo(dc, point) {
    if (!dc) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.Level.LEVEL_SEVERE,
          "Sector",
          "distanceTo",
          "missingDc"
        )
      );
    }

    if (!point) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.Level.LEVEL_SEVERE,
          "Sector",
          "distanceTo",
          "missingPoint"
        )
      );
    }

    var corners = this.computeCornerPoints(dc.globe, dc.verticalExaggeration);
    var centerPoint = this.computeCenterPoint(dc.globe, dc.verticalExaggeration);

    // Get the distance for each of the sector's corners and its center.
    var d1 = point.distanceTo(corners[0]);
    var d2 = point.distanceTo(corners[1]);
    var d3 = point.distanceTo(corners[2]);
    var d4 = point.distanceTo(corners[3]);
    var d5 = point.distanceTo(centerPoint);

    // Find the minimum distance.
    var minDistance = d1;
    if (minDistance > d2) {
      minDistance = d2;
    }
    if (minDistance > d3) {
      minDistance = d3;
    }
    if (minDistance > d4) {
      minDistance = d4;
    }
    if (minDistance > d5) {
      minDistance = d5;
    }

    return minDistance;
  }
}

/**
 * A sector with minimum and maximum latitudes and minimum and maximum longitudes all zero.
 * @constant
 * @type {Sector}
 */
Sector.ZERO = new Sector(0, 0, 0, 0);

/**
 * A sector that encompasses the full range of latitude ([-90, 90]) and longitude ([-180, 180]).
 * @constant
 * @type {Sector}
 */
Sector.FULL_SPHERE = new Sector(-90, 90, -180, 180);

























export default Sector;
