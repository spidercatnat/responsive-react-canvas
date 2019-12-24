import React, { Component } from 'react';
import { Canvas } from "./components";

class HelloCanvas extends Component {
  draw(stage) {
    const { ctx, width, height } = stage;
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.stroke();
  }
  render() {
    const { width, height, style } = this.props;
    console.log(style)
    return (
      <Canvas
        onMount={this.draw}
        onResize={this.draw}
        refreshRate={10}
        dimensions={{ width, height }}
        style={{ width, height, margin: "0 auto" }}
      />
    )
  }
}

function App() {
  return <HelloCanvas width="100vw" height="100vh" />;
}

export default App;
