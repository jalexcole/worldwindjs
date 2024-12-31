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

export class Angle {
  /**
   * Conversion factor for degrees to radians.
   * @constant
   */
  static DEGREES_TO_RADIANS = Math.PI / 180.0;
  /**
   * Conversion factor for radians to degrees.
   * @constant
   */
  static RADIANS_TO_DEGREES = 180.0 / Math.PI;
  /**
   * 2 pi.
   * @constant
   */
  static TWO_PI = 2 * Math.PI;
  /**
   * pi / 2
   * @constant
   */
  static HALF_PI = Math.PI / 2;

  /**
   * Normalizes a specified value to be within the range of [-180, 180] degrees.
   * @param {Number} degrees The value to normalize, in degrees.
   * @returns {Number} The specified value normalized to [-180, 180] degrees.
   */
  static normalizedDegrees(degrees) {
    let angle = degrees % 360;

    return angle > 180 ? angle - 360 : angle < -180 ? 360 + angle : angle;
  }

  /**
   * Normalizes a specified value to be within the range of [-90, 90] degrees.
   * @param {Number} degrees The value to normalize, in degrees.
   * @returns {Number} The specified value normalized to the normal range of latitude.
   */
  static normalizedDegreesLatitude(degrees) {
    var lat = degrees % 180;

    return lat > 90 ? 180 - lat : lat < -90 ? -180 - lat : lat;
  };

  /**
   * Normalizes a specified value to be within the range of [-180, 180] degrees.
   * @param {Number} degrees The value to normalize, in degrees.
   * @returns {Number} The specified value normalized to the normal range of longitude.
   */
  static normalizedDegreesLongitude(degrees) {
    var lon = degrees % 360;

    return lon > 180 ? lon - 360 : lon < -180 ? 360 + lon : lon;
  }

  /**
   * Normalizes a specified value to be within the range of [-Pi, Pi] radians.
   * @param {Number} radians The value to normalize, in radians.
   * @returns {Number} The specified value normalized to [-Pi, Pi] radians.
   */
  static normalizedRadians(radians) {
    var angle = radians % this.TWO_PI;

    return angle > Math.PI
      ? angle - this.TWO_PI
      : angle < -Math.PI
        ? this.TWO_PI + angle
        : angle;
  }

  /**
   * Normalizes a specified value to be within the range of [-Pi/2, Pi/2] radians.
   * @param {Number} radians The value to normalize, in radians.
   * @returns {Number} The specified value normalized to the normal range of latitude.
   */
  static normalizedRadiansLatitude(radians) {
    var lat = radians % Math.PI;

    return lat > this.HALF_PI
      ? Math.PI - lat
      : lat < -this.HALF_PI
        ? -Math.PI - lat
        : lat;
  }

  /**
   * Normalizes a specified value to be within the range of [-Pi, Pi] radians.
   * @param {Number} radians The value to normalize, in radians.
   * @returns {Number} The specified value normalized to the normal range of longitude.
   */
  static normalizedRadiansLongitude(radians) {
    var lon = radians % this.TWO_PI;

    return lon > Math.PI
      ? lon - this.TWO_PI
      : lon < -Math.PI
        ? this.TWO_PI + lon
        : lon;
  }

  /**
   * Indicates whether a specified value is within the normal range of latitude, [-90, 90].
   * @param {Number} degrees The value to test, in degrees.
   * @returns {Boolean} true if the value is within the normal range of latitude, otherwise false.
   */
  static isValidLatitude(degrees) {
    return degrees >= -90 && degrees <= 90;
  }

  /**
   * Indicates whether a specified value is within the normal range of longitude, [-180, 180].
   * @param {Number} degrees The value to test, in degrees.
   * @returns {boolean} true if the value is within the normal range of longitude, otherwise false.
   */
  static isValidLongitude(degrees) {
    return degrees >= -180 && degrees <= 180;
  }

  /**
   * Returns a string representation of a specified value in degrees.
   * @param {Number} degrees The value for which to compute the string.
   * @returns {String} The computed string, which is a decimal degrees value followed by the degree symbol.
   */
  static toString(degrees) {
    return degrees.toString() + "\u00B0";
  }

  /**
   * Returns a decimal degrees string representation of a specified value in degrees.
   * @param {Number} degrees The value for which to compute the string.
   * @returns {String} The computed string, which is a decimal degrees value followed by the degree symbol.
   */
  static toDecimalDegreesString(degrees) {
    return degrees.toString() + "\u00B0";
  }

  /**
   * Returns a degrees-minutes-seconds string representation of a specified value in degrees.
   * @param {Number} degrees The value for which to compute the string.
   * @returns {String} The computed string in degrees, minutes and decimal seconds.
   */
  static toDMSString(degrees) {
    var sign, temp, d, m, s;

    sign = degrees < 0 ? -1 : 1;
    temp = sign * degrees;
    d = Math.floor(temp);
    temp = (temp - d) * 60;
    m = Math.floor(temp);
    temp = (temp - m) * 60;
    s = Math.round(temp);

    if (s == 60) {
      m++;
      s = 0;
    }
    if (m == 60) {
      d++;
      m = 0;
    }

    return (
      (sign == -1 ? "-" : "") +
      d +
      "\u00B0" +
      " " +
      m +
      "\u2019" +
      " " +
      s +
      "\u201D"
    );
  }

  /**
   * Returns a degrees-minutes string representation of a specified value in degrees.
   * @param {Number} degrees The value for which to compute the string.
   * @returns {String} The computed string in degrees and decimal minutes.
   */
  static toDMString(degrees) {
    var sign, temp, d, m, s, mf;

    sign = degrees < 0 ? -1 : 1;
    temp = sign * degrees;
    d = Math.floor(temp);
    temp = (temp - d) * 60;
    m = Math.floor(temp);
    temp = (temp - m) * 60;
    s = Math.round(temp);

    if (s == 60) {
      m++;
      s = 0;
    }
    if (m == 60) {
      d++;
      m = 0;
    }

    mf = s == 0 ? m : m + s / 60;

    return (sign == -1 ? "-" : "") + d + "\u00B0" + " " + mf + "\u2019";
  }
};

export default Angle;
