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
 * Abstract base class for rendering contexts.
 * Provides a common interface for both WebGL and WebGPU rendering.
 * @alias RenderingContext
 * @constructor
 * @classdesc Abstract base class for rendering contexts. Subclasses implement
 * the specific API calls for WebGL or WebGPU.
 */
class RenderingContext {
  constructor() {
    if (new.target === RenderingContext) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "RenderingContext",
          "constructor",
          "RenderingContext is an abstract class and cannot be instantiated directly"
        )
      );
    }
  }

  /**
   * Clears the color buffer.
   * @param {number} red Red component (0-1).
   * @param {number} green Green component (0-1).
   * @param {number} blue Blue component (0-1).
   * @param {number} alpha Alpha component (0-1).
   */
  clearColor(red, green, blue, alpha) {
    throw new Error("Method 'clearColor' must be implemented");
  }

  /**
   * Clears the depth buffer.
   * @param {number} depth Depth value to clear to.
   */
  clearDepth(depth = 1.0) {
    throw new Error("Method 'clearDepth' must be implemented");
  }

  /**
   * Clears both color and depth buffers.
   * @param {number} red Red component (0-1).
   * @param {number} green Green component (0-1).
   * @param {number} blue Blue component (0-1).
   * @param {number} alpha Alpha component (0-1).
   * @param {number} depth Depth value to clear to.
   */
  clear(red, green, blue, alpha, depth = 1.0) {
    this.clearColor(red, green, blue, alpha);
    this.clearDepth(depth);
  }

  /**
   * Sets the viewport.
   * @param {number} x X coordinate of the lower left corner.
   * @param {number} y Y coordinate of the lower left corner.
   * @param {number} width Width of the viewport.
   * @param {number} height Height of the viewport.
   */
  setViewport(x, y, width, height) {
    throw new Error("Method 'setViewport' must be implemented");
  }

  /**
   * Enables or disables depth testing.
   * @param {boolean} enable Whether to enable depth testing.
   */
  setDepthTest(enable) {
    throw new Error("Method 'setDepthTest' must be implemented");
  }

  /**
   * Sets the depth function.
   * @param {string} func Depth function ('less', 'lequal', etc.).
   */
  setDepthFunc(func) {
    throw new Error("Method 'setDepthFunc' must be implemented");
  }

  /**
   * Enables or disables blending.
   * @param {boolean} enable Whether to enable blending.
   */
  setBlend(enable) {
    throw new Error("Method 'setBlend' must be implemented");
  }

  /**
   * Sets the blend function.
   * @param {string} srcFactor Source blend factor.
   * @param {string} dstFactor Destination blend factor.
   */
  setBlendFunc(srcFactor, dstFactor) {
    throw new Error("Method 'setBlendFunc' must be implemented");
  }

  /**
   * Sets the cull face mode.
   * @param {string} mode Cull face mode ('back', 'front', 'none').
   */
  setCullFace(mode) {
    throw new Error("Method 'setCullFace' must be implemented");
  }

  /**
   * Sets the front face direction.
   * @param {string} direction Front face direction ('ccw', 'cw').
   */
  setFrontFace(direction) {
    throw new Error("Method 'setFrontFace' must be implemented");
  }

  /**
   * Creates a buffer.
   * @param {number} size Size of the buffer in bytes.
   * @param {string} usage Usage hint ('static-draw', 'dynamic-draw', etc.).
   * @returns {Object} Buffer object.
   */
  createBuffer(size, usage) {
    throw new Error("Method 'createBuffer' must be implemented");
  }

  /**
   * Binds a buffer.
   * @param {string} target Buffer target ('array-buffer', 'element-array-buffer').
   * @param {Object} buffer Buffer object.
   */
  bindBuffer(target, buffer) {
    throw new Error("Method 'bindBuffer' must be implemented");
  }

  /**
   * Uploads data to a buffer.
   * @param {string} target Buffer target.
   * @param {TypedArray} data Data to upload.
   * @param {string} usage Usage hint.
   */
  bufferData(target, data, usage) {
    throw new Error("Method 'bufferData' must be implemented");
  }

  /**
   * Creates a texture.
   * @returns {Object} Texture object.
   */
  createTexture() {
    throw new Error("Method 'createTexture' must be implemented");
  }

  /**
   * Binds a texture.
   * @param {string} target Texture target ('texture-2d').
   * @param {Object} texture Texture object.
   */
  bindTexture(target, texture) {
    throw new Error("Method 'bindTexture' must be implemented");
  }

  /**
   * Uploads texture data.
   * @param {string} target Texture target.
   * @param {number} level Mipmap level.
   * @param {number} internalFormat Internal format.
   * @param {number} width Texture width.
   * @param {number} height Texture height.
   * @param {number} border Border size.
   * @param {number} format Pixel format.
   * @param {number} type Data type.
   * @param {TypedArray} pixels Pixel data.
   */
  texImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
    throw new Error("Method 'texImage2D' must be implemented");
  }

  /**
   * Creates a shader.
   * @param {string} type Shader type ('vertex', 'fragment').
   * @param {string} source Shader source code.
   * @returns {Object} Shader object.
   */
  createShader(type, source) {
    throw new Error("Method 'createShader' must be implemented");
  }

  /**
   * Compiles a shader.
   * @param {Object} shader Shader object.
   */
  compileShader(shader) {
    throw new Error("Method 'compileShader' must be implemented");
  }

  /**
   * Creates a program.
   * @returns {Object} Program object.
   */
  createProgram() {
    throw new Error("Method 'createProgram' must be implemented");
  }

  /**
   * Attaches a shader to a program.
   * @param {Object} program Program object.
   * @param {Object} shader Shader object.
   */
  attachShader(program, shader) {
    throw new Error("Method 'attachShader' must be implemented");
  }

  /**
   * Links a program.
   * @param {Object} program Program object.
   */
  linkProgram(program) {
    throw new Error("Method 'linkProgram' must be implemented");
  }

  /**
   * Uses a program.
   * @param {Object} program Program object.
   */
  useProgram(program) {
    throw new Error("Method 'useProgram' must be implemented");
  }

  /**
   * Gets the location of an attribute.
   * @param {Object} program Program object.
   * @param {string} name Attribute name.
   * @returns {number} Attribute location.
   */
  getAttribLocation(program, name) {
    throw new Error("Method 'getAttribLocation' must be implemented");
  }

  /**
   * Enables a vertex attribute array.
   * @param {number} location Attribute location.
   */
  enableVertexAttribArray(location) {
    throw new Error("Method 'enableVertexAttribArray' must be implemented");
  }

  /**
   * Sets vertex attribute pointer.
   * @param {number} location Attribute location.
   * @param {number} size Number of components.
   * @param {number} type Data type.
   * @param {boolean} normalized Whether to normalize.
   * @param {number} stride Stride in bytes.
   * @param {number} offset Offset in bytes.
   */
  vertexAttribPointer(location, size, type, normalized, stride, offset) {
    throw new Error("Method 'vertexAttribPointer' must be implemented");
  }

  /**
   * Gets uniform location.
   * @param {Object} program Program object.
   * @param {string} name Uniform name.
   * @returns {Object} Uniform location.
   */
  getUniformLocation(program, name) {
    throw new Error("Method 'getUniformLocation' must be implemented");
  }

  /**
   * Sets uniform value.
   * @param {Object} location Uniform location.
   * @param {*} value Value to set.
   */
  uniformValue(location, value) {
    throw new Error("Method 'uniformValue' must be implemented");
  }

  /**
   * Draws arrays.
   * @param {string} mode Drawing mode ('triangles', 'lines', etc.).
   * @param {number} first First vertex.
   * @param {number} count Number of vertices.
   */
  drawArrays(mode, first, count) {
    throw new Error("Method 'drawArrays' must be implemented");
  }

  /**
   * Draws elements.
   * @param {string} mode Drawing mode.
   * @param {number} count Number of elements.
   * @param {number} type Data type.
   * @param {number} offset Offset in bytes.
   */
  drawElements(mode, count, type, offset) {
    throw new Error("Method 'drawElements' must be implemented");
  }

  /**
   * Begins a render pass.
   * @returns {Object} Render pass object.
   */
  beginRenderPass() {
    throw new Error("Method 'beginRenderPass' must be implemented");
  }

  /**
   * Ends a render pass.
   * @param {Object} renderPass Render pass object.
   */
  endRenderPass(renderPass) {
    throw new Error("Method 'endRenderPass' must be implemented");
  }

  /**
   * Gets the canvas width.
   * @returns {number} Canvas width.
   */
  get drawingBufferWidth() {
    throw new Error("Property 'drawingBufferWidth' must be implemented");
  }

  /**
   * Gets the canvas height.
   * @returns {number} Canvas height.
   */
  get drawingBufferHeight() {
    throw new Error("Property 'drawingBufferHeight' must be implemented");
  }

  /**
   * Gets the API type.
   * @returns {string} API type ('webgl' or 'webgpu').
   */
  get apiType() {
    throw new Error("Property 'apiType' must be implemented");
  }

  /**
   * Checks if this context supports WebGPU.
   * @returns {boolean} True if WebGPU is supported.
   */
  get isWebGPU() {
    return this.apiType === 'webgpu';
  }

  /**
   * Gets the raw context for direct API access when needed.
   * @returns {Object} The raw context (WebGLRenderingContext or GPUDevice).
   */
  get rawContext() {
    throw new Error("Property 'rawContext' must be implemented");
  }

  /**
   * Destroys the context and releases resources.
   */
  destroy() {
    // Base implementation does nothing
  }
}

