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


export * as BasicWorldWindController from "./BasicWorldWindowController.js";
export * as AbstractError from "./error/AbstractError.js";
export * as AAIGridConstants from "./formats/aaigrid/AAIGridConstants.js";
export * as AAIGridReader from "./formats/aaigrid/AAIGridReader.js";
export * as Angle from "./geom/Angle.js";
export * as BoundingBox from "./geom/BoundingBox.js";
export * as Camera from "./geom/Camera.js";
export * as AsterV2ElevationCoverage from "./globe/AsterV2ElevationCoverage.js";
export * as AtmosphereLayer from "./layer/AtmosphereLayer.js";
export * as AtmosphereProgram from "./shaders/AtmosphereProgram.js";
export * as AbstractMesh from "./shapes/AbstractMesh.js";
export * as AbstractShape from "./shapes/AbstractShape.js";
export * as Annotation from "./shapes/Annotation.js";
export * as AnnotationAttributes from "./shapes/AnnotationAttributes.js";
export * as AbsentResourceList from "./util/AbsentResourceList.js";
export * as ByteBuffer from "./util/ByteBuffer.js";

export * as ColladaScene from "./formats/collada/ColladaScene.js";
export * as CompassLayer from "./layer/CompassLayer.js";
export * as DrawContext from "./render/DrawContext.js";
export * as Compass from "./shapes/Compass.js";
export * as Color from "./util/Color.js";
export * as Date from "./util/Date.js";
export * as Font from "./util/Font.js";

export * as GeoTiffReader from "./formats/geotiff/GeoTiffReader.js";
export * as Frustum from "./geom/Frustum.js";
export * as ElevationModel from "./globe/ElevationModel.js";
export * as Globe from "./globe/Globe.js";
// import Globe2D from "./globe/Globe2D";
export * as KmlAbstractView from "./formats/kml/KmlAbstractView.js";
export * as KmlCamera from "./formats/kml/KmlCamera.js";
export * as KmlFile from "./formats/kml/KmlFile.js";
export * as KmlIcon from "./formats/kml/KmlIcon.js";
export * as KmlLatLonAltBox from "./formats/kml/KmlLatLonAltBox.js";
export * as KmlLatLonBox from "./formats/kml/KmlLatLonBox.js";
export * as KmlLatLonQuad from "./formats/kml/KmlLatLonQuad.js";
export * as KmlLink from "./formats/kml/KmlLink.js";
export * as KmlLocation from "./formats/kml/KmlLocation.js";
export * as KmlLod from "./formats/kml/KmlLod.js";
export * as KmlLookAt from "./formats/kml/KmlLookAt.js";
export * as KmlObject from "./formats/kml/KmlObject.js";
export * as KmlOrientation from "./formats/kml/KmlOrientation.js";
export * as KmlControls from "./formats/kml/controls/KmlControls.js";
export * as KmlContainer from "./formats/kml/features/KmlContainer.js";
export * as KmlDocument from "./formats/kml/features/KmlDocument.js";
export * as KmlFeature from "./formats/kml/features/KmlFeature.js";
export * as KmlFolder from "./formats/kml/features/KmlFolder.js";
export * as KmlGroundOverlay from "./formats/kml/features/KmlGroundOverlay.js";
export * as KmlNetworkLink from "./formats/kml/features/KmlNetworkLink.js";
export * as KmlOverlay from "./formats/kml/features/KmlOverlay.js";
export * as KmlPhotoOverlay from "./formats/kml/features/KmlPhotoOverlay.js";
export * as KmlPlacemark from "./formats/kml/features/KmlPlacemark.js";
export * as KmlGeometry from "./formats/kml/geom/KmlGeometry.js";
export * as KmlLineString from "./formats/kml/geom/KmlLineString.js";
export * as KmlLinearRing from "./formats/kml/geom/KmlLinearRing.js";
export * as KmlMultiGeometry from "./formats/kml/geom/KmlMultiGeometry.js";
export * as KmlMultiTrack from "./formats/kml/geom/KmlMultiTrack.js";
export * as KmlBalloonStyle from "./formats/kml/styles/KmlBalloonStyle.js";
export * as KmlColorStyle from "./formats/kml/styles/KmlColorStyle.js";
export * as KmlIconStyle from "./formats/kml/styles/KmlLabelStyle.js";
export * as KmlLineStyle from "./formats/kml/styles/KmlLineStyle.js";
export * as KmlListStyle from "./formats/kml/styles/KmlListStyle.js";
export * as KmlAttribute from "./formats/kml/util/KmlAttribute.js";
export * as KmlChange from "./formats/kml/util/KmlChange.js";
export * as KmlCreate from "./formats/kml/util/KmlCreate.js";
export * as KmlDelete from "./formats/kml/util/KmlDelete.js";
export * as KmlElementsFactory from "./formats/kml/util/KmlElementsFactory.js";
export * as KmlElementsFactoryCached from "./formats/kml/util/KmlElementsFactoryCached.js";
export * as KmlHrefResolver from "./formats/kml/util/KmlHrefResolver.js";
export * as KmlImagePyramid from "./formats/kml/util/KmlImagePyramid.js";
export * as KmlItemIcon from "./formats/kml/util/KmlItemIcon.js";
export * as KmlNetworkLinkControl from "./formats/kml/util/KmlNetworkLinkControl.js";
export * as KmlPair from "./formats/kml/util/KmlPair.js";
export * as KmlTreeKeyValueCache from "./formats/kml/util/KmlTreeKeyValueCache.js";
export * as KmlViewVolume from "./formats/kml/util/KmlViewVolume.js";
export * as Globe2D from "./globe/Globe2D.js";
export * as HashMap from "./util/HashMap.js";
export * as Level from "./util/Level.js";

