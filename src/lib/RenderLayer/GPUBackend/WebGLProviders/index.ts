import InstanceProvider from "./InstanceProvider"
import VertexProvider from "./VertexProvider"
import UniformProvider from "./UniformProvider"
import ProgramProvider from "./ProgramProvider"
import TextureProvider from "./TextureProvider"

type GPUResourceProvider =
    | InstanceProvider
    | VertexProvider
    | UniformProvider
    | ProgramProvider
    | TextureProvider

export type { GPUResourceProvider }

export {
    InstanceProvider,
    VertexProvider,
    UniformProvider,
    ProgramProvider,
    TextureProvider,
}