import React, { Component } from "react";
import { Canvas } from "./components";

const TWO_PI = 2 * Math.PI;

class SineWave {
  constructor(
    frequency,
    amplitude,
    period = 2,
    xspacing = 1,
    { canvasWidth, canvasHeight, ctx },
    r = 0,
    g = 0,
    b = 0
  ) {
    this.initAmp = amplitude;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.ctx = ctx;
    this.xspacing = xspacing;
    this.amplitude = amplitude;
    this.period = period;
    this.w = canvasWidth + xspacing;
    this.dx = TWO_PI / (canvasWidth / period);
    this.yvalues = new Array(this.w);
    this.r = r;
    this.g = g;
    this.b = b;
    this.theta = 0;
    this.coords = [];
    this.increasing = true;
    this.decreasing = false;
  }

  calcWave = () => {
    const { yvalues, dx, canvasHeight } = this;

    if (this.amplitude >= this.initAmp * 5) {
      this.increasing = false;
      this.decreasing = true;
    }

    if (this.amplitude <= 0) {
      this.increasing = true;
      this.decreasing = false;
    }

    if (this.increasing) {
      this.amplitude = this.amplitude + 1;
    }

    if (this.decreasing) {
      this.amplitude = this.amplitude - 1;
    }

    // Increment theta (try different values for 'angular velocity' here
    this.theta += 0.01;
    let x = this.theta;

    for (let i = 0; i < yvalues.length; i++) {
      // scaled overtones
      this.yvalues[i] = Math.sin(this.amplitude * x) * this.amplitude;

      //scaled amplitudes
      // this.yvalues[i] = Math.sin(x) * this.amplitude;

      this.coords[i] = {
        x: i * this.xspacing,
        y: canvasHeight / 2 + this.yvalues[i],
      };
      x += dx;
    }
  };
}

class HelloCanvas extends Component {
  draw = ({ canvas, ctx, width, height }) => {
    this.stage = { canvas, ctx, width, height };
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 0.5;
    this.waves = [];
    for (let i = 0; i <= 13; i++) {
      if (this.waves[i]?.anim) cancelAnimationFrame(this.anim);
      this.waves.push(
        new SineWave(
          1,
          i, //amplitude
          i, // period
          i, // xspacing
          {
            canvasWidth: width,
            canvasHeight: height,
            ctx,
          },
          170 + i,
          200,
          200 + i
          // Math.round(Math.random() * 255),
          // Math.round(Math.random() * 255),
          // Math.round(Math.random() * 255)
        )
      );
    }

    this.renderWaves();
  };

  renderWaves = () => {
    const { ctx, width, height } = this.stage;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    this.waves.forEach((w) => {
      const { ctx, width, height } = this.stage;
      const { r, g, b, coords, calcWave } = w;
      calcWave();

      ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;

      ctx.beginPath();
      coords.forEach((point, index) => {
        ctx.moveTo(point.x, point.y);
        if (index < coords.length - 1) {
          ctx.lineTo(coords[index + 1].x, coords[index + 1].y);
        }
        // ctx.arc(point.x, point.y, 0.25, 0, TWO_PI);
      });
      ctx.stroke();
      ctx.closePath();
      ctx.closePath();
    });
    requestAnimationFrame(this.renderWaves);
  };

  render() {
    const { dimensions } = this.props;
    return (
      <Canvas
        onMount={this.draw}
        onResize={this.draw}
        refreshRate={0}
        dimensions={dimensions}
        style={{ margin: "0 auto" }}
      />
    );
  }
}

function App() {
  return <HelloCanvas dimensions={{ width: "100vw", height: "100vh" }} />;
}

export default App;
