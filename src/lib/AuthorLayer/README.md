# Author Layer

The main export of this layer is the 'Blueprint' class.
It's primary responsibility is to evolve a 'VirtualResource' graph in the 'author' stage to the 'render' stage.
At the 'author' stage, such a graph is not serializable but cheap: instead of finished blobs, it exposes handles to blob-producing functions.
At the 'render' stage, all blobs must have been generated and the graph must be ready to be submitted for drawing.
The Blueprint class possesses memory and keeps track of dependency arrays for individual resources.
It can therefore intelligently regenerate only blobs that have changed between updates.