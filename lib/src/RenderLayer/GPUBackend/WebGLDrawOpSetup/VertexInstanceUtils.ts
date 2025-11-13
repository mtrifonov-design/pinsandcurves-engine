type GLSLPrimitiveType =
    | 'float'
    | 'vec2'
    | 'vec4'
    | 'int';

export function getPropertyTypeSize(type: GLSLPrimitiveType): number {
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

export function getPropertyTypeType(type: GLSLPrimitiveType, gl: WebGL2RenderingContext): GLenum {
    switch (type) {
        case 'float':
        case 'vec2':
        case 'vec4':
            return gl.FLOAT;
        case 'int':
            return gl.INT;
        default:
            throw new Error(`Unknown vertex type: ${type}`);
    }
}

export function getBufferRowSize(propertyStructure: {
    name: string;
    type: GLSLPrimitiveType;
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