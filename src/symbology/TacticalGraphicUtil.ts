import { TacticalGraphic } from "./TacticalGraphic";
import { TacticalGraphicLabel } from "./TacticalGraphicLabel";


/**
 * Utility methods for working with tactical graphics.

 */
export class TacticalGraphicUtil {
    // Constants
    static readonly MIL_STD_2525C: string = 'mil-std-2525c';
    static readonly MIL_STD_2525D: string = 'mil-std-2525d';
    static readonly MIL_STD_2525E: string = 'mil-std-2525e';
    static readonly MIL_STD_2525B_CHANGE2: string = 'mil-std-2525b-change2';
    static readonly MIL_STD_2525B_CHANGE2_FRAME_FILL: string = 'mil-std-2525b-change2-frame-fill';
    static readonly MIL_STD_2525C_FRAME_FILL: string = 'mil-std-2525c-frame-fill';
    static readonly MIL_STD_2525D_FRAME_FILL: string = 'mil-std-2525d-frame-fill';
    static readonly MIL_STD_2525E_FRAME_FILL: string = 'mil-std-2525e-frame-fill';


    /**
     * Convert a list of cartesian points to Positions.

     * @param globe 
     * @param points 
     */
    static asPositionList(globe, points): any {

    }
    /**
     * 	
     * Compute a point along a Bezier curve defined by a list of control 
     * points.
     * @param controlPoints 
     * @param t 
     * @param coefficients 
     */
    static besierCurve(controlPoints, t: number, coefficients) {

    }
    /**
     * Compute binomial coefficients for a polynomial of order n.
     * @param n 
     * @param coefficients 
     */
    protected static binomial(n: number, coefficients: number[]) {

    }
    /**
     * Get the altitude range from the graphic's modifiers.
     * @param graphic 
     */
    static getAltitudeRange(graphic: TacticalGraphic): Object[] {

    }
    /**
     * Get the date range from a graphic's modifiers.
     * @param graphic 
     */
    static getDateRange(graphic: TacticalGraphic): Object[] {
        switch (symbology) {
            case TacticalGraphicsUtil.MIL_STD_2525C:
              return [new Date('January 1, 1950'), new Date('December 31, 2018')];
      
            case TacticalGraphicLabel.MIL_STD_2525D:
              return [new Date('January 1, 1987'), new Date('December 31, 2018')];
      
            case TacticalGraphicLabel.MIL_STD_2525E:
              return [new Date('January 1, 1987'), new Date()];
      
            case TacticalGraphicLabel.MIL_STD_2525B_CHANGE2:
            case TacticalGraphicLabel.MIL_STD_2525B_CHANGE2_FRAME_FILL:
            case TacticalGraphicsUtil.MIL_STD_2525C_FRAME_FILL:
            case TacticalGraphicsUtil.MIL_STD_2525D_FRAME_FILL:
            case TacticalGraphicsUtil.MIL_STD_2525E_FRAME_FILL:
              return [new Date('January 1, 2000'), new Date()];
      
            default:
              WorldWind.Logger.warning(
                `Unsupported symbology: ${symbology}. Defaulting to MIL-STD-2525E date range.`
              );
              return [new Date('January 1, 1987'), new Date()];


    }
    /**
     * Position one or two labels some distance along the path.
     * @param dc 
     * @param positions 
     * @param label1 
     * @param label2 
     * @param distance 
     */
    static placeLabelsOnPath(dc, positions, label1: TacticalGraphicLabel, label2: TacticalGraphicLabel, distance: number) {

    }
}