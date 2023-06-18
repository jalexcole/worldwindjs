import { TacticalPoint } from "./TacticalPoint";

/**
 * An interface for circular tactical graphics. This interface provides methods 
 * to access the radius of the circle. The radius can also be set using the 
 * SymbologyConstants.DISTANCE modifier.
 *
 */
export interface TacticalCircle extends TacticalPoint{
    /**
     * Indicates the radius of this circle.

     */
    getRadius(): number;
    /**
     * Specifies the radius of this circle.
     *
     * @param radius 
     */
    setRadius(radius: number);
}