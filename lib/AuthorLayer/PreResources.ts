import type { DrawOp, Instances, InstanceSignature, RotatingTexture, Texture, TextureSignature, Uniforms, UniformSignature, VertexSignature, Vertices } from "../Types/VirtualResources";
import PreResource from "./PreResourceBase";


import VerticesFactory from "./ResourceFactories/VerticesFactory";

import InstancesFactory from "./ResourceFactories/InstancesFactory";

import UniformsFactory from "./ResourceFactories/UniformsFactory";

import TextureFactory from "./ResourceFactories/TextureFactory";

import DrawOpFactory from "./ResourceFactories/DrawOpFactory";

export {
    VerticesFactory,
    InstancesFactory,
    UniformsFactory,
    TextureFactory,
    DrawOpFactory
};