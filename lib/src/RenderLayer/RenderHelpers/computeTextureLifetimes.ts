import type { RenderPassSequence, TextureLifetimesMap } from "./types";

function updateLifetimes(lifetimes: TextureLifetimesMap, textureId: string, firstUseRenderPassIdx: number, firstUseDrawOpIdx: number, lastUseRenderPassIdx: number, lastUseDrawOpIdx: number) {
    // takes a range of usage, and updates the existing (if any) range in a union fashion
    if (!(textureId in lifetimes)) {
        lifetimes[textureId] = {
            firstUseRenderPassIdx,
            lastUseRenderPassIdx,
            firstUseDrawOpIdx,
            lastUseDrawOpIdx
        };
    } else {
        const existing = lifetimes[textureId];
        existing.firstUseDrawOpIdx = existing.firstUseRenderPassIdx === firstUseRenderPassIdx
            ? Math.min(existing.firstUseDrawOpIdx, firstUseDrawOpIdx)
            : firstUseDrawOpIdx;
        existing.lastUseDrawOpIdx = existing.lastUseRenderPassIdx === lastUseRenderPassIdx
            ? Math.max(existing.lastUseDrawOpIdx, lastUseDrawOpIdx)
            : lastUseDrawOpIdx;
        existing.firstUseRenderPassIdx = Math.min(existing.firstUseRenderPassIdx, firstUseRenderPassIdx);
        existing.lastUseRenderPassIdx = Math.max(existing.lastUseRenderPassIdx, lastUseRenderPassIdx);
    }
}

function computeTextureLifetimes(rps: RenderPassSequence) : TextureLifetimesMap {
    const transientTextures = rps.filter(([resId, res]) => res.signature.type === "texture").map(([resId, _]) => resId);
    const textureLifetimes: TextureLifetimesMap = {};

    for (let passIdx = 0; passIdx < rps.length; passIdx++) {
        const targetTextureId = rps[passIdx][0];
        if (transientTextures.includes(targetTextureId)) {
            updateLifetimes(textureLifetimes,targetTextureId, passIdx, 0, passIdx, rps[passIdx][1].drawOps.length - 1);
        };
        for (let drawOpIdx = 0; drawOpIdx < rps[passIdx][1].drawOps.length; drawOpIdx++) {
            const drawOp = rps[passIdx][1].drawOps[drawOpIdx];
            const textures = Object.values(drawOp.textures).map(t => {
                if (t.texture.stage !== "render") throw new Error("Only render stage draw ops are supported");
                return t.texture.resource;
            });
            for (const textureId of textures) {
                if (transientTextures.includes(textureId)) {
                    updateLifetimes(textureLifetimes,textureId, passIdx, drawOpIdx, passIdx, drawOpIdx);
                }
            }
        }
    }
    return textureLifetimes;
}

export default computeTextureLifetimes;

