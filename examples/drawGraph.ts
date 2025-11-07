import mermaid from "mermaid";
import getDependencies from "../lib/RenderLayer/RenderHelpers/getDependencies";
import type { VirtualResourceGraph } from "../lib/Types/VirtualResources";

const graphingContainer = document.getElementById("graphing-container");
mermaid.initialize({ startOnLoad: false });

let lastGraphString = "";
async function drawGraph(graph: VirtualResourceGraph) {
    let graphString = "graph LR\n";
    for (const [nodeId, node] of Object.entries(graph)) {
        const dependencies = getDependencies(nodeId, graph);
        for (const depId of dependencies) {
            graphString += `${depId}-->${nodeId}\n`;
        }
    }
    if (graphString !== lastGraphString) {
        console.log("Rendering graph:", graphString, lastGraphString);
        const { svg } = await mermaid.render("theGraph", graphString)
        graphingContainer!.innerHTML = "";
        graphingContainer!.innerHTML = svg;
    }
    lastGraphString = graphString;
}

export default drawGraph;