

class WorldWindConstants {
  // PLEASE KEEP THE ENTRIES BELOW IN ALPHABETICAL ORDER
  /**
   * Indicates an altitude mode relative to the globe's ellipsoid.
   * @constant
   */
  static ABSOLUTE = "absolute";

  /**
   * Indicates that a redraw callback has been called immediately after a redraw.
   * @constant
   */
  static AFTER_REDRAW = "afterRedraw";

  /**
   * Indicates that a redraw callback has been called immediately before a redraw.
   * @constant
   */
  static BEFORE_REDRAW = "beforeRedraw";

  /**
   * The BEGAN gesture recognizer state. Continuous gesture recognizers transition to this state from the
   * POSSIBLE state when the gesture is first recognized.
   * @constant
   */
  static BEGAN = "began";

  /**
   * The CANCELLED gesture recognizer state. Continuous gesture recognizers may transition to this state from
   * the BEGAN state or the CHANGED state when the touch events are cancelled.
   * @constant
   */
  static CANCELLED = "cancelled";

  /**
   * The CHANGED gesture recognizer state. Continuous gesture recognizers transition to this state from the
   * BEGAN state or the CHANGED state, whenever an input event indicates a change in the gesture.
   * @constant
   */
  static CHANGED = "changed";

  /**
   * Indicates an altitude mode always on the terrain.
   * @constant
   */
  static CLAMP_TO_GROUND = "clampToGround";

  /**
   * The radius of Earth.
   * @constant
   * @deprecated Use WGS84_SEMI_MAJOR_AXIS instead.
   */
  static EARTH_RADIUS = 6371e3;

  /**
   * Indicates the cardinal direction east.
   * @constant
   */
  static EAST = "east";

  /**
   * The ENDED gesture recognizer state. Continuous gesture recognizers transition to this state from either
   * the BEGAN state or the CHANGED state when the current input no longer represents the gesture.
   * @constant
   */
  static ENDED = "ended";

  /**
   * The FAILED gesture recognizer state. Gesture recognizers transition to this state from the POSSIBLE state
   * when the gesture cannot be recognized given the current input.
   * @constant
   */
  static FAILED = "failed";

  /**
   * Indicates a linear filter.
   * @constant
   */
  static FILTER_LINEAR = "filter_linear";

  /**
   * Indicates a nearest neighbor filter.
   * @constant
   */
  static FILTER_NEAREST = "filter_nearest";

  /**
   * Indicates a great circle path.
   * @constant
   */
  static GREAT_CIRCLE = "greatCircle";

  /**
   * Indicates a linear, straight line path.
   * @constant
   */
  static LINEAR = "linear";

  /**
   * Indicates a multi-point shape, typically within a shapefile.
   */
  static MULTI_POINT = "multiPoint";

  /**
   * Indicates the cardinal direction north.
   * @constant
   */
  static NORTH = "north";

  /**
   * Indicates a null shape, typically within a shapefile.
   * @constant
   */
  static NULL = "null";

  /**
   * Indicates that the associated parameters are fractional values of the virtual rectangle's width or
   * height in the range [0, 1], where 0 indicates the rectangle's origin and 1 indicates the corner
   * opposite its origin.
   * @constant
   */
  static OFFSET_FRACTION = "fraction";

  /**
   * Indicates that the associated parameters are in units of pixels relative to the virtual rectangle's
   * corner opposite its origin corner.
   * @constant
   */
  static OFFSET_INSET_PIXELS = "insetPixels";

  /**
   * Indicates that the associated parameters are in units of pixels relative to the virtual rectangle's
   * origin.
   * @constant
   */
  static OFFSET_PIXELS = "pixels";

  /**
   * Indicates a point shape, typically within a shapefile.
   */
  static POINT = "point";

  /**
   * Indicates a polyline shape, typically within a shapefile.
   */
  static POLYLINE = "polyline";

  /**
   * Indicates a polygon shape, typically within a shapefile.
   */
  static POLYGON = "polygon";

  /**
   * The POSSIBLE gesture recognizer state. Gesture recognizers in this state are idle when there is no input
   * event to evaluate, or are evaluating input events to determine whether or not to transition into another
   * state.
   * @constant
   */
  static POSSIBLE = "possible";

  /**
   * The RECOGNIZED gesture recognizer state. Discrete gesture recognizers transition to this state from the
   * POSSIBLE state when the gesture is recognized.
   * @constant
   */
  static RECOGNIZED = "recognized";

  /**
   * The event name of WorldWind redraw events.
   */
  static REDRAW_EVENT_TYPE = "WorldWindRedraw";

  /**
   * Indicates that the related value is specified relative to the globe.
   * @constant
   */
  static RELATIVE_TO_GLOBE = "relativeToGlobe";

  /**
   * Indicates an altitude mode relative to the terrain.
   * @constant
   */
  static RELATIVE_TO_GROUND = "relativeToGround";

  /**
   * Indicates that the related value is specified relative to the plane of the screen.
   * @constant
   */
  static RELATIVE_TO_SCREEN = "relativeToScreen";

  /**
   * Indicates a rhumb path -- a path of constant bearing.
   * @constant
   */
  static RHUMB_LINE = "rhumbLine";

  /**
   * Indicates the cardinal direction south.
   * @constant
   */
  static SOUTH = "south";

  /**
   * Indicates the cardinal direction west.
   * @constant
   */
  static WEST = "west";

  /**
   * WGS 84 reference value for Earth's semi-major axis: 6378137.0. Taken from NGA.STND.0036_1.0.0_WGS84,
   * section 3.4.1.
   * @constant
   */
  static WGS84_SEMI_MAJOR_AXIS = 6378137.0;

  /**
   * WGS 84 reference value for Earth's inverse flattening: 298.257223563. Taken from
   * NGA.STND.0036_1.0.0_WGS84, section 3.4.2.
   * @constant
   */
  static WGS84_INVERSE_FLATTENING = 298.257223563;
}

export default WorldWindConstants;