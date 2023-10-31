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
export { default as AbstractError } from "./error/AbstractError.js";

export * as AAIGridConstants from "./formats/aaigrid/AAIGridConstants.js";
export { default as AAIGridReader } from "./formats/aaigrid/AAIGridReader.js";
export { default as Angle } from "./geom/Angle.js";
export {default as ArgumentError} from "./error/ArgumentError.js";
export { default as BoundingBox } from "./geom/BoundingBox.js";
export { default as Camera } from "./geom/Camera.js";
export * as AsterV2ElevationCoverage from "./globe/AsterV2ElevationCoverage.js";
export * as AtmosphereLayer from "./layer/AtmosphereLayer.js";
export * as AtmosphereProgram from "./shaders/AtmosphereProgram.js";
export * as AbstractMesh from "./shapes/AbstractMesh.js";
export * as AbstractShape from "./shapes/AbstractShape.js";
export * as Annotation from "./shapes/Annotation.js";
export * as AnnotationAttributes from "./shapes/AnnotationAttributes.js";
export * as AbsentResourceList from "./util/AbsentResourceList.js";
export * as ByteBuffer from "./util/ByteBuffer.js";
export { default as BasicProgram } from "./shaders/BasicProgram.js";
export { default as BasicTextureProgram } from "./shaders/BasicTextureProgram.js";
export { default as BasicTimeSequence } from "./util/BasicTimeSequence.js";
export { default as BasicWorldWindowController } from "./BasicWorldWindowController.js"
export { default as BingAerialLayer } from "./layer/BingAerialLayer.js";
export { default as BingAerialWithLabelsLayer } from "./layer/BingAerialWithLabelsLayer.js";
export { default as BingImageryUrlBuilder } from "./util/BingImageryUrlBuilder.js";
export { default as BingRoadsLayer } from "./layer/BingRoadsLayer.js";
export { default as BingTiledImageLayer } from "./layer/BingTiledImageLayer.js";
export { default as BMNGLandsatLayer } from "./layer/BMNGLandsatLayer.js";
export { default as BMNGLayer } from "./layer/BMNGLayer.js";
export { default as BMNGOneImageLayer } from "./layer/BMNGOneImageLayer.js";
export { default as BMNGRestLayer } from "./layer/BMNGRestLayer.js";
export { default as ColladaScene } from "./formats/collada/ColladaScene.js";
export * as CompassLayer from "./layer/CompassLayer.js";
export { default as DrawContext } from "./render/DrawContext.js";
export * as Compass from "./shapes/Compass.js";
export { default as Color } from "./util/Color.js";
export * as Date from "./util/Date.js";
export { default as EarthElevationModel } from "./globe/EarthElevationModel.js";
export { default as EarthModel } from "./globe/ElevationModel.js";
export { default as Font } from "./util/Font.js";
export { default as FramebufferTexture } from "./render/FramebufferTexture.js";
export { default as FramebufferTile } from "./render/FramebufferTile.js";
export { default as FramebufferTileController } from "./render/FramebufferTileController.js";
export { default as FrameStatistics } from "./util/FrameStatistics.js";
export { default as FrameStatisticsLayer } from "./layer/FrameStatisticsLayer.js";

export { default as Frustum } from "./geom/Frustum.js";
export { default as ElevationModel } from "./globe/ElevationModel.js";
export { default as GeoTiffReader } from "./formats/geotiff/GeoTiffReader.js";
export { default as Globe } from "./globe/Globe.js";