export * as KmlPoint from "./formats/kml/geom/KmlPoint.js";
export * as KmlPolygon from "./formats/kml/geom/KmlPolygon.js";
export * as KmlPolyStyle from "./formats/kml/styles/KmlPolyStyle.js";
export * as KmlRefreshListener from "./formats/kml/util/KmlRefreshListener.js";

export * as KmlRegion from "./formats/kml/KmlRegion.js";
export * as KmlTimePrimitive from "./formats/kml/KmlTimePrimitive.js";
export * as KmlTimeSpan from "./formats/kml/KmlTimeSpan.js";
export * as KmlTimeStamp from "./formats/kml/KmlTimeStamp.js";
export * as KmlTreeVisibility from "./formats/kml/controls/KmlTreeVisibility.js";
export * as KmlScreenOverlay from "./formats/kml/features/KmlScreenOverlay.js";
export * as KmlTour from "./formats/kml/features/KmlTour.js";
export * as KmlTrack from "./formats/kml/geom/KmlTrack.js";
export * as KmlStyle from "./formats/kml/styles/KmlStyle.js";
export * as KmlStyleMap from "./formats/kml/styles/KmlStyleMap.js";
export * as KmlStyleSelector from "./formats/kml/styles/KmlStyleSelector.js";
export * as KmlSubStyle from "./formats/kml/styles/KmlSubStyle.js";
export * as KmlRemoteFile from "./formats/kml/util/KmlRemoteFile.js";
export * as KmlScale from "./formats/kml/util/KmlScale.js";
export * as KmlSchema from "./formats/kml/util/KmlSchema.js";


export * as KmzFile from "./formats/kml/KmzFile.js";

export * as Line from "./geom/Line.js";
export * as Location from "./geom/Location.js";
export * as LevelSet from "./util/LevelSet.js";
export * as Logger from "./util/Logger.js";

export * as LookAt from "./geom/LookAt.js";

export * as WorldWindow from "./WorldWindow.js";
export * as WorldWindowController from "./WorldWindowController.js";
export * as Matrix from "./geom/Matrix.js";
export * as Matrix3 from "./geom/Matrix3.js";
export * as MeasuredLocation from "./geom/MeasuredLocation.js";
export * as Plane from "./geom/Plane.js";
export * as Position from "./geom/Position.js";
export * as Rectangle from "./geom/Rectangle.js";
export * as Sector from "./geom/Sector.js";
export * as TileMatrix from "./geom/TileMatrix.js";
export * as TileMatixSet from "./geom/TileMatrixSet.js";
export * as Vec2 from "./geom/Vec2.js";
export { default as Vec3 } from "./geom/Vec3.js";
export * as WcsCapabilities from "./ogc/wcs/WcsCapabilities.js";
export * as WcsCoverageDescriptions from "./ogc/wcs/WcsCoverageDescriptions.js";
export * from "./projections/ProjectionWgs84.js";
export * as PolygonSplitter from "./util/PolygonSplitter.js";
export * as SunPosition from "./util/SunPosition.js";
export * as Tile from "./util/Tile.js";
export * as TileFactory from "./util/TileFactory.js";

