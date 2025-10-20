Perfect — you’ve reached the point where the system’s architecture is conceptually complete, so let’s distill it into a design document in your tone and structure: concise, natural-language compression, clearly divided into the three layers, and readable enough that an engineer could deterministically rebuild it after some thought.

---

# NectarGL — A Distributed 2D Render Engine

NectarGL is a distributed 2D render engine. It models a network of siloed **actors** that collaborate to produce GPU-accelerated graphics.
An actor can be anything from a host compositor to a third-party visual-effect plugin running in a sandbox.
All communication happens through a **shared datastore**, where actors can read, write, and subscribe to changes.

NectarGL is organized into three independent but symbiotic layers:

1. **Network Layer** — defines how actors coordinate through a shared tree of nodes and immutable updates.
2. **Offer Layer** — defines how an individual actor describes a render workload as a pure function producing resources and blobs.
3. **Physical Layer** — executes the resulting workload efficiently, reusing GPU resources and minimizing state changes.

---

## 1. Network Layer

The network is a **tree of actor nodes** stored in a shared observable database.
Each node represents an actor’s contribution to the overall scene and carries a **payload** of asset references — typically blobs or graph snapshots.

### Core ideas

* **Tree structure.**
  There is a single designated **root node**: the actor responsible for drawing to the screen.
  Each actor may depend on one or more *child* nodes, forming a directed acyclic tree of dependencies.
  Cycles are disallowed by construction.

* **Stable pointers between actors.**
  Dependencies are created by embedding **external nodes** — pointers to other actors’ nodes.
  These pointers represent stable contracts: while the internal graph may change, the exposed interface (e.g., “output texture”) remains invariant.

* **Immutable updates.**
  Each actor can mutate only *its own node*.
  A mutation means **replacing the node’s payload** with a new immutable object (new hash).
  Every mutation produces new blob and graph IDs.
  Updates are atomic; observers never see partial state.

* **Garbage collection.**
  After each update, a centralized authority traverses the entire tree from the root,
  marking reachable graphs and blobs and deleting those no longer referenced.
  Actors never delete directly.

* **Synchronization logic.**

  * Actors assume their node exists until an attempted mutation fails (node deleted).
  * The root actor subscribes to all downstream node changes and re-materializes the final scene when notified.
  * Other actors need not care about their dependencies’ internal mutations — they only maintain pointers.

---

## 2. Offer Layer

The **Offer Layer** describes how an individual actor defines its contribution — how it *offers* graphics to the network.

An offer is expressed as a **pure function** returning a nested JSON-like tree.
Internal objects represent *scopes*; leaf entries represent **Pre-Resources**.

### Core ideas

* **Pure functional authoring.**
  Each actor writes a function `Render(props)` that returns an object tree of Pre-Resources.
  These Pre-Resources describe the desired GPU resources and operations — vertices, instances, uniforms, textures, and so on.
  They reference each other via lightweight handles.

* **Automatic identification.**
  When the render function runs, each Pre-Resource generates a **temporary random ID**.
  During the flattening step, the system resolves namespaces and derives **stable resource IDs**,
  rewriting all internal references accordingly.
  The result is a **flat resource array** with consistent, stable IDs — the serialized *graph*.

* **Minimal caching.**
  Graphs themselves are cheap: they contain references to blobs rather than heavy data.
  Input Pre-Resources (those that generate blobs) can specify a dependency array `[deps]`.
  When dependencies change, the blob is regenerated; otherwise it is reused.
  Flow nodes, shaders, and other small data are simply rebuilt on each call.

* **Update flow.**

  1. The actor executes its render function → produces a `(graph, blobs)` tuple.
  2. It uploads the blobs and graph to the datastore.
  3. It atomically updates its network node’s payload to reference these new IDs.

This design keeps the authoring model pure and declarative while preserving stable references downstream.

---

## 3. Physical Layer

The **Physical Layer** exists only at the **root node** — the actor that actually renders to a display or output texture.
Its responsibility is to interpret the incoming graphs and blobs, manage GPU resources, and produce final pixels.

### Core ideas

* **Input.**
  The renderer receives the accumulated `graph` and `blobs` from the datastore whenever the root node or any dependency changes.

* **Materialization.**

  1. Resolve all graph references into a single composite DAG.
  2. Allocate or reuse GPU buffers/textures according to the signatures described.
  3. Propagate data uploads for all input blobs.
  4. Execute draw calls in topological order.

* **Dirty propagation.**
  The engine maintains maps of dirty resources.
  Only nodes marked dirty (or whose dependencies are dirty) are re-executed.
  Once updated, dirty flags are cleared.

* **Execution semantics.**
  The entire graph is retained in memory.
  Rendering happens lazily — only when a consumer calls `materialize()`.
  If all resources are already prepared, materialization reduces to executing draw calls.
  Expensive operations (allocation, upload) are cached and reused until structural changes occur.

* **Output.**
  The physical layer exposes methods like:

  * `materialize(targetTextureId)` — render the scene into the target texture.
  * `captureTexture(textureId)` — read pixels.
  * `setInput(id, blob)` — update input data manually if desired.

---

## Summary

NectarGL integrates three conceptual layers into one distributed rendering framework:

| Layer              | Responsibility                                                              | Key Abstractions                            |
| ------------------ | --------------------------------------------------------------------------- | ------------------------------------------- |
| **Network Layer**  | Synchronization between independent actors through a shared observable tree | Nodes, Payloads, Blobs, Graphs, GC          |
| **Offer Layer**    | Authoring of GPU workloads as pure functions producing resource graphs      | Pre-Resources, Graph, Blob generation       |
| **Physical Layer** | Execution and materialization of those workloads on the GPU                 | Dirty tracking, Materialization, Draw calls |

Together, these layers define a system where:

* All data is **immutable and content-addressed**,
* Actors can **collaborate safely** without shared mutable state,
* The root actor **materializes** a consistent DAG of resources into real-time pixels.

---

Would you like me to add small illustrative diagrams (one per layer: network tree, offer flattening, and physical materialization)?
They’d help make the spec more self-contained while keeping it in your style.
