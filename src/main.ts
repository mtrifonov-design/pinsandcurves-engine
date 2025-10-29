import Drawing from './lib/RenderLayer/Drawing.ts'
import GPUBackend from './lib/RenderLayer/GPUBackend/gpuBackend.ts'
import AssetStore from './AssetStore.ts'
import Blueprint from './lib/AuthorLayer/Blueprint.ts'
import defaultTriangle from './scene/defaultTriangle/main.ts'
import defaultTriangleInstanced from './scene/defaultTriangleInstanced/main.ts'
import defaultTriangleInstancedUsedAsTexture from './scene/defaultTriangleInstancedUsedAsTexture/main.ts'
import drawGraph from './drawGraph.ts'
import helloWorld from './scene/helloWorld/main.ts'



const assetStore = new AssetStore();
const canvas = document.getElementById("mainCanvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2", {
  antialias: false,
});
if (!gl) throw new Error("Unable to initialize WebGL2");
const gpuBackend = new GPUBackend(gl);
const drawing = new Drawing(gpuBackend);
const unsubscribe = assetStore.subscribe((store, graphId) => {
  const storeObj = Object.fromEntries(store);
  drawing.submit(graphId, storeObj);
  drawing.draw("outputTexture");
});

const gfx = new Blueprint();
const inputRange = document.getElementById("inputRange") as HTMLInputElement;
const inputSelect = document.getElementById("inputSelect") as HTMLSelectElement;

const demos : { [key: string]: (input: number, selectedDemo:string) => any } = {
  defaultTriangle,
  defaultTriangleInstanced,
  defaultTriangleInstancedUsedAsTexture,
  helloWorld
}
let selectedDemo = inputSelect.value;
let inputValue = parseFloat(inputRange.value) / 100;
inputSelect.addEventListener("change", () => {
  selectedDemo = inputSelect.value;
  const { addedAssets, deletedAssetIds, graphId } = gfx.update(demos[selectedDemo](inputValue, selectedDemo));
  drawGraph(addedAssets[graphId]);
  assetStore.transaction(addedAssets, deletedAssetIds, graphId);
});

inputRange.addEventListener("input", () => {
  inputValue = parseFloat(inputRange.value) / 100;
  const { addedAssets, deletedAssetIds, graphId } = gfx.update(demos[selectedDemo](inputValue, selectedDemo));
  drawGraph(addedAssets[graphId]);
  assetStore.transaction(addedAssets, deletedAssetIds, graphId);
});

const { addedAssets, deletedAssetIds, graphId } = gfx.update(demos[selectedDemo](inputValue, selectedDemo));
drawGraph(addedAssets[graphId]);
assetStore.transaction(addedAssets, deletedAssetIds, graphId);