export * as WWMath from "./util/WWMath.js";

export * as WWMessage from "./util/WWMessage.js";
export * as XMLDocument from "./util/XmlDocument.js";
import WWUtil from "./util/WWUtil.js";

export { WWUtil } from "./util/WWUtil.js";
/**
 * This is the top-level WorldWind module. It is global.
 * @exports WorldWind
 * @global
 */
var WorldWind = {
  /**
   * The WorldWind version number.
   * @default "0.9.0"
   * @constant
   */
  VERSION: "1.6.90",

  // PLEASE KEEP THE ENTRIES BELOW IN ALPHABETICAL ORDER
  /**
   * Indicates an altitude mode relative to the globe's ellipsoid.
   * @constant
   */
  ABSOLUTE: "absolute",

  /**
   * Indicates that a redraw callback has been called immediately after a redraw.
   * @constant
   */
  AFTER_REDRAW: "afterRedraw",

  /**
   * Indicates that a redraw callback has been called immediately before a redraw.
   * @constant
   */
  BEFORE_REDRAW: "beforeRedraw",

  /**
   * The BEGAN gesture recognizer state. Continuous gesture recognizers transition to this state from the
   * POSSIBLE state when the gesture is first recognized.
   * @constant
   */
  BEGAN: "began",

  /**
   * The CANCELLED gesture recognizer state. Continuous gesture recognizers may transition to this state from
   * the BEGAN state or the CHANGED state when the touch events are cancelled.
   * @constant
   */
  CANCELLED: "cancelled",

  /**
   * The CHANGED gesture recognizer state. Continuous gesture recognizers transition to this state from the
   * BEGAN state or the CHANGED state, whenever an input event indicates a change in the gesture.
   * @constant
   */
  CHANGED: "changed",

  /**
   * Indicates an altitude mode always on the terrain.
   * @constant
   */
  CLAMP_TO_GROUND: "clampToGround",

  /**
   * The radius of Earth.
   * @constant
   * @deprecated Use WGS84_SEMI_MAJOR_AXIS instead.
   */
  EARTH_RADIUS: 6371e3,

  /**
   * Indicates the cardinal direction east.
   * @constant
   */
  EAST: "east",

  /**
   * The ENDED gesture recognizer state. Continuous gesture recognizers transition to this state from either
   * the BEGAN state or the CHANGED state when the current input no longer represents the gesture.
   * @constant
   */
  ENDED: "ended",

  /**
   * The FAILED gesture recognizer state. Gesture recognizers transition to this state from the POSSIBLE state
   * when the gesture cannot be recognized given the current input.
   * @constant
   */
  FAILED: "failed",

  /**
   * Indicates a linear filter.
   * @constant
   */
  FILTER_LINEAR: "filter_linear",

  /**
   * Indicates a nearest neighbor filter.
   * @constant
   */
  FILTER_NEAREST: "filter_nearest",

  /**
   * Indicates a great circle path.
   * @constant
   */
  GREAT_CIRCLE: "greatCircle",

  /**
   * Indicates a linear, straight line path.
   * @constant
   */
  LINEAR: "linear",

  /**
   * Indicates a multi-point shape, typically within a shapefile.
   */
  MULTI_POINT: "multiPoint",

  /**
   * Indicates the cardinal direction north.
   * @constant
   */
  NORTH: "north",

  /**
   * Indicates a null shape, typically within a shapefile.
   * @constant
   */
  NULL: "null",

  /**
   * Indicates that the associated parameters are fractional values of the virtual rectangle's width or
   * height in the range [0, 1], where 0 indicates the rectangle's origin and 1 indicates the corner
   * opposite its origin.
   * @constant
   */
  OFFSET_FRACTION: "fraction",

  /**
   * Indicates that the associated parameters are in units of pixels relative to the virtual rectangle's
   * corner opposite its origin corner.
   * @constant
   */
  OFFSET_INSET_PIXELS: "insetPixels",

  /**
   * Indicates that the associated parameters are in units of pixels relative to the virtual rectangle's
   * origin.
   * @constant
   */
  OFFSET_PIXELS: "pixels",

  /**
   * Indicates a point shape, typically within a shapefile.
   */
  POINT: "point",

  /**
   * Indicates a polyline shape, typically within a shapefile.
   */
  POLYLINE: "polyline",

  /**
   * Indicates a polygon shape, typically within a shapefile.
   */
  POLYGON: "polygon",

  /**
   * The POSSIBLE gesture recognizer state. Gesture recognizers in this state are idle when there is no input
   * event to evaluate, or are evaluating input events to determine whether or not to transition into another
   * state.
   * @constant
   */
  POSSIBLE: "possible",

  /**
   * The RECOGNIZED gesture recognizer state. Discrete gesture recognizers transition to this state from the
   * POSSIBLE state when the gesture is recognized.
   * @constant
   */
  RECOGNIZED: "recognized",

  /**
   * The event name of WorldWind redraw events.
   */
  REDRAW_EVENT_TYPE: "WorldWindRedraw",

  /**
   * Indicates that the related value is specified relative to the globe.
   * @constant
   */
  RELATIVE_TO_GLOBE: "relativeToGlobe",

  /**
   * Indicates an altitude mode relative to the terrain.
   * @constant
   */
  RELATIVE_TO_GROUND: "relativeToGround",

  /**
   * Indicates that the related value is specified relative to the plane of the screen.
   * @constant
   */
  RELATIVE_TO_SCREEN: "relativeToScreen",

  /**
   * Indicates a rhumb path -- a path of constant bearing.
   * @constant
   */
  RHUMB_LINE: "rhumbLine",

  /**
   * Indicates the cardinal direction south.
   * @constant
   */
  SOUTH: "south",

  /**
   * Indicates the cardinal direction west.
   * @constant
   */
  WEST: "west",

  /**
   * WGS 84 reference value for Earth's semi-major axis: 6378137.0. Taken from NGA.STND.0036_1.0.0_WGS84,
   * section 3.4.1.
   * @constant
   */
  WGS84_SEMI_MAJOR_AXIS: 6378137.0,

  /**
   * WGS 84 reference value for Earth's inverse flattening: 298.257223563. Taken from
   * NGA.STND.0036_1.0.0_WGS84, section 3.4.2.
   * @constant
   */
  WGS84_INVERSE_FLATTENING: 298.257223563,
};

