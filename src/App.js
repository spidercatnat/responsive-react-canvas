import React, { Component } from 'react';
import { Canvas } from "./components";

const PHI = (1 + Math.sqrt(5)) / 2;

class HelloCanvas extends Component {
  draw = ({ canvas, ctx, width, height }) => {
    this.stage = { canvas, ctx, width, height };
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height)
    this.woosh(1, 1)
  }

  tattooIdea1 = () => {
    for (let i = 1; i <= 13; i++) {
      this.plotSine(i, i)
    }
  }

  woosh = (freq, ampl) => {
    const { canvas, ctx, width, height } = this.stage;
    this.plotSine(freq, ampl)
    this.anim = requestAnimationFrame(() => {
      if (freq <= 13) {
        this.woosh(freq + 1, (ampl + 10));
      } else {
        return cancelAnimationFrame(this.anim)
      }
    })
  }

  plotSine = (frequency = 12, amplitude = 25) => {
    const { ctx, width, height } = this.stage;
    const xspacing = 10;
    const w = width + 10;
    const period = width * 5;
    const dx = (2 * Math.PI / period) * xspacing;
    let yvalues = new Array(Math.round(w))
    let theta = 0;

    ctx.beginPath()
    
    // For every x value, calculate a y value with sine function
    for (let i = 0; i < yvalues.length; i++) {
      yvalues[i] = -Math.sin(theta * (frequency)) * amplitude;
      theta += dx;
    }

    for (let x = 0; x < yvalues.length; x++) {
      let y = height / 2 + yvalues[x]
      ctx.lineTo(x, y)
    }

    ctx.stroke()
    ctx.closePath()
  }
  render() {
    const { dimensions } = this.props;
    return (
      <Canvas
        onMount={this.draw}
        onResize={this.draw}
        refreshRate={0}
        dimensions={dimensions}
        style={{ margin: "0 auto", }}
      />
    )
  }
}

function App() {
  return <HelloCanvas dimensions={{ width: "100vw", height: "100vh" }} />;
}

export default App;
