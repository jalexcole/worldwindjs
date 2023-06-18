import { TacticalCircle } from "./TacticalCircle";
import { TacticalGraphic } from "./TacticalGraphic";
import { TacticalPoint } from "./TacticalPoint";
import { TacticalQuad } from "./TacticalQuad";
import { TacticalRoute } from "./TacticalRoute";

/**
 * A factory to create TacticalGraphics. Each implementation of this interface handles the graphics for a specific symbol set. Each graphic within that set is identified by a string identifier.
The factory exposes creation several methods:

createGraphic - Creates a graphic from a list of positions and modifiers. This method is the most general, and can create any type of graphic. The other creation methods are provided for convenience.
createPoint - Create a graphic positioned by a single control point.
createCircle - Create a graphic positioned by a center point and a radius.
createQuad - Create a graphic that has length and width properties.
createRoute - Create a graphic composed of point graphics connected by lines.
 */
export interface TacticalGraphicFactory {
    createCircle(symboldIdentifier, center, radius, modifiers): TacticalCircle;
    createGraphic(symbolIdentifier: string, positions, modifiers): TacticalGraphic;
    createPoint(symbolIdentifier, position, modifiers): TacticalPoint;
    createQuad(symbolIdentifier, positions, modifiers): TacticalQuad;
    createRoute(symbolIdentifier, controlPoints, modifiers): TacticalRoute;
    isSupported(symbolIdentifier): boolean;
}