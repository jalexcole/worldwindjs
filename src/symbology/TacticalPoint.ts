import { TacticalGraphic } from "./TacticalGraphic";

/**
 * An interface for tactical graphics that are positioned by a single point.

 */
export interface TacticalPoint extends TacticalGraphic{
    getPosition(): any;
    setPosition(position: any);
}