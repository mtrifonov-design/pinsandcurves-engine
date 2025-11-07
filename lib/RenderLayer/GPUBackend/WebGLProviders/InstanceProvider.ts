import type { InstanceSignature } from "../../../Types/VirtualResources";

type InstanceType = 
|'float'
|'vec2'
|'vec4'
|'int'

type InstanceProviderSignature = {
    instanceProviderName: string;
    instanceStructure: {
        name: string;
        type: InstanceType;
    }[];
    maxInstanceCount: number;
};


function convertSignature(virtualSignature: InstanceSignature): InstanceProviderSignature {
    return {
        instanceProviderName: 'WebGLInstanceProvider',
        instanceStructure: Object.keys(virtualSignature.attributes).map(attrName => ({
            name: attrName,
            type: virtualSignature.attributes[attrName]
        })),
        maxInstanceCount: virtualSignature.maxInstanceCount
    }
}

class InstanceProvider {

    gl: WebGL2RenderingContext;
    instanceProviderSignature: InstanceProviderSignature;
    constructor (gl: WebGL2RenderingContext, virtualSignature: InstanceSignature) {
        this.gl = gl;
        if (!this.gl) {
            throw new Error('WebGL2RenderingContext is not provided');
        }
        const ips : InstanceProviderSignature = convertSignature(virtualSignature);
        this.instanceProviderSignature = ips;
        this.setup();
    }

    instanceBuffer: WebGLBuffer | null = null;
    instanceStructureObject: {
        name: string;
        type: InstanceType;
        layoutIdx: number;
    }[] = [];

    dispose() {
        if (this.instanceBuffer) {
            this.gl.deleteBuffer(this.instanceBuffer);
            this.instanceBuffer = null;
        }
    }

    setup() {
        this.instanceBuffer = this.gl.createBuffer();
        if (!this.instanceBuffer) {
            throw new Error('Failed to create instance buffer');
        }
        const derivedInstanceStructureObject = [];
        for (let layoutIdx = 0; layoutIdx < this.instanceProviderSignature.instanceStructure.length; layoutIdx++) {
            const attribute = this.instanceProviderSignature.instanceStructure[layoutIdx];
            derivedInstanceStructureObject.push({ ...attribute, layoutIdx });
        }
        this.instanceStructureObject = derivedInstanceStructureObject;

        // allocate the instance buffer with the size of all attributes combined
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.instanceBuffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER, 
            this.instanceProviderSignature.maxInstanceCount * this.getBufferRowSize(this.instanceStructureObject), 
            this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }


    private getPropertyTypeSize(type: InstanceType): number {
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
        type: InstanceType;
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
        type: InstanceType;
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
        // Log the buffer as floating point values for debugging
        //console.log('Setting vertex data:', new Float32Array(bufferData));
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, bufferData);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    setInstanceData(data: {
        [key: string]: number[]
    }) {
        if (!this.instanceBuffer) {
            throw new Error('Instance buffer is not initialized. Call setup() first.');
        }
        this.setData(
            data,
            this.instanceStructureObject,
            this.instanceProviderSignature.maxInstanceCount,
            this.instanceBuffer
        );
    }

}


export default InstanceProvider;
export { convertSignature };
export type {InstanceProviderSignature};