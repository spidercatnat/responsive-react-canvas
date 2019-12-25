A more comprehensive README is in progress :-)

# Quick start:

```
import React, { Component } from 'react';
import { Canvas } from "./components";

class HelloCanvas extends Component {
  draw({ canvas, ctx, width, height }) {
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.stroke();
  }
  render() {
    const { dimensions } = this.props;
    return (
      <Canvas
        onMount={this.draw}
        onResize={this.draw}
        refreshRate={10}
        dimensions={dimensions}
        style={{ margin: "0 auto" }}
      />
    )
  }
}

function App() {
  return <HelloCanvas dimensions={{ width: "100vw", height: "100vh" }} />;
}

export default App;
```

Any function passed to onMount or onResize is passed an object containing { canvas, ctx, width, height },
which should be enough for event handling and drawing operations.
