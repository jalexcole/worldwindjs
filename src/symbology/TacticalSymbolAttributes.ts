

/**
 * Holds attributes for a TacticalSymbol. Changes made to the attributes are 
 * applied to the symbol when the WorldWindow renders the next frame. 
 * Instances of TacticalSymbolAttributes may be shared by many symbols, 
 * thereby reducing the memory normally required to store attributes for each 
 * symbol.

 */
export interface TacticalSymbolAttributes {
    copy(attributes: TacticalSymbolAttributes);
    getInteriorMaterial();
    getOpacity(): number;
    getScale(): number;
    getTextModifierFont();
    getTextModiferMaterial();
    setInterriorMaterial();
    setOpacity(opacity: number);
    setTextModifierFont(font);
    setTextModifierMaterial(material);
}