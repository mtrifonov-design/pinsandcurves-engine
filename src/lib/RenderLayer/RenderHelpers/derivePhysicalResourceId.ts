import type { VirtualResource } from "../../Types/VirtualResources";
import type { PhysicalSignature } from "./types";

function derivePhysicalResourceId(resourceId: string, signature: PhysicalSignature, historyIdx?: number): string {
    return `${resourceId}::${JSON.stringify(signature)}${historyIdx !== undefined ? `::${historyIdx}` : ''}`;
}

export default derivePhysicalResourceId;