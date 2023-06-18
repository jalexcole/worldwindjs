


/**
 * Holds attributes for a TacticalGraphic. Changes made to the attributes are applied to the graphic when the WorldWindow renders the next frame. Instances of TacticalGraphicAttributes may be shared by many graphics, thereby reducing the memory normally required to store attributes for each graphic.
 * TacticalGraphicAttributes is used to override default attributes determined by a graphic's symbol set. Any non-null attributes will override the corresponding default attributes. Here's an example of overriding only the outline material of a graphic without affecting other styling specified by the symbol set:
 *
 * TacticalGraphic graphic = ...
 * TacticalGraphicAttributes attrs = new BasicTacticalGraphicAttributes();
 * 
 * // Set the outline to red. Leave all other fields null to retain the default values.
 * attrs.setOutlineMaterial(Material.RED);
 *
 * // Apply the overrides to the graphic
 * graphic.setAttributes(attrs);
 */
export interface TacticalGraphicAttributes {
    copy(): TacticalGraphicAttributes;
    copy(attributes: TacticalGraphicAttributes);
    getInteriorMaterial();
    getInteriorOpacity();
    getOutlineMaterial();
    getOutlineOpacity();
    getOutlineWidth();
    getScale();
    getTextModifierFont();
    getTextModifierMaterial();
    setInteriorMaterial(material);
    setInteriorOpacity(opacity: number);
    setOutlineMaterial(material);
    setOutlineOpacity(opacity: number);
    setOutlineWidth(width: number);
    setScale(scale: number);
    setTextModifierFont(font);
    setTextModifierMaterial(material);
}