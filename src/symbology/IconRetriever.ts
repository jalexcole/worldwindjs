

/**
 * Retrieves icons for symbols in a symbol set from a local disk or the 
 * network. Typically, an icon retriever will be implemented for a specific 
 * symbol set. For example, the MilStd2525IconRetriever retrieves icons for 
 * symbols in the MIL-STD-2525 symbology set. See the Icon Retriever Usage 
 * Guide for more information.
 */
export interface IconRetriever {
    /**
     * Create an icon to represent a symbol in a symbol set.
     * @param symbolId 
     */
    createIcon(symbolId: string): ImageData;
}