/**
 * WebGL implementation of RenderingContext.
 * @alias WebGLRenderingContext
 * @constructor
 */
class WebGLRenderingContext extends RenderingContext {
  constructor(glContext) {
    super();
    this.gl = glContext;
  }

  clearColor(red, green, blue, alpha) {
    this.gl.clearColor(red, green, blue, alpha);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  clearDepth(depth = 1.0) {
    this.gl.clearDepth(depth);
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
  }

  clear(red, green, blue, alpha, depth = 1.0) {
    this.gl.clearColor(red, green, blue, alpha);
    this.gl.clearDepth(depth);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  setViewport(x, y, width, height) {
    this.gl.viewport(x, y, width, height);
  }

  setDepthTest(enable) {
    if (enable) {
      this.gl.enable(this.gl.DEPTH_TEST);
    } else {
      this.gl.disable(this.gl.DEPTH_TEST);
    }
  }

  setDepthFunc(func) {
    const depthFuncs = {
      'less': this.gl.LESS,
      'lequal': this.gl.LEQUAL,
      'equal': this.gl.EQUAL,
      'gequal': this.gl.GEQUAL,
      'greater': this.gl.GREATER,
      'notequal': this.gl.NOTEQUAL,
      'always': this.gl.ALWAYS,
      'never': this.gl.NEVER
    };
    this.gl.depthFunc(depthFuncs[func] || this.gl.LESS);
  }

  setBlend(enable) {
    if (enable) {
      this.gl.enable(this.gl.BLEND);
    } else {
      this.gl.disable(this.gl.BLEND);
    }
  }

  setBlendFunc(srcFactor, dstFactor) {
    const blendFuncs = {
      'zero': this.gl.ZERO,
      'one': this.gl.ONE,
      'src-color': this.gl.SRC_COLOR,
      'one-minus-src-color': this.gl.ONE_MINUS_SRC_COLOR,
      'dst-color': this.gl.DST_COLOR,
      'one-minus-dst-color': this.gl.ONE_MINUS_DST_COLOR,
      'src-alpha': this.gl.SRC_ALPHA,
      'one-minus-src-alpha': this.gl.ONE_MINUS_SRC_ALPHA,
      'dst-alpha': this.gl.DST_ALPHA,
      'one-minus-dst-alpha': this.gl.ONE_MINUS_DST_ALPHA,
      'constant-color': this.gl.CONSTANT_COLOR,
      'one-minus-constant-color': this.gl.ONE_MINUS_CONSTANT_COLOR,
      'constant-alpha': this.gl.CONSTANT_ALPHA,
      'one-minus-constant-alpha': this.gl.ONE_MINUS_CONSTANT_ALPHA,
      'src-alpha-saturate': this.gl.SRC_ALPHA_SATURATE
    };
    
    const src = blendFuncs[srcFactor] || this.gl.SRC_ALPHA;
    const dst = blendFuncs[dstFactor] || this.gl.ONE_MINUS_SRC_ALPHA;
    
    this.gl.blendFunc(src, dst);
  }

  setCullFace(mode) {
    const cullModes = {
      'back': this.gl.BACK,
      'front': this.gl.FRONT,
      'none': this.gl.FRONT_AND_BACK
    };
    
    if (mode === 'none') {
      this.gl.disable(this.gl.CULL_FACE);
    } else {
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(cullModes[mode] || this.gl.BACK);
    }
  }

  setFrontFace(direction) {
    const frontFaces = {
      'ccw': this.gl.CCW,
      'cw': this.gl.CW
    };
    this.gl.frontFace(frontFaces[direction] || this.gl.CCW);
  }

  createBuffer(size, usage) {
    return this.gl.createBuffer();
  }

  bindBuffer(target, buffer) {
    const targets = {
      'array-buffer': this.gl.ARRAY_BUFFER,
      'element-array-buffer': this.gl.ELEMENT_ARRAY_BUFFER
    };
    this.gl.bindBuffer(targets[target] || this.gl.ARRAY_BUFFER, buffer);
  }

  bufferData(target, data, usage) {
    const targets = {
      'array-buffer': this.gl.ARRAY_BUFFER,
      'element-array-buffer': this.gl.ELEMENT_ARRAY_BUFFER
    };
    const usages = {
      'static-draw': this.gl.STATIC_DRAW,
      'dynamic-draw': this.gl.DYNAMIC_DRAW,
      'stream-draw': this.gl.STREAM_DRAW
    };
    
    const target = targets[target] || this.gl.ARRAY_BUFFER;
    const usageHint = usages[usage] || this.gl.STATIC_DRAW;
    
    this.gl.bufferData(target, data, usageHint);
  }

  createTexture() {
    return this.gl.createTexture();
  }

  bindTexture(target, texture) {
    const targets = {
      'texture-2d': this.gl.TEXTURE_2D
    };
    this.gl.bindTexture(targets[target] || this.gl.TEXTURE_2D, texture);
  }

  texImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
    const targets = {
      'texture-2d': this.gl.TEXTURE_2D
    };
    const formats = {
      'rgba': this.gl.RGBA,
      'rgb': this.gl.RGB
    };
    const types = {
      'unsigned-byte': this.gl.UNSIGNED_BYTE
    };
    
    const target = targets[target] || this.gl.TEXTURE_2D;
    const formatVal = formats[format] || this.gl.RGBA;
    const typeVal = types[type] || this.gl.UNSIGNED_BYTE;
    
    this.gl.texImage2D(target, level, internalFormat, width, height, border || 0, formatVal, typeVal, pixels);
  }

  createShader(type, source) {
    const shaderTypes = {
      'vertex': this.gl.VERTEX_SHADER,
      'fragment': this.gl.FRAGMENT_SHADER
    };
    return this.gl.createShader(shaderTypes[type] || this.gl.VERTEX_SHADER);
  }

  compileShader(shader, source) {
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
  }

  createProgram() {
    return this.gl.createProgram();
  }

  attachShader(program, shader) {
    this.gl.attachShader(program, shader);
  }

  linkProgram(program) {
    this.gl.linkProgram(program);
  }

  useProgram(program) {
    this.gl.useProgram(program);
  }

  getAttribLocation(program, name) {
    return this.gl.getAttribLocation(program, name);
  }

  enableVertexAttribArray(location) {
    this.gl.enableVertexAttribArray(location);
  }

  vertexAttribPointer(location, size, type, normalized, stride, offset) {
    const types = {
      'float': this.gl.FLOAT,
      'byte': this.gl.BYTE,
      'unsigned-byte': this.gl.UNSIGNED_BYTE,
      'short': this.gl.SHORT,
      'unsigned-short': this.gl.UNSIGNED_SHORT
    };
    
    const typeVal = types[type] || this.gl.FLOAT;
    this.gl.vertexAttribPointer(location, size, typeVal, normalized, stride, offset);
  }

  getUniformLocation(program, name) {
    return this.gl.getUniformLocation(program, name);
  }

  uniformValue(location, value) {
    if (Array.isArray(value)) {
      if (value.length === 2) {
        this.gl.uniform2fv(location, value);
      } else if (value.length === 3) {
        this.gl.uniform3fv(location, value);
      } else if (value.length === 4) {
        this.gl.uniform4fv(location, value);
      } else if (value.length === 16) {
        this.gl.uniformMatrix4fv(location, false, value);
      }
    } else if (typeof value === 'number') {
      this.gl.uniform1f(location, value);
    } else if (typeof value === 'boolean') {
      this.gl.uniform1i(location, value ? 1 : 0);
    }
  }

  drawArrays(mode, first, count) {
    const modes = {
      'triangles': this.gl.TRIANGLES,
      'triangle-strip': this.gl.TRIANGLE_STRIP,
      'triangle-fan': this.gl.TRIANGLE_FAN,
      'lines': this.gl.LINES,
      'line-strip': this.gl.LINE_STRIP,
      'line-loop': this.gl.LINE_LOOP,
      'points': this.gl.POINTS
    };
    
    const modeVal = modes[mode] || this.gl.TRIANGLES;
    this.gl.drawArrays(modeVal, first, count);
  }

  drawElements(mode, count, type, offset) {
    const modes = {
      'triangles': this.gl.TRIANGLES,
      'triangle-strip': this.gl.TRIANGLE_STRIP,
      'triangle-fan': this.gl.TRIANGLE_FAN,
      'lines': this.gl.LINES,
      'line-strip': this.gl.LINE_STRIP,
      'line-loop': this.gl.LINE_LOOP,
      'points': this.gl.POINTS
    };
    
    const types = {
      'unsigned-short': this.gl.UNSIGNED_SHORT,
      'unsigned-int': this.gl.UNSIGNED_INT
    };
    
    const modeVal = modes[mode] || this.gl.TRIANGLES;
    const typeVal = types[type] || this.gl.UNSIGNED_SHORT;
    
    this.gl.drawElements(modeVal, count, typeVal, offset);
  }

  beginRenderPass() {
    // In WebGL, rendering is immediate, so we return the context itself
    return this.gl;
  }

  endRenderPass() {
    // In WebGL, no explicit render pass ending is needed
  }

  get drawingBufferWidth() {
    return this.gl.drawingBufferWidth || this.gl.canvas.width;
  }

  get drawingBufferHeight() {
    return this.gl.drawingBufferHeight || this.gl.canvas.height;
  }

  get apiType() {
    return 'webgl';
  }

  get rawContext() {
    return this.gl;
  }

  destroy() {
    // In WebGL, context cleanup is handled by the browser
    this.gl = null;
  }
}

/**
 * WebGPU implementation of RenderingContext.
 * @alias WebGPURenderingContext
 * @constructor
 */
class WebGPURenderingContext extends RenderingContext {
  constructor(webgpuContext) {
    super();
    this.webgpuContext = webgpuContext;
    this.device = webgpuContext.device;
    this.context = webgpuContext.context;
    this.queue = webgpuContext.queue;
    this.currentRenderPass = null;
    this.currentPipeline = null;
    this.currentBindGroups = {};
  }

