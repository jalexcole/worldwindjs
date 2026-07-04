/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
import ArgumentError from "../error/ArgumentError";
import Logger from "../util/Logger";
import WWMath from "../util/WWMath";

/**
 * Constructs a WebGPU texture for a specified image.
 * @alias WebGpuTexture
 * @constructor
 * @classdesc Represents a WebGPU texture. Applications typically do not interact with this class.
 * @param {GPUDevice} device The current WebGPU device.
 * @param {Image} image The texture's image.
 * @param {Object} options Optional configuration for the texture.
 * @param {String} options.wrapMode Specifies the wrap mode of the texture. Defaults to "clamp-to-edge".
 * @throws {ArgumentError} If the specified WebGPU device or image is null or undefined.
 */
class WebGpuTexture {
  constructor(device, image, options = {}) {
    if (!device) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuTexture",
          "constructor",
          "missingDevice"
        )
      );
    }

    if (!image) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuTexture",
          "constructor",
          "missingImage"
        )
      );
    }

    this.device = device;
    this.originalImageWidth = image.width;
    this.originalImageHeight = image.height;

    // Check if image needs to be power of two for mipmapping
    let isPowerOfTwo = 
      WWMath.isPowerOfTwo(image.width) && WWMath.isPowerOfTwo(image.height);

    const wrapMode = options.wrapMode || "clamp-to-edge";

    // If wrap mode is repeat and image is not power of two, resize it
    if (wrapMode === "repeat" && !isPowerOfTwo) {
      image = this.resizeImage(image);
      isPowerOfTwo = true;
    }

    this.imageWidth = image.width;
    this.imageHeight = image.height;
    this.size = image.width * image.height * 4;

    // Determine texture format and usage
    const format = this.getTextureFormat();
    const usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;

    // Create the texture
    this.texture = device.createTexture({
      size: { width: image.width, height: image.height, depthOrArrayLayers: 1 },
      format: format,
      usage: usage,
      mipLevelCount: isPowerOfTwo ? this.calculateMipLevelCount(image.width, image.height) : 1
    });

    // Upload image data to texture
    this.uploadImageData(image);

    // Generate mipmaps if image is power of two
    if (isPowerOfTwo) {
      this.generateMipmaps();
    }

    // Create texture view
    this.textureView = this.texture.createView();

    // Set up sampler
    this.sampler = this.createSampler(wrapMode);

    Logger.log(
      Logger.LEVEL_INFO,
      "WebGpuTexture",
      "constructor",
      `WebGPU texture created (${image.width}x${image.height})`
    );
  }

  /**
   * Gets the appropriate texture format for the image.
   * @returns {String} The texture format.
   */
  getTextureFormat() {
    return "rgba8unorm";
  }

  /**
   * Calculates the number of mip levels needed for a texture.
   * @param {number} width Texture width.
   * @param {number} height Texture height.
   * @returns {number} Number of mip levels.
   */
  calculateMipLevelCount(width, height) {
    const maxDimension = Math.max(width, height);
    return Math.floor(Math.log2(maxDimension)) + 1;
  }

  /**
   * Uploads image data to the texture.
   * @param {Image} image The image to upload.
   */
  uploadImageData(image) {
    const device = this.device;
    const texture = this.texture;

    // Create a temporary buffer for the image data
    const imageBuffer = device.createBuffer({
      size: image.width * image.height * 4,
      usage: GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true
    });

    // Create a view of the image data
    const imageData = this.getImageData(image);
    
    // Copy image data to the buffer
    new Uint8Array(imageBuffer.getMappedRange()).set(imageData);
    imageBuffer.unmap();

    // Copy buffer data to texture
    const commandEncoder = device.createCommandEncoder();
    commandEncoder.copyBufferToTexture(
      { buffer: imageBuffer, bytesPerRow: image.width * 4 },
      { texture: texture, mipLevel: 0 },
      { width: image.width, height: image.height, depthOrArrayLayers: 1 }
    );

    // Submit the command
    device.queue.submit([commandEncoder.finish()]);

    // Buffer will be automatically cleaned up
  }

  /**
   * Extracts RGBA data from an image.
   * @param {Image} image The image to extract data from.
   * @returns {Uint8Array} The RGBA pixel data.
   */
  getImageData(image) {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);
    
    return new Uint8Array(ctx.getImageData(0, 0, image.width, image.height).data);
  }

  /**
   * Generates mipmaps for the texture.
   */
  generateMipmaps() {
    // In WebGPU, we need to manually generate mipmaps using compute shaders
    // For now, we'll use a simple approach with command encoder
    
    // This is a placeholder - full mipmap generation would require a compute shader
    Logger.log(
      Logger.LEVEL_WARNING,
      "WebGpuTexture",
      "generateMipmaps",
      "Mipmap generation not yet implemented for WebGPU"
    );
  }

  /**
   * Creates a sampler with the specified wrap mode.
   * @param {String} wrapMode The wrap mode.
   * @returns {GPUSampler} The created sampler.
   */
  createSampler(wrapMode) {
    const addressMode = this.getAddressMode(wrapMode);
    
    return this.device.createSampler({
      addressModeU: addressMode,
      addressModeV: addressMode,
      magFilter: "linear",
      minFilter: "linear",
      mipmapFilter: "linear"
    });
  }

  /**
   * Converts wrap mode string to WebGPU address mode.
   * @param {String} wrapMode The wrap mode.
   * @returns {String} The WebGPU address mode.
   */
  getAddressMode(wrapMode) {
    switch (wrapMode.toLowerCase()) {
      case "repeat":
        return "repeat";
      case "mirrored-repeat":
        return "mirror-repeat";
      case "clamp-to-edge":
      default:
        return "clamp-to-edge";
    }
  }

  /**
   * Resizes an image to be power of two dimensions.
   * @param {Image} image The image to resize.
   * @returns {Image} The resized image.
   */
  resizeImage(image) {
    const canvas = document.createElement("canvas");
    const newWidth = WWMath.nextPowerOfTwo(image.width);
    const newHeight = WWMath.nextPowerOfTwo(image.height);
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
    
    const newImage = new Image();
    newImage.src = canvas.toDataURL();
    newImage.width = newWidth;
    newImage.height = newHeight;
    
    return newImage;
  }

  /**
   * Returns the WebGPU texture.
   * @returns {GPUTexture} The WebGPU texture.
   */
  getTexture() {
    return this.texture;
  }

  /**
   * Returns the WebGPU texture view.
   * @returns {GPUTextureView} The WebGPU texture view.
   */
  getTextureView() {
    return this.textureView;
  }

  /**
   * Returns the WebGPU sampler.
   * @returns {GPUSampler} The WebGPU sampler.
   */
  getSampler() {
    return this.sampler;
  }

  /**
   * Returns the texture ID (for compatibility with WebGL).
   * @returns {Object} Texture object that can be used with bind groups.
   */
  get textureId() {
    return {
      texture: this.texture,
      view: this.textureView,
      sampler: this.sampler
    };
  }

  /**
   * Binds the texture for rendering.
   * @param {GPURenderPassEncoder} renderPassEncoder The render pass encoder.
   * @param {number} group The bind group index.
   * @param {number} binding The binding index within the group.
   */
  bind(renderPassEncoder, group = 1, binding = 1) {
    // This would be handled by the bind group setup
    // For direct binding, we'd need to create a bind group on the fly
    // In practice, this should be handled by the material/rendering code
  }

  /**
   * Releases this texture's WebGPU resources.
   */
  dispose() {
    if (this.texture) {
      this.texture.destroy();
      this.texture = null;
    }
    
    if (this.textureView) {
      this.textureView = null;
    }
    
    if (this.sampler) {
      this.sampler = null; // Samplers don't need explicit cleanup
    }
    
    this.device = null;
  }

  /**
   * Creates a new WebGpuTexture from a canvas element.
   * @param {GPUDevice} device The WebGPU device.
   * @param {HTMLCanvasElement} canvas The canvas element.
   * @param {Object} options Optional configuration.
   * @returns {WebGpuTexture} The created texture.
   */
  static fromCanvas(device, canvas, options = {}) {
    const image = new Image();
    image.width = canvas.width;
    image.height = canvas.height;
    image.src = canvas.toDataURL();
    
    return new WebGpuTexture(device, image, options);
  }

  /**
   * Creates a new WebGpuTexture from a video element.
   * @param {GPUDevice} device The WebGPU device.
   * @param {HTMLVideoElement} video The video element.
   * @param {Object} options Optional configuration.
   * @returns {WebGpuTexture} The created texture.
   */
  static fromVideo(device, video, options = {}) {
    const image = new Image();
    image.width = video.videoWidth;
    image.height = video.videoHeight;
    image.src = video.poster || '';
    
    // Note: For video textures, we'd need to handle frame updates
    // This is a simplified implementation
    return new WebGpuTexture(device, image, options);
  }

  /**
   * Creates an empty texture with specified dimensions.
   * @param {GPUDevice} device The WebGPU device.
   * @param {number} width Texture width.
   * @param {number} height Texture height.
   * @param {Object} options Optional configuration.
   * @returns {WebGpuTexture} The created texture.
   */
  static empty(device, width, height, options = {}) {
    const format = options.format || "rgba8unorm";
    const usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;

    const texture = device.createTexture({
      size: { width, height, depthOrArrayLayers: 1 },
      format: format,
      usage: usage,
      mipLevelCount: 1
    });

    const instance = new WebGpuTexture(device, { width, height });
    instance.texture = texture;
    instance.textureView = texture.createView();
    instance.imageWidth = width;
    instance.imageHeight = height;
    instance.originalImageWidth = width;
    instance.originalImageHeight = height;
    instance.size = width * height * 4;
    instance.sampler = instance.createSampler(options.wrapMode || "clamp-to-edge");

    return instance;
  }
}

export default WebGpuTexture;