export { default as KmlAbstractView } from "./formats/kml/KmlAbstractView.js";
export { default as KmlCamera } from "./formats/kml/KmlCamera.js";
export { default as KmlFile } from "./formats/kml/KmlFile.js";
export { default as KmlIcon } from "./formats/kml/KmlIcon.js";
export { default as KmlLatLonAltBox } from "./formats/kml/KmlLatLonAltBox.js";
export { default as KmlLatLonBox } from "./formats/kml/KmlLatLonBox.js";
export { default as KmlLatLonQuad } from "./formats/kml/KmlLatLonQuad.js";
export { default as KmlLink } from "./formats/kml/KmlLink.js";
export { default as KmlLocation } from "./formats/kml/KmlLocation.js";
export { default as KmlLod } from "./formats/kml/KmlLod.js";
export { default as KmlLookAt } from "./formats/kml/KmlLookAt.js";
export { default as KmlObject } from "./formats/kml/KmlObject.js";
export { default as KmlOrientation } from "./formats/kml/KmlOrientation.js";
export { default as KmlControls } from "./formats/kml/controls/KmlControls.js";
export { default as KmlContainer } from "./formats/kml/features/KmlContainer.js";
export { default as KmlDocument } from "./formats/kml/features/KmlDocument.js";
export { default as KmlFeature } from "./formats/kml/features/KmlFeature.js";
export { default as KmlFolder } from "./formats/kml/features/KmlFolder.js";
export { default as KmlGroundOverlay } from "./formats/kml/features/KmlGroundOverlay.js";
export { default as KmlNetworkLink } from "./formats/kml/features/KmlNetworkLink.js";
export { default as KmlOverlay } from "./formats/kml/features/KmlOverlay.js";
export { default as KmlPhotoOverlay } from "./formats/kml/features/KmlPhotoOverlay.js";
export { default as KmlPlacemark } from "./formats/kml/features/KmlPlacemark.js";
export { default as KmlGeometry } from "./formats/kml/geom/KmlGeometry.js";
export { default as KmlLineString } from "./formats/kml/geom/KmlLineString.js";
export { default as KmlLinearRing } from "./formats/kml/geom/KmlLinearRing.js";
export { default as KmlMultiGeometry } from "./formats/kml/geom/KmlMultiGeometry.js";
export { default as KmlMultiTrack } from "./formats/kml/geom/KmlMultiTrack.js";
export { default as KmlBalloonStyle } from "./formats/kml/styles/KmlBalloonStyle.js";
export { default as KmlColorStyle } from "./formats/kml/styles/KmlColorStyle.js";
export { default as KmlIconStyle } from "./formats/kml/styles/KmlLabelStyle.js";
export { default as KmlLineStyle } from "./formats/kml/styles/KmlLineStyle.js";
export { default as KmlListStyle } from "./formats/kml/styles/KmlListStyle.js";
export { default as KmlAttribute } from "./formats/kml/util/KmlAttribute.js";
export { default as KmlChange } from "./formats/kml/util/KmlChange.js";
export { default as KmlCreate } from "./formats/kml/util/KmlCreate.js";
export { default as KmlDelete } from "./formats/kml/util/KmlDelete.js";
export { default as KmlElementsFactory } from "./formats/kml/util/KmlElementsFactory.js";
export { default as KmlElementsFactoryCached } from "./formats/kml/util/KmlElementsFactoryCached.js";
export { default as KmlHrefResolver } from "./formats/kml/util/KmlHrefResolver.js";
export { default as KmlImagePyramid } from "./formats/kml/util/KmlImagePyramid.js";
export { default as KmlItemIcon } from "./formats/kml/util/KmlItemIcon.js";
export { default as KmlNetworkLinkControl } from "./formats/kml/util/KmlNetworkLinkControl.js";
export { default as KmlPair } from "./formats/kml/util/KmlPair.js";
export { default as KmlTreeKeyValueCache } from "./formats/kml/util/KmlTreeKeyValueCache.js";
export { default as KmlViewVolume } from "./formats/kml/util/KmlViewVolume.js";
export { default as Globe2D } from "./globe/Globe2D.js";
export { default as HashMap } from "./util/HashMap.js";
export { default as Level } from "./util/Level.js";

export { default as KmlPoint } from "./formats/kml/geom/KmlPoint.js";
export { default as KmlPolygon } from "./formats/kml/geom/KmlPolygon.js";
export { default as KmlPolyStyle } from "./formats/kml/styles/KmlPolyStyle.js";
export { default as KmlRefreshListener } from "./formats/kml/util/KmlRefreshListener.js";

export { default as KmlRegion } from "./formats/kml/KmlRegion.js";
export { default as KmlTimePrimitive } from "./formats/kml/KmlTimePrimitive.js";
export { default as KmlTimeSpan } from "./formats/kml/KmlTimeSpan.js";
export { default as KmlTimeStamp } from "./formats/kml/KmlTimeStamp.js";
export { default as KmlTreeVisibility } from "./formats/kml/controls/KmlTreeVisibility.js";
export { default as KmlScreenOverlay } from "./formats/kml/features/KmlScreenOverlay.js";
export { default as KmlTour } from "./formats/kml/features/KmlTour.js";
export { default as KmlTrack } from "./formats/kml/geom/KmlTrack.js";
export { default as KmlStyle } from "./formats/kml/styles/KmlStyle.js";
export { default as KmlStyleMap } from "./formats/kml/styles/KmlStyleMap.js";
export { default as KmlStyleSelector } from "./formats/kml/styles/KmlStyleSelector.js";
export { default as KmlSubStyle } from "./formats/kml/styles/KmlSubStyle.js";
export { default as KmlRemoteFile } from "./formats/kml/util/KmlRemoteFile.js";
export { default as KmlScale } from "./formats/kml/util/KmlScale.js";
export { default as KmlSchema } from "./formats/kml/util/KmlSchema.js";

export { default as KmzFile } from "./formats/kml/KmzFile.js";

