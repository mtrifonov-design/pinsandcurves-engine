
// The purpose of this class is to provide an abstraction for a "Uniform Buffer Object" in WebGL2.

import type { UniformSignature } from "../../../Types/VirtualResources";

// Conceptually, we consider this an "input" to a program.
type UniformType = 
|'float'
|'vec2'
|'vec3'
|'vec4'
|'mat3'
|'mat3x3'
|'mat4'
|'mat4x4'
|'int'
|'ivec2'
|'ivec3'
|'ivec4';

type UniformStructure = {
    name: string;
    type: UniformType;
}[];

type UniformProviderSignature = {
    uniformProviderName: string;
    uniformStructure: UniformStructure;
};

type UniformValues = {
    [key: string]: number | number[]
};

function convertSignature(virtualSignature: UniformSignature, name?: string): UniformProviderSignature {
    return {
        uniformProviderName: name ? name : 'WebGLUniformProvider',
        uniformStructure: Object.keys(virtualSignature.bindings).map(bindingName => ({
            name: bindingName,
            type: virtualSignature.bindings[bindingName]
        }))
    }
}

class UniformProvider {
    gl: WebGL2RenderingContext;
    uniformStructure: UniformStructure;
    uniformProviderName: string;
    constructor(gl: WebGL2RenderingContext, virtualSignature: UniformSignature) {
        const { uniformProviderName, uniformStructure } = convertSignature(virtualSignature);
        this.gl = gl;
        if (!this.gl) {
            throw new Error('WebGL2RenderingContext is not provided');
        }
        this.uniformProviderName = uniformProviderName;
        this.uniformStructure = uniformStructure;
        this.setup();
    }


    dispose() {
        if (this.buffer) {
            this.gl.deleteBuffer(this.buffer);
            this.buffer = null;
        }
    }

    buffer: WebGLBuffer | null = null;
    setup() {
        const buffer = this.gl.createBuffer();
        if (!buffer) {
            throw new Error('Failed to create uniform buffer');
        }

        // allocate the buffer with the size of all uniforms combined
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, buffer);
        this.gl.bufferData(this.gl.UNIFORM_BUFFER, this.uniformBufferSize, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
        this.buffer = buffer;
    }

    getUniformSize(name: string): number {
        const uniform = this.uniformStructure.find(u => u.name === name);
        if (!uniform) {
            throw new Error(`Uniform ${name} not found in structure`);
        }
        const type = uniform.type;
        switch (type) {
            case 'float':
                return 4;
            case 'vec2':
                return 8;
            case 'vec3':
                return 16;
            case 'vec4':
                return 16;
            case 'mat3':
            case 'mat3x3':
                return 64; 
            case 'mat4':
            case 'mat4x4':
                return 64;
            case 'int':
                return 4;
            case 'ivec2':
                return 8;
            case 'ivec3':
                return 16;
            case 'ivec4':
                return 16;
            default:
                throw new Error(`Unknown uniform type: ${type}`);
        }
    }

    getUniformType(name: string): string {
        const uniform = this.uniformStructure.find(u => u.name === name);
        if (!uniform) {
            throw new Error(`Uniform ${name} not found in structure`);
        }
        const type = uniform.type;
        switch (type) {
            case 'float':
            case 'vec2':
            case 'vec3':
            case 'vec4':
            case 'mat3':
            case 'mat3x3':
            case 'mat4':
            case 'mat4x4':
                return "float";
            case 'int':
            case 'ivec2':
            case 'ivec3':
            case 'ivec4':
                return "int";
            default:
                throw new Error(`Unknown uniform type: ${type}`);
        }
    }

    getUniformOffset(name: string) : number {
        let offset = 0;
        for (let i = 0; i < this.uniformStructure.length; i++) {
            const uniform = this.uniformStructure[i];
            if (uniform.name === name) {
                return offset;
            }
            offset += this.getUniformSize(uniform.name);
        }
        throw new Error(`Uniform ${name} not found in structure`);
    }

    get uniformBufferSize() {
        const baseSize=  this.uniformStructure.reduce((total, uniform) => {
            const size = this.getUniformSize(uniform.name);
            return total + size;
        }, 0);
        // Align to 16 bytes
        return Math.ceil(baseSize / 16) * 16;
    }

    setUniforms(uniformValues: UniformValues) {
        if (!this.buffer) {
            throw new Error('Uniform buffer is not initialized. Call setup() first.');
        }
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buffer);
        for (const uniform of Object.keys(uniformValues)) {
            const value = uniformValues[uniform];
            const offset = this.getUniformOffset(uniform);
            const size = this.getUniformSize(uniform);
            const type = this.getUniformType(uniform);
            if (Array.isArray(value)) {
                if (value.length * 4 !== size) {
                    throw new Error(`Uniform ${uniform} has incorrect size. Expected ${size / 4} elements, got ${value.length}`);
                }
                const arr = type === 'int' ? new Int32Array(value) : new Float32Array(value);
                this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, offset, arr);
            } else if (typeof value === 'number') {
                if (size !== 4) {
                    throw new Error(`Uniform ${uniform} has incorrect size. Expected ${size / 4} elements, got 1`);
                }
                const arr = type === 'int' ? new Int32Array([value]) : new Float32Array([value]);
                this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, offset, arr);
            } else {
                throw new Error(`Uniform ${uniform} has unsupported type. Expected number or array, got ${typeof value}`);
            }
        }
        this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
    }


}

export { convertSignature };
export type { UniformProviderSignature }
export default UniformProvider;