/**
 * Holds configuration parameters for WorldWind. Applications may modify these parameters prior to creating
 * their first WorldWind objects. Configuration properties are:
 * <ul>
 *     <li><code>gpuCacheSize</code>: A Number indicating the size in bytes to allocate from GPU memory for
 *     resources such as textures, GLSL programs and buffer objects. Default is 250e6 (250 MB).</li>
 *     <li><code>baseUrl</code>: The URL of the directory containing the WorldWind Library and its resources.</li>
 *     <li><code>layerRetrievalQueueSize</code>: The number of concurrent tile requests allowed per layer. The default is 16.</li>
 *     <li><code>coverageRetrievalQueueSize</code>: The number of concurrent tile requests allowed per elevation coverage. The default is 16.</li>
 *     <li><code>bingLogoPlacement</code>: An {@link Offset} to place a Bing logo attribution. The default is a 7px margin inset from the lower right corner of the screen.</li>
 *     <li><code>bingLogoAlignment</code>: An {@link Offset} to align the Bing logo relative to its placement position. The default is the lower right corner of the logo.</li>
 * </ul>
 * @type {{gpuCacheSize: number}}
 */
WorldWind.configuration = {
  gpuCacheSize: 250e6,
  baseUrl:
    WWUtil.worldwindlibLocation() || WWUtil.currentUrlSansFilePart() + "/../",
  layerRetrievalQueueSize: 16,
  coverageRetrievalQueueSize: 16,
  // bingLogoPlacement: new Offset(
  //   WorldWind.OFFSET_INSET_PIXELS,
  //   7,
  //   WorldWind.OFFSET_PIXELS,
  //   7
  // ),
  // bingLogoAlignment: new Offset(
  //   WorldWind.OFFSET_FRACTION,
  //   1,
  //   WorldWind.OFFSET_FRACTION,
  //   0
  // ),
};

// /**
//  * Indicates the Bing Maps key to use when requesting Bing Maps resources.
//  * @type {String}
//  * @default null
//  */
// WorldWind.BingMapsKey = null;

window.WorldWind = WorldWind;

export default WorldWind;
