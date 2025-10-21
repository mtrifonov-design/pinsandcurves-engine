# Render Layer

The main export of the Render Layer is the 'Drawing' class.
It takes a 'Blueprint' and can materialize it into pixels.
It is stateful: It retains Resources on the GPU and attempts to reuse them