  clearColor(red, green, blue, alpha) {
    this.webgpuContext.clear({ r: red, g: green, b: blue, a: alpha });
  }

  clearDepth(depth = 1.0) {
    // WebGPU clear is handled through render pass configuration
    // This will be set in the next render pass
    this.depthClearValue = depth;
  }

  clear(red, green, blue, alpha, depth = 1.0) {
    this.clearColor(red, green, blue, alpha);
    this.clearDepth(depth);
  }

  setViewport(x, y, width, height) {
    // In WebGPU, viewport is set on the render pass encoder
    this.viewport = { x, y, width, height };
    if (this.currentRenderPass) {
      this.currentRenderPass.setViewport(x, y, width, height, 0, 1);
    }
  }

  setDepthTest(enable) {
    this.depthTestEnabled = enable;
  }

  setDepthFunc(func) {
    this.depthCompare = func;
  }

  setBlend(enable) {
    this.blendEnabled = enable;
  }

  setBlendFunc(srcFactor, dstFactor) {
    this.blendSrcFactor = srcFactor;
    this.blendDstFactor = dstFactor;
  }

  setCullFace(mode) {
    this.cullMode = mode;
  }

  setFrontFace(direction) {
    this.frontFace = direction;
  }

  createBuffer(size, usage) {
    const usageMap = {
      'static-draw': GPUBufferUsage.VERTEX | GPUBufferUsage.INDEX,
      'dynamic-draw': GPUBufferUsage.VERTEX | GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      'stream-draw': GPUBufferUsage.VERTEX | GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    };
    
    return this.device.createBuffer({
      size: size,
      usage: usageMap[usage] || usageMap['static-draw']
    });
  }

