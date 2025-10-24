import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import Graphics from './lib/AuthorLayer/Blueprint.ts'
import { Texture, Vertices } from './lib/AuthorLayer/index.ts'
import type PreResource from './lib/AuthorLayer/PreResourceBase.ts'
import type { PreResourceGraph } from './lib/AuthorLayer/types.ts'
import Drawing from './lib/RenderLayer/Drawing.ts'
import GPUBackend from './lib/RenderLayer/GPUBackend/gpuBackend.ts'

function renderTextures(vertices: PreResource): PreResourceGraph {
  const t = Texture({
    width: 256,
    height: 256,
  }, [
    {
      uniforms: {},
      textures: {},
      vertices: {
        stage: 'author',
        resource: vertices
      },
      vertexShaderData: {
        stage: 'author',
        data: () => `
        void main() {
          gl_Position = position;
        }
      `,
    },
        fragmentShaderData: {
          stage: 'author',
          data: () => `
          void main() {
            outColor = vec4(1.,0.,0.,1.);
          }
      `
        }
      
    }
  ], []);
  return {
    t
  }
}

function mainRender() {
  const a = Vertices({
    attributes: {
      position: 'vec4'
    }
  }, {
    count: 1,
    vertices: () => ({
      position: [
      0, 0, 0, 1,
      1, 0, 0, 1,
      0, 1, 0, 1,
    ]}),
    indices: () => ([
      0, 1, 2
    ])
  }, []);
  const c = renderTextures(a);
  return { a,c };
}



const gfx = new Graphics();
const {assets, assetRegistry} = gfx.update(mainRender());
const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2", {
  antialias: false,
});
if (!gl) throw new Error("Unable to initialize WebGL2");
const gpuBackend = new GPUBackend(gl);
const drawing = new Drawing(gpuBackend);
drawing.submit(assetRegistry.graphId, assets);
drawing.draw("c/t");
console.log(gfx.update(mainRender()));
