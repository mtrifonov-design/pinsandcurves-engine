import Graphics from "./Blueprint";

import * as PreResources from "./PreResources";

const Vertices = PreResources.VerticesFactory;
const Instances = PreResources.InstancesFactory;
const Uniforms = PreResources.UniformsFactory;
const Texture = PreResources.TextureFactory;
const RotatingTexture = PreResources.RotatingTextureFactory;
const InputTexture = PreResources.InputTextureFactory;

export {
    Graphics,
    Vertices,
    Instances,
    Uniforms,
    Texture,
    RotatingTexture,
    InputTexture
};