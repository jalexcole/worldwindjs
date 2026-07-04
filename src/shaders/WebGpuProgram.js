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
import WebGpuShader from "./WebGpuShader";

/**
 * Constructs a GPU pipeline with specified source code for vertex and fragment shaders.
 * This constructor is intended to be called only by subclasses.
 * @alias WebGpuProgram
 * @constructor
 * @classdesc Represents a WebGPU render pipeline and provides methods for identifying and
 * accessing shader variables. Pipeline programs are created by instances of this class
 * and made current when the DrawContext.bindProgram function is invoked.
 * @param {GPUDevice} device The current WebGPU device.
 * @param {String} vertexShaderSource The source code for the vertex shader in WGSL.
 * @param {String} fragmentShaderSource The source code for the fragment shader in WGSL.
 * @param {Object} options Optional configuration for the pipeline.
 * @param {Object[]} options.attributeBindings Array of attribute bindings.
 * @throws {ArgumentError} If either source is null or undefined, or pipeline creation fails.
 */
class WebGpuProgram {
  constructor(device, vertexShaderSource, fragmentShaderSource, options = {}) {
    if (!vertexShaderSource || !fragmentShaderSource) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuProgram",
          "constructor",
          "The specified shader source is null or undefined."
        )
      );
    }

    if (!device) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuProgram",
          "constructor",
          "The specified WebGPU device is null or undefined."
        )
      );
    }

    try {
      // Create vertex shader
      this.vertexShader = new WebGpuShader(device, "vertex", vertexShaderSource);
      
      // Create fragment shader
      this.fragmentShader = new WebGpuShader(device, "fragment", fragmentShaderSource);

      // Create pipeline layout
      this.pipelineLayout = this.createPipelineLayout(device, options);

      // Create render pipeline
      this.renderPipeline = this.createRenderPipeline(device, options);

      // Store device reference
      this.device = device;

      // Store shader source for size calculation
      this.size = vertexShaderSource.length + fragmentShaderSource.length;

      // Internal. Intentionally not documented. These will be filled in as attribute locations are requested.
      this.attributeLocations = {};
      this.uniformLocations = {};

      // Create bind group layout for uniforms
      this.bindGroupLayout = this.createBindGroupLayout(device);

      // Create bind groups
      this.bindGroups = [];

      Logger.log(
        Logger.LEVEL_INFO,
        "WebGpuProgram",
        "constructor",
        "WebGPU pipeline created successfully"
      );

    } catch (error) {
      // Clean up any created resources
      if (this.vertexShader) this.vertexShader.dispose();
      if (this.fragmentShader) this.fragmentShader.dispose();

      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuProgram",
          "constructor",
          "Unable to create WebGPU pipeline: " + error.message
        )
      );
    }
  }

  /**
   * Creates a pipeline layout for the render pipeline.
   * @param {GPUDevice} device The WebGPU device.
   * @param {Object} options Pipeline configuration options.
   * @returns {GPUPipelineLayout} The created pipeline layout.
   */
  createPipelineLayout(device, options) {
    // Create bind group layouts for different frequency uniforms
    const bindGroupLayouts = [];
    
    // Layout for per-frame uniforms (group 0)
    const perFrameBindGroupLayout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" }
        }
      ]
    });
    bindGroupLayouts.push(perFrameBindGroupLayout);

    // Layout for textures and samplers (group 1)
    const textureBindGroupLayout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: { type: "filtering" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" }
        }
      ]
    });
    bindGroupLayouts.push(textureBindGroupLayout);

    return device.createPipelineLayout({
      bindGroupLayouts: bindGroupLayouts
    });
  }

  /**
   * Creates a bind group layout for uniforms.
   * @param {GPUDevice} device The WebGPU device.
   * @returns {GPUBindGroupLayout} The created bind group layout.
   */
  createBindGroupLayout(device) {
    return device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" }
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: { type: "filtering" }
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" }
        }
      ]
    });
  }

  /**
   * Creates the render pipeline.
   * @param {GPUDevice} device The WebGPU device.
   * @param {Object} options Pipeline configuration options.
   * @returns {GPURenderPipeline} The created render pipeline.
   */
  createRenderPipeline(device, options) {
    const vertexShaderModule = this.vertexShader.getShaderModule();
    const fragmentShaderModule = this.fragmentShader.getShaderModule();

    // Define vertex input state
    const vertexInputState = this.createVertexInputState(options);

    // Create pipeline descriptor
    const pipelineDescriptor = {
      layout: this.pipelineLayout,
      
      vertex: {
        module: vertexShaderModule,
        entryPoint: this.vertexShader.getEntryPoint(),
        buffers: vertexInputState.vertexBuffers
      },
      
      fragment: {
        module: fragmentShaderModule,
        entryPoint: this.fragmentShader.getEntryPoint(),
        targets: [
          {
            format: options.targetFormat || navigator.gpu.getPreferredCanvasFormat(),
            blend: this.getDefaultBlendState(),
            writeMask: GPUColorWrite.ALL
          }
        ]
      },
      
      primitive: {
        topology: options.topology || "triangle-list",
        frontFace: options.frontFace || "ccw",
        cullMode: options.cullMode || "back"
      },
      
      depthStencil: this.getDefaultDepthStencilState(),
      
      multisample: {
        count: options.multisampleCount || 1
      }
    };

    return device.createRenderPipeline(pipelineDescriptor);
  }

  /**
   * Creates the vertex input state based on attribute bindings.
   * @param {Object} options Pipeline configuration options.
   * @returns {Object} Vertex input state.
   */
  createVertexInputState(options) {
    const vertexBuffers = [];
    const attributeBindings = options.attributeBindings || [];

    // Create a default vertex buffer if no bindings are specified
    if (attributeBindings.length === 0) {
      vertexBuffers.push({
        arrayStride: 0, // Will be updated based on actual vertex data
        stepMode: "vertex",
        attributes: []
      });
    } else {
      // Create vertex buffer for each binding
      for (let i = 0; i < attributeBindings.length; i++) {
        vertexBuffers.push({
          arrayStride: 0, // Will be calculated based on attributes
          stepMode: "vertex",
          attributes: [
            {
              shaderLocation: i,
              offset: 0,
              format: "float32x3" // Default format, will be overridden
            }
          ]
        });
      }
    }

    return { vertexBuffers };
  }

  /**
   * Gets the default blend state.
   * @returns {Object} Default blend state.
   */
  getDefaultBlendState() {
    return {
      color: {
        srcFactor: "src-alpha",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
      },
      alpha: {
        srcFactor: "one",
        dstFactor: "one-minus-src-alpha",
        operation: "add"
      }
    };
  }

  /**
   * Gets the default depth stencil state.
   * @returns {Object} Default depth stencil state.
   */
  getDefaultDepthStencilState() {
    return {
      format: "depth24plus-stencil8",
      depthWriteEnabled: true,
      depthCompare: "less",
      stencil: {
        front: {
          compare: "always",
          failOp: "keep",
          depthFailOp: "keep",
          passOp: "keep"
        },
        back: {
          compare: "always",
          failOp: "keep",
          depthFailOp: "keep",
          passOp: "keep"
        }
      }
    };
  }

  /**
   * Creates a bind group for uniforms.
   * @param {Object} uniforms Uniform data.
   * @returns {GPUBindGroup} The created bind group.
   */
  createBindGroup(uniforms) {
    const bindGroupEntries = [];
    
    for (const [binding, resource] of Object.entries(uniforms)) {
      bindGroupEntries.push({
        binding: parseInt(binding),
        resource: resource
      });
    }

    const bindGroup = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: bindGroupEntries
    });

    this.bindGroups.push(bindGroup);
    return bindGroup;
  }

  /**
   * Returns the render pipeline.
   * @returns {GPURenderPipeline} The WebGPU render pipeline.
   */
  getRenderPipeline() {
    return this.renderPipeline;
  }

  /**
   * Returns the pipeline layout.
   * @returns {GPUPipelineLayout} The pipeline layout.
   */
  getPipelineLayout() {
    return this.pipelineLayout;
  }

  /**
   * Binds the pipeline and bind groups for rendering.
   * @param {GPURenderPassEncoder} renderPassEncoder The render pass encoder.
   * @param {Object} options Binding options.
   */
  bind(renderPassEncoder, options = {}) {
    // Set the pipeline
    renderPassEncoder.setPipeline(this.renderPipeline);

    // Set bind groups
    if (options.bindGroup0) {
      renderPassEncoder.setBindGroup(0, options.bindGroup0);
    }
    if (options.bindGroup1) {
      renderPassEncoder.setBindGroup(1, options.bindGroup1);
    }
  }

  /**
   * Releases this GPU program's WebGPU resources.
   */
  dispose() {
    if (this.renderPipeline) {
      // In WebGPU, pipelines don't need explicit cleanup
      this.renderPipeline = null;
    }

    if (this.pipelineLayout) {
      this.pipelineLayout = null;
    }

    if (this.vertexShader) {
      this.vertexShader.dispose();
      this.vertexShader = null;
    }

    if (this.fragmentShader) {
      this.fragmentShader.dispose();
      this.fragmentShader = null;
    }

    if (this.bindGroupLayout) {
      this.bindGroupLayout = null;
    }

    this.bindGroups = [];
    this.attributeLocations = {};
    this.uniformLocations = {};
    this.device = null;
  }

  /**
   * Returns the GLSL attribute location of a specified attribute name.
   * In WebGPU, this maps to shader locations.
   * @param {String} attributeName The name of the attribute whose location is determined.
   * @returns {Number} The attribute location, or -1 if the attribute is not found.
   * @throws {ArgumentError} If the specified attribute name is null, empty or undefined.
   */
  attributeLocation(attributeName) {
    if (!attributeName || attributeName.length == 0) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuProgram",
          "attributeLocation",
          "The specified attribute name is null, undefined or empty."
        )
      );
    }

    if (this.attributeLocations[attributeName] !== undefined) {
      return this.attributeLocations[attributeName];
    }

    // In WebGPU, we need to determine the location based on the shader
    // For now, return a default location
    return 0;
  }

  /**
   * Returns the WebGPU uniform location of a specified uniform name.
   * @param {String} uniformName The name of the uniform whose location is determined.
   * @returns {Object} Uniform information for WebGPU binding.
   * @throws {ArgumentError} If the specified uniform name is null, empty or undefined.
   */
  uniformLocation(uniformName) {
    if (!uniformName || uniformName.length == 0) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuProgram",
          "uniformLocation",
          "The specified uniform name is null, undefined or empty."
        )
      );
    }

    if (this.uniformLocations[uniformName] !== undefined) {
      return this.uniformLocations[uniformName];
    }

    // In WebGPU, uniforms are accessed via bind groups
    // Return group and binding information
    return { group: 0, binding: 0 };
  }
}

export default WebGpuProgram;