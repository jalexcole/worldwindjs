import { TacticalGraphicAttributes } from "./TacticalGraphicAttributes";
// import { Position } from "../geom/Position"

/**
 * TacticalGraphic provides a common interface for displaying a graphic from a 
 * symbology set. A graphic can be an icon that is drawn a geographic position, 
 * a vector graphic that is positioned using one or more control points, or a 
 * line or polygon that is styled according to the symbol set's specification. 
 * 
 * See the TacticalGraphic Tutorial for instructions on using TacticalGraphic 
 * in an application.
 */
export interface TacticalGraphic {
    /**
     * Indicates this graphic's attributes when it is in the normal (as opposed to highlighted) state.

     */
    getAttributes(): TacticalGraphicAttributes;
    /**
     * Returns the delegate owner of the graphic.

     */
    getDelegateOwner(): Object;
    /**
     * Indicate this graphic's attributes when it is in the highlighted state.

     */
    getHighlightAttributes(): TacticalGraphicAttributes;
    /**
     * Indicates a string identifier for this graphic.

     */
    getIdentifier(): string;
    /**
     * Indicates the current value of a text or graphic modifier.

     * @param modifier 
     */
    getModifier(modifier: string);
    /**
     * Indicates the positions of the control points that place and orient the graphic.

     */
    getPositions(): Iterable<any>;
    /**
     * Convenience method to access the text modifier of the graphic.

     */
    getText(): string;
    getUnitsFormat(): any;
    isShowGraphicModifiers(): boolean;
    isShowHostileIndicator(): boolean;
    isShowLocation(): boolean;
    isShowTextModifiers(): boolean;
    isVisible(): boolean;
    setAttributes(attributes: TacticalGraphicAttributes);
    setDelagateOwner(owner: Object);
    setHighlighAttributes(attributes: TacticalGraphicAttributes);
    setLabelOffset(offset: any);
    setModifier(offset: any);
    setPositions(positions: Iterable<any>);
    setShowHostidelIndicator(show: boolean);
    setShowLocation(show: boolean);
    setShowTextModifiers(showTextModifiers: boolean);
    setText(text: string);
    setUnitsFormat(unitsFormat: any);
    setVisible(visible: boolean);
}