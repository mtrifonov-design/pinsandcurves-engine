import type { VirtualResource } from "../../Types/VirtualResources";

function derivePhysicalResourceId(resourceId: string, signature: VirtualResource['signature'], historyIdx?: number): string {
    return `${resourceId}::${JSON.stringify(signature)}${historyIdx !== undefined ? `::${historyIdx}` : ''}`;
}

export default derivePhysicalResourceId;