export { default as Line } from "./geom/Line.js";
export { default as Location } from "./geom/Location.js";
export * as LevelSet from "./util/LevelSet.js";
export { default as Logger } from "./util/Logger.js";

export * as LookAt from "./geom/LookAt.js";

export * as WorldWindow from "./WorldWindow.js";
export * as WorldWindowController from "./WorldWindowController.js";
export { default as Matrix } from "./geom/Matrix.js";
export { default as Matrix3 } from "./geom/Matrix3.js";
export { default as MeasuredLocation } from "./geom/MeasuredLocation.js";
export {default as MemoryCache} from "./cache/MemoryCache.js";
export {default as MemoryCacheListener} from "./cache/MemoryCacheListener.js";
export {default as MercatorTiledImageLayer} from "./layer/MercatorTiledImageLayer.js";
export {default as NotYetImplementedError} from "./error/NotYetImplementedError.js";
export { default as Plane } from "./geom/Plane.js";
export { default as Position } from "./geom/Position.js";
export { default as Rectangle } from "./geom/Rectangle.js";
export {default as Renderable } from "./render/Renderable.js";
export {default as RenderableLayer } from "./layer/RenderableLayer.js";
export {default as RestTiledImageLayer } from "./layer/RestTiledImageLayer.js";
export { default as Sector } from "./geom/Sector.js";
export * as TileMatrix from "./geom/TileMatrix.js";
export * as TileMatixSet from "./geom/TileMatrixSet.js";
export {default as TriangleMesh} from "./shapes/TriangleMesh.js";
export { default as Vec2 } from "./geom/Vec2.js";
export { default as Vec3 } from "./geom/Vec3.js";
export { default as WcsCapabilities } from "./ogc/wcs/WcsCapabilities.js";
export { default as WcsCoverageDescriptions } from "./ogc/wcs/WcsCoverageDescriptions.js";
export * as PanRecognizer from "./gesture/PanRecognizer.js";
export * as Path from "./shapes/Path.js";
export * as PeriodicTimeSequence from "./util/PeriodicTimeSequence.js";
export * as PickedObject from "./pick/PickedObject.js";
export * as PickedObjectList from "./pick/PickedObjectList.js";
export * as PinchRecognizer from "./gesture/PinchRecognizer.js";
export { default as Placemark } from "./shapes/Placemark.js";
export * as PlacemarkAttributes from "./shapes/PlacemarkAttributes.js";
export { default as Polygon } from "./shapes/Polygon.js";

export * as PrjFile from "./formats/shapefile/PrjFile.js";
export * as ProjectionEquirectangular from "./projections/ProjectionEquirectangular.js";
export * as ProjectionGnomonic from "./projections/ProjectionGnomonic.js";
export * as ProjectionMercator from "./projections/ProjectionMercator.js";
export * as ProjectionPolarEquidistant from "./projections/ProjectionPolarEquidistant.js";
export * as ProjectionUPS from "./projections/ProjectionUPS.js";
export { default as ProjectionWgs84 } from "./projections/ProjectionWgs84.js";
export { default as PolygonSplitter } from "./util/PolygonSplitter.js";
export * as SunPosition from "./util/SunPosition.js";
export { default as SurfacePolyline } from "./shapes/SurfacePolyline.js";
export { default as Tile } from "./util/Tile.js";
export * as TileFactory from "./util/TileFactory.js";
export { default as WktGeometryCollection } from "./formats/wkt/geom/WktGeometryCollection.js";
export { default as WktLineString } from "./formats/wkt/geom/WktLineString.js";
export { default as WktMultiLineString } from "./formats/wkt/geom/WktMultiLineString.js";
export { default as WktMultiPoint } from "./formats/wkt/geom/WktMultiPoint.js";
export { default as WktObject } from "./formats/wkt/geom/WktObject.js";
export { default as WktPoint } from "./formats/wkt/geom/WktPoint.js";
export { default as WktTriangle } from "./formats/wkt/geom/WktTriangle.js";
export { default as WWMath} from "./util/WWMath.js";

export * as WWMessage from "./util/WWMessage.js";
export { default as XmlDocument } from "./util/XmlDocument.js";
import MemoryCache from "./cache/MemoryCache.js";
import Offset from "./util/Offset.js";
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
  bingLogoPlacement: new Offset(
    WorldWind.OFFSET_INSET_PIXELS,
    7,
    WorldWind.OFFSET_PIXELS,
    7
  ),
  bingLogoAlignment: new Offset(
    WorldWind.OFFSET_FRACTION,
    1,
    WorldWind.OFFSET_FRACTION,
    0
  ),
};

// /**
//  * Indicates the Bing Maps key to use when requesting Bing Maps resources.
//  * @type {String}
//  * @default null
//  */
// WorldWind.BingMapsKey = null;

window.WorldWind = WorldWind;

export default WorldWind;
