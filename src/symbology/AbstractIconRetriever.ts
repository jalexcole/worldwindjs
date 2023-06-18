import { IconRetriever } from "./IconRetriever";


/**
 * Base class for icon retrievers. This class provides methods for loading and 
 * manipulating icons.
 */
export abstract class AbstractIconRetriever implements IconRetriever {
    /**
     * Path in the file system or network to the symbol repository.
     */
    retriverPath: string;

    constructor(retrieverPath: string) {
        this.retriverPath = retrieverPath;
    }

    protected abstract drawImage(src: ImageData, dest: ImageData): ImageData;
    abstract equals(o: Object): boolean;
    abstract getRetrieverPath(): string;
    createIcon(symbolId: string): ImageData {
        throw new Error("Method not implemented.");
    }

}