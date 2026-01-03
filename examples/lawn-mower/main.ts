import './style.css';
import AssetStore from '../AssetStore.ts'
import drawGraph from '../drawGraph.ts'
import blueprint from './blueprint.ts'
import { Drawing, GPUBackend, Blueprint } from "pinsandcurves-engine";
import type { VirtualResourceGraph } from "pinsandcurves-engine";

console.log("Lawn Mower example");

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

type WorldState = {
  lawnMowerInputImage: any,
  lawnMowerPosition: { x: number, y: number },
  lawnMowerOrientation: number,
}


// Now we create a "blueprint" which is a high-level representation of our rendering graph.
const gfx = new Blueprint();

function updateDrawing(inputValue: WorldState) {
  const { addedAssets, deletedAssetIds, graphId } = gfx.update(blueprint(inputValue));
  drawGraph(addedAssets[graphId] as VirtualResourceGraph); // updating the mermaid flow diagram
  assetStore.transaction(addedAssets, deletedAssetIds, graphId);
}


const lawnMowerCanvas = document.createElement('canvas');
lawnMowerCanvas.width = 512;
lawnMowerCanvas.height = 512;
const lawnMowerCtx = lawnMowerCanvas.getContext('2d')!;
lawnMowerCtx.fillStyle = 'white';
lawnMowerCtx.fillRect(0, 0, 512, 512);
const worldState: WorldState = {
  lawnMowerInputImage: lawnMowerCanvas,
  lawnMowerPosition: { x: 0, y: 0 },
  lawnMowerOrientation: 0,
};

document.addEventListener('keydown', (event) => {
  event.preventDefault();
  const step = 0.02;
  const rotStep = 0.1;
  let prevX, prevY;
  const key = event.key;
  if (key === "ArrowUp") {
    
    prevX = worldState.lawnMowerPosition.x;
    prevY = worldState.lawnMowerPosition.y;
    worldState.lawnMowerPosition.x += step * Math.cos(worldState.lawnMowerOrientation);
    worldState.lawnMowerPosition.y += step * Math.sin(worldState.lawnMowerOrientation);
    lawnMowerCtx.strokeStyle = 'black';
    lawnMowerCtx.lineWidth = 100;
    lawnMowerCtx.beginPath();
    lawnMowerCtx.moveTo(
      (prevX + 0.5) * 512,
      (prevY + 0.5) * 512
    );
    lawnMowerCtx.lineTo(
      (worldState.lawnMowerPosition.x + 0.5) * 512,
      (worldState.lawnMowerPosition.y + 0.5) * 512
    );
    lawnMowerCtx.stroke();
  }
  if (key === "ArrowDown") {
    prevX = worldState.lawnMowerPosition.x;
    prevY = worldState.lawnMowerPosition.y;
    worldState.lawnMowerPosition.y += -step * Math.sin(worldState.lawnMowerOrientation);
    worldState.lawnMowerPosition.x += -step * Math.cos(worldState.lawnMowerOrientation);
    lawnMowerCtx.strokeStyle = 'black';
    lawnMowerCtx.lineWidth = 100;
    lawnMowerCtx.beginPath();
    lawnMowerCtx.moveTo(
      (prevX + 0.5) * 512,
      (prevY + 0.5) * 512
    );
    lawnMowerCtx.lineTo(
      (worldState.lawnMowerPosition.x + 0.5) * 512,
      (worldState.lawnMowerPosition.y + 0.5) * 512
    );
    lawnMowerCtx.stroke();
  }
  if (key === "ArrowLeft") {
    worldState.lawnMowerOrientation -= rotStep;
  }
  if (key === "ArrowRight") {
    worldState.lawnMowerOrientation += rotStep;
  }

  updateDrawing(worldState);
});

updateDrawing(worldState);








