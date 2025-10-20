import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import Graphics from './lib/AuthorLayer/Graphics.ts'
import { Texture, Vertices } from './lib/AuthorLayer/index.ts'
import type PreResource from './lib/AuthorLayer/PreResourceBase.ts'
import type { PreResourceGraph } from './lib/AuthorLayer/types.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

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
      shader code
      `,
    },
        fragmentShaderData: {
          stage: 'author',
          data: () => `
      shader code
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
    count: 3,
    vertices: () => new Float32Array([
      0, 0, 0, 1,
      1, 0, 0, 1,
      0, 1, 0, 1,
    ]),
    indices: () => new Uint16Array([
      0, 1, 2
    ])
  }, []);
  const b = Vertices({
    attributes: {
      position: 'vec4',
      color: 'vec4'
    }
  }, {
    count: 3,
    vertices: () => new Float32Array([
      0, 0, 0, 1,
      1, 0, 0, 1,
      0, 1, 0, 1,
    ]),
    indices: () => new Uint16Array([
      0, 1, 2
    ])
  }, []);

  const c = renderTextures(a);

  return { a, b, c };
}

const gfx = new Graphics();
console.log(gfx.update(mainRender()));

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
