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
import WorldWindConfiguration from "../WorldWindConfiguration";

/**
 * Utility class for rendering API detection and configuration.
 * @alias RenderingUtil
 * @constructor
 */
class RenderingUtil {
  /**
   * Checks if WebGPU is supported in the current browser.
   * @returns {boolean} True if WebGPU is supported.
   */
  static isWebGpuSupported() {
    return !!(navigator.gpu);
  }

  /**
   * Checks if WebGL is supported in the current browser.
   * @returns {boolean} True if WebGL is supported.
   */
  static isWebGLSupported() {
    return !!(window.WebGLRenderingContext);
  }

  /**
   * Checks if WebGPU is available (supported and can create device).
   * @returns {Promise<boolean>} True if WebGPU is available.
   */
  static async isWebGpuAvailable() {
    if (!this.isWebGpuSupported()) {
      return false;
    }
    
    try {
      const adapter = await navigator.gpu.requestAdapter();
      return !!(adapter);
    } catch (error) {
      return false;
    }
  }

  /**
   * Determines which rendering API to use based on configuration and availability.
   * @param {Object} options Optional override options.
   * @param {string} options.forceApi Force a specific API ('webgl' or 'webgpu').
   * @param {string} options.preferredApi Preferred API ('webgl', 'webgpu', or 'auto').
   * @returns {Promise<string>} The API to use ('webgl' or 'webgpu').
   */
  static async determineRenderingApi(options = {}) {
    const config = WorldWindConfiguration.rendering;
    
    // Check for forced API
    const forceApi = options.forceApi || config.forceApi;
    if (forceApi === 'webgl' || forceApi === 'webgpu') {
      if (forceApi === 'webgpu' && !this.isWebGpuSupported()) {
        Logger.log(
          Logger.LEVEL_WARNING,
          "RenderingUtil",
          "determineRenderingApi",
          "WebGPU forced but not supported, falling back to WebGL"
        );
        return 'webgl';
      }
      if (forceApi === 'webgl' && !this.isWebGLSupported()) {
        Logger.log(
          Logger.LEVEL_WARNING,
          "RenderingUtil",
          "determineRenderingApi", 
          "WebGL forced but not supported, falling back to WebGPU"
        );
        return 'webgpu';
      }
      return forceApi;
    }
    
    // Use preferred API
    const preferredApi = options.preferredApi || config.preferredApi;
    
    if (preferredApi === 'webgl') {
      return this.isWebGLSupported() ? 'webgl' : 'webgpu';
    }
    
    if (preferredApi === 'webgpu') {
      return this.isWebGpuSupported() ? 'webgpu' : 'webgl';
    }
    
    // Auto mode - prefer WebGPU if available
    if (this.isWebGpuSupported()) {
      const isAvailable = await this.isWebGpuAvailable();
      if (isAvailable) {
        return 'webgpu';
      }
    }
    
    return this.isWebGLSupported() ? 'webgl' : 'webgpu';
  }

  /**
   * Gets the current rendering API configuration.
   * @returns {Object} The rendering configuration.
   */
  static getRenderingConfig() {
    return WorldWindConfiguration.rendering;
  }

  /**
   * Sets the rendering API configuration.
   * @param {Object} config The rendering configuration to set.
   */
  static setRenderingConfig(config) {
    WorldWindConfiguration.rendering = {
      ...WorldWindConfiguration.rendering,
      ...config
    };
  }

  /**
   * Checks if the current context is a WebGL context.
   * @param {Object} context The context to check.
   * @returns {boolean} True if it's a WebGL context.
   */
  static isWebGLContext(context) {
    return context && (
      context instanceof WebGLRenderingContext ||
      (context.clearColor && context.clear && context.getParameter)
    );
  }

  /**
   * Checks if the current context is a WebGPU context.
   * @param {Object} context The context to check.
   * @returns {boolean} True if it's a WebGPU context.
   */
  static isWebGPUContext(context) {
    return context && (
      context.device && context.queue && context.context
    );
  }

  /**
   * Gets WebGL context attributes from configuration.
   * @returns {Object} WebGL context attributes.
   */
  static getWebGLAttributes() {
    const config = this.getRenderingConfig();
    return {
      antialias: config.webgl.antialias !== undefined ? config.webgl.antialias : false,
      stencil: config.webgl.stencil !== undefined ? config.webgl.stencil : true,
      depth: config.webgl.depth !== undefined ? config.webgl.depth : true
    };
  }

  /**
   * Gets WebGPU context options from configuration.
   * @returns {Object} WebGPU context options.
   */
  static getWebGPUOptions() {
    const config = this.getRenderingConfig();
    return {
      antialias: config.webgpu.antialias !== undefined ? config.webgpu.antialias : false,
      stencil: config.webgpu.stencil !== undefined ? config.webgpu.stencil : true,
      depth: config.webgpu.depth !== undefined ? config.webgpu.depth : true,
      powerPreference: config.webgpu.powerPreference || 'high-performance',
      requiredFeatures: config.webgpu.requiredFeatures || [],
      requiredLimits: config.webgpu.requiredLimits || {}
    };
  }

