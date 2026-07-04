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
 * Constructs a WebGPU shader module.
 * @alias WebGpuShader
 * @constructor
 * @classdesc Represents a WebGPU shader module (WGSL) and provides methods for compiling and disposing
 * of them.
 * @param {GPUDevice} device The WebGPU device.
 * @param {String} shaderType The type of shader, either "vertex" or "fragment".
 * @param {String} shaderSource The shader's source code in WGSL.
 * @throws {ArgumentError} If the shader type is unrecognized, the shader source is null or undefined or shader
 * compilation fails.
 */
class WebGpuShader {
  constructor(device, shaderType, shaderSource) {
    if (!(shaderType === "vertex" || shaderType === "fragment")) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuShader",
          "constructor",
          "The specified shader type is unrecognized. Must be 'vertex' or 'fragment'."
        )
      );
    }

    if (!shaderSource) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuShader",
          "constructor",
          "The specified shader source is null or undefined."
        )
      );
    }

    if (!device) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuShader",
          "constructor",
          "The specified WebGPU device is null or undefined."
        )
      );
    }

    try {
      this.shaderType = shaderType;
      this.device = device;
      this.shaderSource = shaderSource;
      
      // Create shader module from WGSL source
      this.shaderModule = device.createShaderModule({
        code: shaderSource
      });

      // Determine entry point based on shader type
      this.entryPoint = shaderType === "vertex" ? "main" : "main";

    } catch (error) {
      throw new ArgumentError(
        Logger.logMessage(
          Logger.LEVEL_SEVERE,
          "WebGpuShader",
          "constructor",
          "Unable to create WebGPU shader module: " + error.message
        )
      );
    }
  }

  /**
   * Releases this shader's WebGPU shader module.
   */
  dispose() {
    if (this.shaderModule) {
      // In WebGPU, shader modules don't need explicit cleanup
      // but we nullify the reference
      this.shaderModule = null;
    }
    this.device = null;
    this.shaderSource = null;
  }

  /**
   * Converts GLSL shader source to WGSL.
   * This is a basic conversion that handles common GLSL patterns.
   * For complex shaders, manual conversion may be required.
   * @param {String} glslSource The GLSL source code.
   * @param {String} shaderType The type of shader ("vertex" or "fragment").
   * @returns {String} The converted WGSL source code.
   */
  static glslToWgsl(glslSource, shaderType) {
    let wgsl = glslSource;

    // Remove GLSL version directive
    wgsl = wgsl.replace(/^#version\s+\d+.*$/gm, '');

    // Remove precision qualifiers
    wgsl = wgsl.replace(/precision\s+\w+\s+float;/g, '');
    wgsl = wgsl.replace(/precision\s+\w+\s+int;/g, '');

    // Replace attribute with @location
    wgsl = wgsl.replace(/attribute\s+(\w+)\s+(\w+)\s*;/g, '@location($1) var $2: $1;');
    wgsl = wgsl.replace(/attribute\s+(\w+)\s+(\w+)/g, '@location($1) var $2');

    // Replace varying with @location for fragment outputs
    if (shaderType === "fragment") {
      wgsl = wgsl.replace(/varying\s+(\w+)\s+(\w+)\s*;/g, '@location($1) var $2: $1;');
      wgsl = wgsl.replace(/varying\s+(\w+)\s+(\w+)/g, '@location($1) var $2');
    } else {
      // For vertex shaders, varyings become outputs
      wgsl = wgsl.replace(/varying\s+(\w+)\s+(\w+)\s*;/g, '@location($1) var $2: $1;');
      wgsl = wgsl.replace(/varying\s+(\w+)\s+(\w+)/g, '@location($1) var $2');
    }

    // Replace uniform with @group/@binding
    wgsl = wgsl.replace(/uniform\s+(\w+)\s+(\w+)\s*\{/g, '@group(0) @binding($1) var $2: ');
    
    // Replace texture sampler uniform
    wgsl = wgsl.replace(/uniform\s+sampler2D\s+(\w+)\s*;/g, '@group(1) @binding(0) var $1: sampler;');
    
    // Replace texture uniform
    wgsl = wgsl.replace(/uniform\s+(\w+)\s+(\w+)\s*;/g, '@group(1) @binding(1) var $2: texture_2d<$1>;');

    // Replace main function signature
    wgsl = wgsl.replace(/void\s+main\s*\(\s*\)/g, 'fn main()');

    // Replace texture2D with textureSample
    wgsl = wgsl.replace(/texture2D\(/g, 'textureSample(');
    wgsl = wgsl.replace(/texture2D\s*\(/g, 'textureSample(');

    // Replace gl_Position with builtin position
    wgsl = wgsl.replace(/gl_Position/g, 'var gl_Position: vec4<f32>;');

    // Replace gl_FragColor with @location(0)
    wgsl = wgsl.replace(/gl_FragColor/g, '@location(0) var gl_FragColor: vec4<f32>');

    // Add WGSL stage declaration
    const stage = shaderType === "vertex" ? "vertex" : "fragment";
    wgsl = `@stage(${stage})
${wgsl}`;

    // Add necessary imports and structs
    wgsl = `struct VertexOutput {
  @builtin(position) position: vec4<f32>,
};

${wgsl}`;

    return wgsl;
  }

  /**
   * Gets the shader stage flag for pipeline creation.
   * @returns {GPUShaderStage} The shader stage flag.
   */
  getShaderStage() {
    return this.shaderType === "vertex" 
      ? GPUShaderStage.VERTEX 
      : GPUShaderStage.FRAGMENT;
  }

  /**
   * Gets the entry point for the shader.
   * @returns {String} The entry point name.
   */
  getEntryPoint() {
    return this.entryPoint;
  }

  /**
   * Gets the shader module.
   * @returns {GPUShaderModule} The WebGPU shader module.
   */
  getShaderModule() {
    return this.shaderModule;
  }
}

export default WebGpuShader;