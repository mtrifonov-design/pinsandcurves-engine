import './style.css';
import AssetStore from '../AssetStore.ts'
import drawGraph from '../drawGraph.ts'
import blueprint from './blueprint.ts'
import { Drawing, GPUBackend, Blueprint } from "pinsandcurves-engine";
import type { VirtualResourceGraph } from "pinsandcurves-engine";

import mowerImageUrl from './lawn-mower.png'

const lawnMowerCanvas = document.createElement('canvas');
lawnMowerCanvas.width = 512;
lawnMowerCanvas.height = 512;
const lawnMowerCtx = lawnMowerCanvas.getContext('2d')!;
const lawnImg = new Image();
lawnImg.src = mowerImageUrl;
await new Promise((resolve) => {
  lawnImg.onload = () => resolve(true);
});
lawnMowerCtx.drawImage(lawnImg, 0, 0, 512, 512);

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
  lawnInputImage: any,
  lawnMowerPosition: { x: number, y: number },
  lawnMowerOrientation: number,
}


// Now we create a "blueprint" which is a high-level representation of our rendering graph.
const gfx = new Blueprint();

function updateDrawing(inputValue: WorldState) {
  //const updatedBlueprint = blueprint(inputValue);
  //console.log("Updating drawing with new blueprint:", updatedBlueprint);
  const { addedAssets, deletedAssetIds, graphId } = gfx.update(blueprint(inputValue));
  //drawGraph(addedAssets[graphId] as VirtualResourceGraph); // updating the mermaid flow diagram
  assetStore.transaction(addedAssets, deletedAssetIds, graphId);
}


const lawnCanvas = document.createElement('canvas');
lawnCanvas.width = 512;
lawnCanvas.height = 512;
const lawnCtx = lawnCanvas.getContext('2d')!;
lawnCtx.fillStyle = 'white';
lawnCtx.fillRect(0, 0, 512, 512);
const worldState: WorldState = {
  lawnInputImage: lawnCanvas,
  lawnMowerInputImage: lawnMowerCanvas,
  lawnMowerPosition: { x: 0, y: 0 },
  lawnMowerOrientation: 0,
};

const lawnSampleCanvas = document.createElement('canvas');
lawnSampleCanvas.width = 16;
lawnSampleCanvas.height = 16;
const lawnSampleCtx = lawnSampleCanvas.getContext('2d')!;

const startTime = Date.now();

const keysDown = new Set<string>();
document.addEventListener('keydown', (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") event.preventDefault();
  keysDown.add(event.key);
});
document.addEventListener('keyup', (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") event.preventDefault();
  keysDown.delete(event.key);
});

let speed = 0.00;
function gameLoop() {
  if (keysDown.has("ArrowUp")) {
    speed += 0.02;
  } else if (keysDown.has("ArrowDown")) {
    speed -= 0.02;
  } else {
    speed *= 0.98;
  }
  speed = Math.max(Math.min(speed, 1), -1);
  //console.log("Speed:", speed);
  const step = 0.05 * speed;
  const rotStep = 0.05;
  let outOfBounds = false;
  let prevX, prevY;
    prevX = worldState.lawnMowerPosition.x;
    prevY = worldState.lawnMowerPosition.y;
    worldState.lawnMowerPosition.x += step * Math.cos(worldState.lawnMowerOrientation);
    worldState.lawnMowerPosition.y += step * Math.sin(worldState.lawnMowerOrientation);
    if (worldState.lawnMowerPosition.x < -1) worldState.lawnMowerPosition.x = -1, outOfBounds = true;
    if (worldState.lawnMowerPosition.x > 1) worldState.lawnMowerPosition.x = 1, outOfBounds = true;
    if (worldState.lawnMowerPosition.y < -1) worldState.lawnMowerPosition.y = -1, outOfBounds = true;
    if (worldState.lawnMowerPosition.y > 1) worldState.lawnMowerPosition.y = 1, outOfBounds = true;
    if (outOfBounds) {
      // prevX = worldState.lawnMowerPosition.x;
      // prevY = worldState.lawnMowerPosition.y;
      speed = 0;
    }
    lawnCtx.strokeStyle = 'black';
    lawnCtx.lineWidth = 80;
    lawnCtx.beginPath();
    lawnCtx.moveTo(
      (prevX + 0.5) * 512,
      (prevY + 0.5) * 512
    );
    lawnCtx.lineTo(
      (worldState.lawnMowerPosition.x + 0.5) * 512,
      (worldState.lawnMowerPosition.y + 0.5) * 512
    );
    lawnCtx.stroke();
  if (keysDown.has("ArrowLeft")) {
    worldState.lawnMowerOrientation += rotStep;
  }
  if (keysDown.has("ArrowRight")) {
    worldState.lawnMowerOrientation -= rotStep;
  }
  lawnSampleCtx.clearRect(0, 0, 16, 16);
  lawnSampleCtx.drawImage(lawnCanvas, 0, 0, 512, 512, 0, 0, 16, 16);
  const data = lawnSampleCtx.getImageData(0, 0, 16, 16);
  let allShort = true;
  let cumBrightness = 0;
  //console.log("data.data.length:", data.data.length);
  for (let i = 0; i < data.data.length; i += 4) {
    const r = data.data[i];
    const g = data.data[i + 1];
    const b = data.data[i + 2];
    const a = data.data[i + 3];
    const brightness = (r + g + b) / 3;
    cumBrightness += brightness;
    //console.log("brightness:", cumBrightness);
    if (brightness > 25) {
      allShort = false;
    }
  }
  cumBrightness /= (data.data.length / 4);
  //console.log("cumBrightness:", cumBrightness);
  const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  const secondsLeft = Math.max(0, 200 - elapsedSeconds);

  //console.log("allShort:", allShort);
  if (allShort) {
    document.getElementById("clock").innerText = `Good job bud! 🎉`;
  } else if (secondsLeft > 0) {
    document.getElementById("clock").innerText = `Time Remaining: ${secondsLeft}s`;
  } else {
    document.getElementById("clock").innerText = `Time's up! ⏰`;
  }

  updateDrawing(worldState);
  requestAnimationFrame(gameLoop);
}

gameLoop();








