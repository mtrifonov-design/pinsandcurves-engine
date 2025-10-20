import type { FlattenedPreResourceGraph, PreResourceGraph } from "../types";
import PreResource from "../PreResourceBase";

function flattenPrg(prg: PreResourceGraph): FlattenedPreResourceGraph {
    const result: FlattenedPreResourceGraph = {};
    function recurse(subPrg: PreResourceGraph, path: string[]) {
        for (const [id, preResource] of Object.entries(subPrg)) {
            if (preResource instanceof PreResource) {
                const composedId = [...path, id].join("/");
                result[composedId] = preResource;
            } else {
                recurse(preResource, [...path, id]);
            }
        }
    }
    recurse(prg, []);
    return result;
}


export default flattenPrg;