
import PreResource from "./PreResourceBase";
type PreResourceGraph = {
    [resourceId: string]: PreResource | PreResourceGraph;
};

type FlattenedPreResourceGraph = {
    [resourceId: string]: PreResource
};

export type {
    PreResourceGraph,
    FlattenedPreResourceGraph
}