import { TacticalSymbolAttributes } from "./TacticalSymbolAttributes";
// import { DrawContext, Extent, OrderedRenderable, Position, Vec2 }  // Import Position and Vec2


/// <reference types="worldwindjs" />
/**
 * TacticalSymbol provides a common interface for displaying tactical point 
 * symbols from symbology sets. A tactical symbol displays graphic and 
 * textual information about an object at a single geographic position at a 
 * particular point in time. See the Tutorial for instructions on using 
 * TacticalSymbol in an application.
 */
export interface TacticalSymbol {
    getAltitudeMode();
    getAttributes();
    getDelegateOwner();
    getHighlightAttributes(): TacticalSymbolAttributes;
    getIdentifier(): string;
    getLODSelector();
    getModifier(modifier: string): Object;
    getPosition();
    getUnitsFormat()
    isShowGraphicModifiers(): boolean;
    isShowHostileIndicator(): boolean;
    isShowLocation(): boolean;
    isShowTextModifiers(): boolean;
    isVisible(): boolean;
    setAltitudeMode( altitudeMode: number): void;
    setAttributes( normalAttrs: TacticalSymbolAttributes);
    setDelegateOwner(owner: Object);
    setHighlightAttributes(highlightAttrs: TacticalSymbolAttributes);
    setLODSelector(LODSelector);
    setModifier(modifier: string, value: Object);
    setPosition(position);
    setShowGraphicModifiers(showGraphicModifiers: boolean);
    setShowHostileIndicator(show: boolean);
    setShowLocation(show: boolean);
    setShowTextModifiers(showTextModifiers:boolean);
    setUnitsFormat(unitsFormat);
    setVisible(visible: boolean);

    // Properties
  code: string;
  modifiers?: Map<string, string>;
  attributes?: Map<string, any>;
  type: string;

  // Methods
  render(dc: DrawContext): void;
  getExtent(dc: DrawContext): Extent;
  makeOrderedRenderable(dc: DrawContext): OrderedRenderable;
  pick(dc: DrawContext, pickPoint: Vec2): void;
  setModifier(key: string, value: string): void;
  getModifier(key: string): string;
  setAttribute(key: string, value: any): void;
  getAttribute(key: string): any;
  getReferencePosition(): Position;
  moveTo(newPosition: Position): void;
  isVisible(): boolean;
  setVisible(visible: boolean): void;
  toString(): string;

}