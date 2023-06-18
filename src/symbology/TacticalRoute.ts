import { TacticalGraphic } from "./TacticalGraphic";
import { TacticalPoint } from "./TacticalPoint";



/**
 * An interface for tactical graphics that depict routes: a series of point 
 * graphics connected by lines. For example, the MIL-STD-2525 symbology set 
 * defines an Air Control Route that is composed of Air Control Points. 
 * The route is composed of many tactical graphics, but it is treated as a 
 * single graphic. If the route is highlighted all of the control points 
 * will also highlight, if the route is set invisible all the control points 
 * will be set invisible, etc.
 */
export interface TacticalRoute extends TacticalGraphic{
    getControlPoints(): Iterable<TacticalPoint>
    setControlPoints(points: Iterable<TacticalPoint>): void;
}