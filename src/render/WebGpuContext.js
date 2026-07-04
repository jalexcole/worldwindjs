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

/**
 * Constructs a WebGPU context.
 * @alias WebGpuContext
 * @constructor
 * @classdesc Provides WebGPU device, queue, and context management. This class abstracts
 * the WebGPU API to provide a similar interface to WebGL for easier migration.
 * @param {HTMLCanvasElement} canvas The canvas element to create the WebGPU context for.
 * @param {Object} options Optional configuration options for the WebGPU context.
 * @throws {ArgumentError} If the specified canvas is null or undefined, or WebGPU is not supported.
 */
class WebGpuContext {
  constructor(canvas, options = {}) {
    if (!canvas) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuContext",
          "constructor",
          "missingCanvas"
        )
      );
    }

    if (!navigator.gpu) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuContext",
          "constructor",
          "WebGPU is not supported in this browser"
        )
      );
    }

    this.canvas = canvas;
    this.options = options;
    this.initialized = false;
    
    // Initialize WebGPU asynchronously
    this.initWebGPU = this.initWebGPU.bind(this);
  }

  /**
   * Asynchronously initializes the WebGPU context.
   * Must be called after construction.
   * @returns {Promise} A promise that resolves when WebGPU is initialized.
   */
  async init() {
    await this.initWebGPU();
    this.initialized = true;
    return this;
  }

  /**
   * Initializes the WebGPU device and context.
   * @private
   */
  async initWebGPU() {
    try {
      // Request WebGPU adapter
      const adapter = await navigator.gpu.requestAdapter({
        powerPreference: this.options.powerPreference || "high-performance"
      });

      if (!adapter) {
        throw new Error("No WebGPU adapter found");
      }

      // Request WebGPU device
      const deviceDescriptor = {
        requiredFeatures: this.options.requiredFeatures || [],
        requiredLimits: this.options.requiredLimits || {}
      };
      
      this.adapter = adapter;
      this.device = await adapter.requestDevice(deviceDescriptor);
      
      // Get the canvas context
      const contextDescriptor = {
        alpha: this.options.alpha !== false,
        antialias: this.options.antialias || false,
        depth: this.options.depth || true,
        stencil: this.options.stencil || true
      };
      
      this.context = this.canvas.getContext("webgpu", contextDescriptor);
      
      // Configure the context
      this.context.configure({
        device: this.device,
        format: this.options.format || navigator.gpu.getPreferredCanvasFormat(),
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
      });

      // Create the command queue
      this.queue = this.device.queue;

      // Set up default render pass descriptor
      this.defaultRenderPassDescriptor = {
        colorAttachments: [{
          view: this.context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }],
        depthStencilAttachment: {
          view: null, // Will be set when depth buffer is created
          depthClearValue: 1.0,
          depthLoadOp: "clear",
          depthStoreOp: "store"
        }
      };

      // Create depth texture for default use
      this.depthTexture = this.createDepthTexture(this.canvas.width, this.canvas.height);
      this.defaultRenderPassDescriptor.depthStencilAttachment.view = this.depthTexture.createView();

      Logger.log(
        Logger.LEVEL_INFO,
        "WebGpuContext",
        "initWebGPU",
        "WebGPU initialized successfully"
      );

    } catch (error) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuContext",
          "initWebGPU",
          "Failed to initialize WebGPU: " + error.message
        )
      );
    }
  }

  /**
   * Creates a depth texture for rendering.
   * @param {number} width The width of the depth texture.
   * @param {number} height The height of the depth texture.
   * @returns {GPUTexture} The created depth texture.
   */
  createDepthTexture(width, height) {
    return this.device.createTexture({
      size: { width, height, depthOrArrayLayers: 1 },
      format: "depth24plus-stencil8",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
    });
  }

  /**
   * Creates a new render pass descriptor for the current frame.
   * @param {Object} options Optional configuration for the render pass.
   * @param {Object} options.clearColor The clear color {r, g, b, a}.
   * @param {number} options.depthClearValue The depth clear value.
   * @returns {Object} The render pass descriptor.
   */
  getRenderPassDescriptor(options = {}) {
    const clearColor = options.clearColor || { r: 0, g: 0, b: 0, a: 1 };
    const depthClearValue = options.depthClearValue !== undefined ? options.depthClearValue : 1.0;

    return {
      colorAttachments: [{
        view: this.context.getCurrentTexture().createView(),
        clearValue: clearColor,
        loadOp: "clear",
        storeOp: "store"
      }],
      depthStencilAttachment: {
        view: this.depthTexture.createView(),
        depthClearValue: depthClearValue,
        depthLoadOp: "clear",
        depthStoreOp: "store"
      }
    };
  }

  /**
   * Begins a render pass.
   * @param {Object} options Optional configuration for the render pass.
   * @returns {GPURenderPassEncoder} The render pass encoder.
   */
  beginRenderPass(options = {}) {
    const renderPassDescriptor = this.getRenderPassDescriptor(options);
    const commandEncoder = this.device.createCommandEncoder();
    return commandEncoder.beginRenderPass(renderPassDescriptor);
  }

  /**
   * Ends the current render pass and submits the commands.
   * @param {GPURenderPassEncoder} renderPassEncoder The render pass encoder to end.
   */
  endRenderPass(renderPassEncoder) {
    renderPassEncoder.end();
    const commandBuffer = renderPassEncoder.commandEncoder.finish();
    this.queue.submit([commandBuffer]);
  }

  /**
   * Clears the screen with the specified color.
   * @param {Object} color The clear color {r, g, b, a}.
   */
  clear(color = { r: 0, g: 0, b: 0, a: 1 }) {
    const renderPassEncoder = this.beginRenderPass({ clearColor: color });
    this.endRenderPass(renderPassEncoder);
  }

  /**
   * Resizes the WebGPU context to match the canvas dimensions.
   * @param {number} width The new width.
   * @param {number} height The new height.
   */
  resize(width, height) {
    if (this.depthTexture) {
      // Recreate depth texture with new dimensions
      this.depthTexture.destroy();
      this.depthTexture = this.createDepthTexture(width, height);
    }

    // Reconfigure the context
    this.context.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
      width: width,
      height: height
    });
  }

  /**
   * Destroys all WebGPU resources.
   */
  destroy() {
    if (this.depthTexture) {
      this.depthTexture.destroy();
      this.depthTexture = null;
    }
    
    // Note: We don't explicitly destroy device/queue/context as they are managed by the browser
    this.device = null;
    this.queue = null;
    this.context = null;
  }

  /**
   * Static method to check if WebGPU is supported.
   * @returns {boolean} True if WebGPU is supported.
   */
  static isSupported() {
    return !!(navigator.gpu);
  }

  /**
   * Static method to check if WebGPU is available (supported and can create device).
   * @returns {Promise<boolean>} True if WebGPU is available.
   */
  static async isAvailable() {
    if (!navigator.gpu) {
      return false;
    }
    
    try {
      const adapter = await navigator.gpu.requestAdapter();
      return !!(adapter);
    } catch (error) {
      return false;
    }
  }
}

export default WebGpuContext;