  bindBuffer(target, buffer) {
    this.currentBuffers = this.currentBuffers || {};
    this.currentBuffers[target] = buffer;
  }

  bufferData(target, data, usage) {
    const buffer = this.currentBuffers[target];
    if (!buffer) {
      console.warn('No buffer bound for target:', target);
      return;
    }
    
    // Write data to buffer
    const bufferSize = buffer.size;
    const dataSize = data.byteLength || data.length * (data.BYTES_PER_ELEMENT || 4);
    
    if (dataSize > bufferSize) {
      console.warn('Buffer data exceeds buffer size');
      return;
    }
    
    // Create a temporary staging buffer
    const stagingBuffer = this.device.createBuffer({
      size: dataSize,
      usage: GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true
    });
    
    const stagingBufferData = new Uint8Array(stagingBuffer.getMappedRange());
    if (data instanceof Uint8Array) {
      stagingBufferData.set(data);
    } else {
      stagingBufferData.set(new Uint8Array(data.buffer || data));
    }
    stagingBuffer.unmap();
    
    // Copy from staging to target buffer
    const commandEncoder = this.device.createCommandEncoder();
    commandEncoder.copyBufferToBuffer(stagingBuffer, 0, buffer, 0, dataSize);
    this.queue.submit([commandEncoder.finish()]);
  }

