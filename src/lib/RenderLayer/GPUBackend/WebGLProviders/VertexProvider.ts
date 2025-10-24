import type { VertexSignature } from "../../../Types/VirtualResources";

type VertexType = 
|'float'
|'vec2'
|'vec4'
|'int'


type VertexProviderSignature = {
    vertexProviderName: string;
    vertexStructure: {
        name: string;
        type: VertexType;
    }[];
    maxVertexCount: number;
    maxTriangleCount: number;
};


function convertSignature(virtualSignature: VertexSignature): VertexProviderSignature {
    return {
        vertexProviderName: 'WebGLVertexProvider',
        vertexStructure: Object.keys(virtualSignature.attributes).map(attrName => ({
            name: attrName,
            type: virtualSignature.attributes[attrName]
        })),
        maxVertexCount: virtualSignature.maxVertexCount,
        maxTriangleCount: virtualSignature.maxTriangleCount
    };
}

class VertexProvider {

    gl: WebGL2RenderingContext;
    vertexProviderSignature: VertexProviderSignature;
    constructor (gl: WebGL2RenderingContext, virtualSignature: VertexSignature) {
        this.gl = gl;
        if (!this.gl) {
            throw new Error('WebGL2RenderingContext is not provided');
        }
        this.vertexProviderSignature = convertSignature(virtualSignature);
        this.setup();
    }

    dispose() {
        if (this.vertexBuffer) {
            this.gl.deleteBuffer(this.vertexBuffer);
            this.vertexBuffer = null;
        }
        if (this.indexBuffer) {
            this.gl.deleteBuffer(this.indexBuffer);
            this.indexBuffer = null;
        }
    }

    vertexBuffer: WebGLBuffer | null = null;
    indexBuffer: WebGLBuffer | null = null;
    vertexStructureObject: {
        name: string;
        type: VertexType;
        layoutIdx: number;
    }[] = [];
    setup() {
        this.vertexBuffer = this.gl.createBuffer();
        this.indexBuffer = this.gl.createBuffer();
        if (!this.vertexBuffer || !this.indexBuffer) {
            throw new Error('Failed to create vertex or index buffer');
        }
        const derivedVertexStructureObject = [];
        for (let layoutIdx = 0; layoutIdx < this.vertexProviderSignature.vertexStructure.length; layoutIdx++) {
            const attribute = this.vertexProviderSignature.vertexStructure[layoutIdx];
            derivedVertexStructureObject.push({ ...attribute, layoutIdx });
        }
        this.vertexStructureObject = derivedVertexStructureObject;

        // allocate the vertex buffer with the size of all attributes combined
        //console.log("size", this.vertexProviderSignature.maxVertexCount * this.getBufferRowSize(this.vertexStructureObject))
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER, 
            this.vertexProviderSignature.maxVertexCount * this.getBufferRowSize(this.vertexStructureObject), 
            this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        // allocate the index buffer with the size of all indices combined
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        const indexCount = this.vertexProviderSignature.maxTriangleCount * 3; // 3 indices per triangle
        this.gl.bufferData(
            this.gl.ELEMENT_ARRAY_BUFFER, 
            indexCount * Uint16Array.BYTES_PER_ELEMENT, 
            this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }


    private getPropertyTypeSize(type: VertexType): number {
        switch (type) {
            case 'float':
                return 1;
            case 'vec2':
                return 2;
            case 'vec4':
                return 4;
            case 'int':
                return 1;
            default:
                throw new Error(`Unknown vertex type: ${type}`);
        }
    }

    private getBufferRowSize(propertyStructure: {
        name: string;
        type: VertexType;
    }[]): number {
        return propertyStructure.reduce((acc, attr) => {
            switch (attr.type) {
                case 'float':
                case 'int':
                    return acc + 4;
                case 'vec2':
                    return acc + 8;
                case 'vec4':
                    return acc + 16;
                default:
                    throw new Error(`Unknown vertex type: ${attr.type}`);
            }
        }, 0);
    }

    private setData(data: {
        [key: string]: number[]
    }, structureObject: {
        name: string;
        type: VertexType;
    }[], count: number,
    buffer: WebGLBuffer) {

        const bufferData = new ArrayBuffer(this.getBufferRowSize(structureObject) * count);
        for (let i = 0; i < count; i++) {
            for (const key of Object.keys(data)) {
                const attribute = structureObject.find(attr => attr.name === key);
                if (attribute) {
                    const offset = i * this.getBufferRowSize(structureObject) + this.getBufferRowSize(structureObject.slice(0, structureObject.indexOf(attribute)));
                    const view = new DataView(bufferData);
                    let setter: (value: number, offset: number) => void;
                    switch (attribute.type) {
                        case 'float':
                        case 'vec2':
                        case 'vec4':
                            setter = (value, offset) => view.setFloat32(offset, value, true);
                            break;
                        case 'int':
                            setter = (value, offset) => view.setInt32(offset, value, true);
                            break;
                        default:
                            throw new Error(`Unknown vertex type: ${attribute.type}`);
                    }
                    const values = data[key];
                    const size = this.getPropertyTypeSize(attribute.type);
                    for (let j = 0; j < size; j++) {
                        if (j < values.length) {
                            setter(values[i*size+j], offset + j * 4);
                        } 
                    }
                }
            }
        }
        if (!buffer) {
            throw new Error('Vertex buffer is not initialized. Call setup() first.');
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, bufferData);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    setVertexData(data: {
        [key: string]: number[]
    }) {
        if (!this.vertexBuffer) {
            throw new Error('Vertex buffer is not initialized. Call setup() first.');
        }
        this.setData(
            data,
            this.vertexStructureObject,
            this.vertexProviderSignature.maxVertexCount,
            this.vertexBuffer
        );
    }

    setIndexData(data: number[]) {
        if (!this.indexBuffer) {
            throw new Error('Index buffer is not initialized. Call setup() first.');
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        const indexData = new Uint16Array(data);
        this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, indexData);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
}


export default VertexProvider;
export { convertSignature };
export type {VertexProviderSignature};