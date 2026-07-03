import WorldWindConstants from "./WorldWindConstants";
import WWUtil from "./util/WWUtil";
import Offset from "./util/Offset";
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
let WorldWindConfiguration = {
    gpuCacheSize: 250e6,
    baseUrl:
      WWUtil.worldwindlibLocation() || WWUtil.currentUrlSansFilePart() + "/../",
    layerRetrievalQueueSize: 16,
    coverageRetrievalQueueSize: 16,
    bingLogoPlacement: new Offset(
      WorldWindConstants.OFFSET_INSET_PIXELS,
      7,
      WorldWindConstants.OFFSET_PIXELS,
      7
    ),
    bingLogoAlignment: new Offset(
      WorldWindConstants.OFFSET_FRACTION,
      1,
      WorldWindConstants.OFFSET_FRACTION,
      0
    ),
  };

  export default WorldWindConfiguration