  createTexture() {
    return this.device.createTexture({
      size: { width: 1, height: 1, depthOrArrayLayers: 1 },
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
  }

  bindTexture(target, texture) {
    this.currentTextures = this.currentTextures || {};
    this.currentTextures[target] = texture;
  }

  texImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
    const texture = this.currentTextures[target];
    if (!texture) {
      console.warn('No texture bound for target:', target);
      return;
    }
    
    // For WebGPU, we need to write texture data using a command encoder
    if (pixels) {
      const textureSize = width * height * 4; // RGBA8
      
      // Create a staging buffer
      const stagingBuffer = this.device.createBuffer({
        size: textureSize,
        usage: GPUBufferUsage.COPY_SRC,
        mappedAtCreation: true
      });
      
      // Copy pixel data to staging buffer
      const stagingBufferData = new Uint8Array(stagingBuffer.getMappedRange());
      stagingBufferData.set(new Uint8Array(pixels.buffer || pixels));
      stagingBuffer.unmap();
      
      // Copy from staging buffer to texture
      const commandEncoder = this.device.createCommandEncoder();
      commandEncoder.copyBufferToTexture(
        { buffer: stagingBuffer, bytesPerRow: width * 4 },
        { texture: texture, mipLevel: level || 0 },
        { width: width, height: height, depthOrArrayLayers: 1 }
      );
      
      this.queue.submit([commandEncoder.finish()]);
    }
  }

  createShader(type, source) {
    return {
      type: type,
      source: source
    };
  }

  compileShader(shader) {
    // WebGPU shader compilation happens when creating the shader module
    // This is a no-op in the WebGPU implementation
    return true;
  }

  createProgram() {
    return {
      vertexShader: null,
      fragmentShader: null
    };
  }

  attachShader(program, shader) {
    if (shader.type === 'vertex') {
      program.vertexShader = shader;
    } else if (shader.type === 'fragment') {
      program.fragmentShader = shader;
    }
  }

  linkProgram(program) {
    // In WebGPU, program linking is replaced by pipeline creation
    // We'll store the shaders for later pipeline creation
    program.linked = true;
  }

  useProgram(program) {
    if (!this.currentPipeline || this.currentPipeline.program !== program) {
      // Create pipeline if needed
      if (!program.pipeline) {
        program.pipeline = this.createWebGPUPipeline(program);
      }
      this.currentPipeline = program.pipeline;
    }
  }

  getAttribLocation(program, name) {
    // In WebGPU, attributes are bound by location in the shader
    // This is a simplified approach
    return 0;
  }

  enableVertexAttribArray(location) {
    // In WebGPU, vertex attributes are always enabled when set up in the pipeline
  }

  vertexAttribPointer(location, size, type, normalized, stride, offset) {
    // In WebGPU, vertex layout is defined in the pipeline
    // This information would be used when creating the pipeline
    this.vertexLayout = this.vertexLayout || {};
    this.vertexLayout[location] = { size, type, normalized, stride, offset };
  }

  getUniformLocation(program, name) {
    // In WebGPU, uniforms are accessed via bind groups
    return { group: 0, binding: 0, name: name };
  }

  uniformValue(location, value) {
    // In WebGPU, uniform values are set via uniform buffers
    // This is a simplified approach
    this.uniformValues = this.uniformValues || {};
    this.uniformValues[location.name] = value;
  }

  drawArrays(mode, first, count) {
    if (!this.currentRenderPass || !this.currentPipeline) {
      console.warn('Cannot draw: no render pass or pipeline active');
      return;
    }
    
    this.currentRenderPass.draw(count, 1, first, 0);
  }

  drawElements(mode, count, type, offset) {
    if (!this.currentRenderPass || !this.currentPipeline) {
      console.warn('Cannot draw: no render pass or pipeline active');
      return;
    }
    
    const indexFormat = type === 'unsigned-short' ? 'uint16' : 'uint32';
    this.currentRenderPass.drawIndexed(count, 1, 0, 0, 0);
  }

  beginRenderPass() {
    const renderPassDescriptor = this.webgpuContext.getRenderPassDescriptor({
      clearColor: { r: 0, g: 0, b: 0, a: 1 },
      depthClearValue: this.depthClearValue || 1.0
    });
    
    const commandEncoder = this.device.createCommandEncoder();
    const renderPassEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    
    if (this.viewport) {
      renderPassEncoder.setViewport(
        this.viewport.x, this.viewport.y, this.viewport.width, this.viewport.height, 0, 1
      );
    }
    
    this.currentRenderPass = renderPassEncoder;
    this.currentCommandEncoder = commandEncoder;
    
    return renderPassEncoder;
  }

  endRenderPass() {
    if (this.currentRenderPass) {
      this.currentRenderPass.end();
      const commandBuffer = this.currentCommandEncoder.finish();
      this.queue.submit([commandBuffer]);
      
      this.currentRenderPass = null;
      this.currentCommandEncoder = null;
    }
  }

  createWebGPUPipeline(program) {
    if (!program.vertexShader || !program.fragmentShader) {
      console.warn('Cannot create pipeline: missing vertex or fragment shader');
      return null;
    }
    
    // Create shader modules
    const vertexShaderModule = this.device.createShaderModule({
      code: this.convertGLSLToWGSL(program.vertexShader.source, 'vertex')
    });
    
    const fragmentShaderModule = this.device.createShaderModule({
      code: this.convertGLSLToWGSL(program.fragmentShader.source, 'fragment')
    });
    
    // Create pipeline
    return this.device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: vertexShaderModule,
        entryPoint: 'main'
      },
      fragment: {
        module: fragmentShaderModule,
        entryPoint: 'main',
        targets: [{
          format: navigator.gpu.getPreferredCanvasFormat()
        }]
      },
      primitive: {
        topology: 'triangle-list',
        cullMode: this.cullMode === 'none' ? 'none' : 'back'
      },
      depthStencil: {
        format: 'depth24plus-stencil8',
        depthWriteEnabled: this.depthTestEnabled !== false,
        depthCompare: this.depthCompare || 'less'
      }
    });
  }

  convertGLSLToWGSL(glsl, shaderType) {
    // Basic GLSL to WGSL conversion
    let wgsl = glsl;
    
    // Remove version directive
    wgsl = wgsl.replace(/#version\s+\d+/g, '');
    
    // Remove precision qualifiers
    wgsl = wgsl.replace(/precision\s+\w+\s+\w+;/g, '');
    
    // Add WGSL stage
    wgsl = `@stage(${shaderType === 'vertex' ? 'vertex' : 'fragment'})
${wgsl}`;
    
    return wgsl;
  }

  get drawingBufferWidth() {
    return this.context.canvas.width;
  }

  get drawingBufferHeight() {
    return this.context.canvas.height;
  }

  get apiType() {
    return 'webgpu';
  }

  get rawContext() {
    return this.device;
  }

  destroy() {
    // Clean up WebGPU resources
    if (this.currentPipeline) {
      // WebGPU pipelines are automatically managed
      this.currentPipeline = null;
    }
    this.device = null;
    this.context = null;
    this.queue = null;
    this.webgpuContext = null;
  }
}

