import './style.css';
import Drawing from './lib/RenderLayer/Drawing.ts'
import GPUBackend from './lib/RenderLayer/GPUBackend/gpuBackend.ts'
import AssetStore from './AssetStore.ts'
import Blueprint from './lib/AuthorLayer/Blueprint.ts'
import defaultTriangle from './demos/defaultTriangle/main.ts'
import defaultTriangleInstanced from './demos/defaultTriangleInstanced/main.ts'
import defaultTriangleInstancedUsedAsTexture from './demos/defaultTriangleInstancedUsedAsTexture/main.ts'
import drawGraph from './drawGraph.ts'
import helloWorld from './demos/helloWorld/main.ts'
import type { VirtualResourceGraph } from './lib/Types/VirtualResources/index.ts'

// Asset Store is a mock class simulating a database or state management system that we can subscribe to for changes.
const assetStore = new AssetStore();


// Here we set up the WebGL2 context and the GPU backend for rendering.
const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2", {
  antialias: false,
});
if (!gl) throw new Error("Unable to initialize WebGL2");
const gpuBackend = new GPUBackend(gl);
const drawing = new Drawing(gpuBackend);

// Now we subscribe to changes in the asset store to update our drawing whenever the assets change.
const unsubscribe = assetStore.subscribe((store, graphId) => {
  const storeObj = Object.fromEntries(store);
  drawing.submit(graphId, storeObj);
  drawing.draw("outputTexture");
});


// Now we create a "blueprint" which is a high-level representation of our rendering graph.
const gfx = new Blueprint();

const demos : { [key: string]: (input: number, selectedDemo:string) => any } = {
  helloWorld,
  defaultTriangle,
  defaultTriangleInstanced,
  defaultTriangleInstancedUsedAsTexture,
}

function updateDrawing(inputValue: number, selectedDemo:string) {
  const { addedAssets, deletedAssetIds, graphId } = gfx.update(demos[selectedDemo](inputValue, selectedDemo));
  drawGraph(addedAssets[graphId] as VirtualResourceGraph); // updating the mermaid flow diagram
  assetStore.transaction(addedAssets, deletedAssetIds, graphId);
}

const inputRange = document.getElementById("inputRange") as HTMLInputElement;
const inputSelect = document.getElementById("inputSelect") as HTMLSelectElement;
let selectedDemo = inputSelect.value;
let inputValue = parseFloat(inputRange.value) / 100;

inputSelect.addEventListener("change", () => {
  selectedDemo = inputSelect.value;
  updateDrawing(inputValue, selectedDemo);
});

inputRange.addEventListener("input", () => {
  inputValue = parseFloat(inputRange.value) / 100;
  updateDrawing(inputValue, selectedDemo);
});

updateDrawing(inputValue, selectedDemo);








