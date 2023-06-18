import { TacticalGraphic } from "./TacticalGraphic";

/**
 * An interface for tactical graphics shaped like a quadrilaterals. This interface provides methods to set the length and width of the quad. The length and width can also be set using the SymbologyConstants.DISTANCE modifier.
 *
 */
export interface TacticalQuad extends TacticalGraphic{
    getLength(): number;
    getWidth(): number;
    setLength(length: number);
    setWidth(width: number);
}