/**
 * Factory for creating appropriate rendering contexts.
 * @alias RenderingContextFactory
 */
class RenderingContextFactory {
  /**
   * Creates a rendering context based on the provided context or options.
   * @param {WebGLRenderingContext|WebGpuContext|Object} contextOrOptions WebGL context, WebGPU context, or options.
   * @param {Object} options Configuration options.
   * @param {boolean} options.preferWebGPU Whether to prefer WebGPU over WebGL.
   * @returns {RenderingContext} The appropriate rendering context.
   */
  static create(contextOrOptions, options = {}) {
    let context;
    let preferWebGPU = options.preferWebGPU !== undefined ? options.preferWebGPU : true;
    
    if (contextOrOptions instanceof WebGpuContext) {
      // Already have a WebGPU context
      return new WebGPURenderingContext(contextOrOptions);
    } else if (contextOrOptions && contextOrOptions.getContext) {
      // This is a canvas element
      const canvas = contextOrOptions;
      
      if (preferWebGPU && WebGpuContext.isSupported()) {
        try {
          const webgpuContext = new WebGpuContext(canvas, {
            antialias: false,
            stencil: true,
            depth: true
          });
          // Note: This would need async initialization in a real implementation
          return new WebGPURenderingContext(webgpuContext);
        } catch (error) {
          console.warn('WebGPU initialization failed, falling back to WebGL:', error);
        }
      }
      
      // Fall back to WebGL
      const gl = canvas.getContext('webgl', { antialias: false, stencil: true });
      if (!gl) {
        throw new Error('WebGL not supported');
      }
      return new WebGLRenderingContext(gl);
    } else if (contextOrOptions && typeof contextOrOptions === 'object') {
      // Check if this looks like a WebGL context
      if (contextOrOptions.clearColor && contextOrOptions.clear) {
        return new WebGLRenderingContext(contextOrOptions);
      }
      
      // Check if this looks like a WebGPU context
      if (contextOrOptions.device && contextOrOptions.context) {
        return new WebGPURenderingContext(contextOrOptions);
      }
    }
    
    // If we have a WebGL context
    if (contextOrOptions && (contextOrOptions instanceof WebGLRenderingContext)) {
      return contextOrOptions;
    }
    
    throw new Error('Unable to create rendering context from provided input');
  }

  /**
   * Checks if WebGPU is available.
   * @returns {Promise<boolean>} True if WebGPU is available.
   */
  static async isWebGpuAvailable() {
    return WebGpuContext.isSupported();
  }

  /**
   * Checks if WebGL is available.
   * @returns {boolean} True if WebGL is available.
   */
  static isWebGLAvailable() {
    return !!(window.WebGLRenderingContext);
  }
}

export {
  RenderingContext,
  WebGLRenderingContext,
  WebGPURenderingContext,
  RenderingContextFactory
};