  /**
   * Logs information about the current rendering configuration.
   */
  static logRenderingInfo() {
    Logger.log(
      Logger.LEVEL_INFO,
      "RenderingUtil",
      "logRenderingInfo",
      `Rendering API: ${this.isWebGpuSupported() ? 'WebGPU supported' : 'WebGPU not supported'}, ` +
      `WebGL: ${this.isWebGLSupported() ? 'supported' : 'not supported'}`
    );
    
    const config = this.getRenderingConfig();
    Logger.log(
      Logger.LEVEL_INFO,
      "RenderingUtil",
      "logRenderingInfo",
      `Configuration - Preferred API: ${config.preferredApi}, Forced API: ${config.forceApi || 'none'}`
    );
  }

  /**
   * Creates a WebGL context from a canvas.
   * @param {HTMLCanvasElement} canvas The canvas element.
   * @returns {WebGLRenderingContext|null} The WebGL context or null if not supported.
   */
  static createWebGLContext(canvas) {
    if (!this.isWebGLSupported()) {
      return null;
    }
    
    const attrs = this.getWebGLAttributes();
    let gl = canvas.getContext('webgl', attrs);
    
    if (!gl) {
      // Try experimental-webgl
      gl = canvas.getContext('experimental-webgl', attrs);
    }
    
    return gl;
  }

  /**
   * Creates a WebGPU context from a canvas.
   * @param {HTMLCanvasElement} canvas The canvas element.
   * @returns {Promise<Object|null>} The WebGPU context or null if not supported.
   */
  static async createWebGPUContext(canvas) {
    if (!this.isWebGpuSupported()) {
      return null;
    }
    
    try {
      // Import WebGpuContext dynamically to avoid circular dependencies
      const { default: WebGpuContext } = await import('./WebGpuContext.js');
      
      const options = this.getWebGPUOptions();
      const context = new WebGpuContext(canvas, options);
      
      // Initialize WebGPU asynchronously
      await context.init();
      
      return context;
    } catch (error) {
      Logger.log(
        Logger.LEVEL_SEVERE,
        "RenderingUtil",
        "createWebGPUContext",
        `Failed to create WebGPU context: ${error.message}`
      );
      return null;
    }
  }

  /**
   * Converts a WebGL constant to a human-readable string.
   * @param {number} constant The WebGL constant.
   * @param {WebGLRenderingContext} gl The WebGL context.
   * @returns {string} The constant name or the numeric value.
   */
  static webglConstantToString(constant, gl) {
    if (!gl) return constant.toString();
    
    for (const [key, value] of Object.entries(gl)) {
      if (value === constant && typeof value === 'number') {
        return key;
      }
    }
    
    return constant.toString();
  }

  /**
   * Converts a WebGL blend factor to a WebGPU blend factor.
   * @param {string|number} factor The WebGL blend factor.
   * @returns {string} The WebGPU blend factor.
   */
  static webglBlendFactorToWebGPU(factor) {
    const mapping = {
      'zero': 'zero',
      'one': 'one',
      'src-color': 'src',
      'one-minus-src-color': 'one-minus-src',
      'dst-color': 'dst',
      'one-minus-dst-color': 'one-minus-dst',
      'src-alpha': 'src-alpha',
      'one-minus-src-alpha': 'one-minus-src-alpha',
      'dst-alpha': 'dst-alpha',
      'one-minus-dst-alpha': 'one-minus-dst-alpha',
      'constant-color': 'constant',
      'one-minus-constant-color': 'one-minus-constant',
      'constant-alpha': 'constant-alpha',
      'one-minus-constant-alpha': 'one-minus-constant-alpha',
      'src-alpha-saturate': 'src-alpha-saturate'
    };
    
    if (typeof factor === 'number') {
      // Convert numeric constants
      if (factor === 0) return 'zero';
      if (factor === 1) return 'one';
      return mapping[factor] || 'one';
    }
    
    return mapping[factor.toLowerCase()] || 'one';
  }

  /**
   * Converts a WebGL depth function to a WebGPU depth function.
   * @param {string|number} func The WebGL depth function.
   * @returns {string} The WebGPU depth function.
   */
  static webglDepthFuncToWebGPU(func) {
    const mapping = {
      'never': 'never',
      'less': 'less',
      'equal': 'equal',
      'lequal': 'less-equal',
      'greater': 'greater',
      'gequal': 'greater-equal',
      'notequal': 'not-equal',
      'always': 'always'
    };
    
    if (typeof func === 'number') {
      // Common numeric constants
      if (func === 512) return 'never';
      if (func === 513) return 'less';
      if (func === 514) return 'equal';
      if (func === 515) return 'less-equal';
      if (func === 516) return 'greater';
      if (func === 517) return 'greater-equal';
      if (func === 518) return 'not-equal';
      if (func === 519) return 'always';
    }
    
    return mapping[func.toLowerCase()] || 'less';
  }
}

export default RenderingUtil;