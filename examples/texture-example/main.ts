import './style.css';
import AssetStore from '../AssetStore.ts'
import drawGraph from '../drawGraph.ts'
import blueprint from './blueprint.ts'
import { Drawing, GPUBackend, Blueprint } from '../../lib/src';
import type { VirtualResourceGraph } from '../../lib/src';

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

function updateDrawing(inputValue: number) {
  const { addedAssets, deletedAssetIds, graphId } = gfx.update(blueprint(inputValue));
  drawGraph(addedAssets[graphId] as VirtualResourceGraph); // updating the mermaid flow diagram
  assetStore.transaction(addedAssets, deletedAssetIds, graphId);
}

const inputRange = document.getElementById("inputRange") as HTMLInputElement;
let inputValue = parseFloat(inputRange.value) / 100;

inputRange.addEventListener("input", () => {
  inputValue = parseFloat(inputRange.value) / 100;
  updateDrawing(inputValue);
});

updateDrawing(inputValue);








