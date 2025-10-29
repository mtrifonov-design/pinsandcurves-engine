# Pins and Curves Engine

*A truthful abstraction for learning and prototyping GPU pipelines.*

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-early%20prototype-orange.svg)]()


## Overview
Pins and Curves engine is an open-source graphics framework that **removes friction** from GPU programming while preserving its mental model.

It sits halfway between WebGL and high-level creative coding frameworks, keeping GPU concepts visible (passes, resources, dependencies) whilst automating the tedious setup.

- **For beginners:** learn graphics pipelines and GPU resource flow without the boilerplate of raw WebGL
- **For professionals:** prototype rapidly, author graphics pipelines in a high-level serializable format

> This project is in its very early stages of development.
> It started as the render engine behind [**Pins and Curves**](https://pinsandcurves.app), a motion design editor.
> I'd love for it to evolve into a shared open-source effort (likely under a new name).
> If you'd like to get involved during this formative period, please contact me at [martin@pinsandcurves.app](mailto:martin@pinsandcurves.app)

## Example: Default Triangle
```ts
function defaultTriangle(height: number) {
    const triangle = Vertices(
        {
            attributes: {
                pos: 'vec2',
                uv: 'vec2',
            }
        }, 
        {
            triangleCount: 1,
            vertices: () => ([
                { pos: [-1,-1],      uv: [0,0] },
                { pos: [0,height],  uv: [0,1] },
                { pos: [1,-1],       uv: [1,0] }
            ]),
            indices: () => ([0, 1, 2,])
        }, 
        [height]
    );
    const outputTexture = Texture(
        {
            width: 1920,
            height: 1080,
        }, 
        [
            DrawOp(
                triangle,
                () => `
                out vec2 v_uv;
                void main() {
                    gl_Position = vec4(pos,0.,1.);
                    v_uv = uv;
                }
                `,
                () => `
                in vec2 v_uv;
                void main() {
                    outColor = vec4(v_uv, 1.0, 1.0);
                }`
            )
        ], 
        []
    );
    return { triangle, outputTexture };
}
gfx.update(defaultTriangle(1));
```

![A graph depicting the triangle example](/public/helloWorldExample.png)

Now that you get the gist, here's a slightly more involved example:

![A graph depicting the triangle example](/public/slightlymoreinvolved.png)

## Features

- **RenderGraph API**\
    Author your GPU pipeline as a **function that returns a RenderGraph**, a graph consisting of 
    Textures, Vertex-, Instance-, and Uniformbuffers. Draw calls are attached directly to Textures, providing a simple model to work with.

- **Reactive Authoring Model**\
    The function you write is pure & reactive: Each invokation produces a new RenderGraph.
    Borrowing ideas from modern front-end frameworks, the engine diffs successive graphs and reevaluates only what's changed.

- **Virtualized Resources**\
    The backend maps the logical resources to GPU memory, reusing allocations where possible through texture-memory aliasing.

- **Composable Pipelines**\
    Offer and import partial RenderGraphs as **plugins**, enabling composable pipelines and reusable effects.

- **Serializable Format**\
    RenderGraphs can be serialized and streamed, enabling server-side generation or networked composition of pipelines.

- **Multiple Backends (planned)**\
    Currently, only WebGL2 is supported. I plan to support WebGPU in the future.

## License

MIT © 2025 Martin Trifonov

## Acknowledgements

This project draws inspiration from modern render-graph architectures in real-time graphics engines, reimagined for the web. In particular, Yuriy O'Donell's talk "FrameGraph: Extensible Rendering Architecture in Frostbite" was an important inspiration.