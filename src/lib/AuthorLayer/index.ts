import Graphics from "./Graphics";

import * as PreResources from "./PreResources";

const Vertices = PreResources.VerticesFactory;
const Instances = PreResources.InstancesFactory;
const Uniforms = PreResources.uniformsFactory;
const Texture = PreResources.TextureFactory;

export {
    Graphics,
    Vertices,
    Instances,
    Uniforms,
    Texture
};