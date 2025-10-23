

function deriveSignatureId(signature: any): string {
    return JSON.stringify(signature);
}

export default deriveSignatureId;