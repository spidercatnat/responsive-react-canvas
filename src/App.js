import React, { Component } from "react";
import { Canvas } from "./components";
import { Slider } from "antd";
import 'antd/dist/antd.css';
import { Note, Scale } from "@tonaljs/tonal";

class Neuron {
  constructor(x, y, r, l) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.l = l;
  }

  draw = (ctx) => {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = `${this.r}px Helvetica`;
    ctx.fillText(this.l, this.x, this.y + 3)
    ctx.closePath()
  }

  connect = (ctx, neuron) => {
    if (!neuron) return;
    ctx.beginPath()
    ctx.moveTo(this.x + this.r, this.y);
    ctx.lineTo(neuron.x - neuron.r, neuron.y);
    ctx.stroke();
    ctx.closePath()

  }
}


class HelloCanvas extends Component {
  state = {
    radix: 13,
    input: 1
  }

  draw = ({ canvas, ctx, width, height }) => {
    // Setup
    this.stage = { canvas, ctx, width, height };
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 0.25;

    // Draw input layer
    this.inputLayer = this.drawInputLayer([this.state.input])

    // Draw module layer
    this.layerOne = this.drawModule(Array.from(Array(this.state.radix - 1).keys()).map(k => k + 1));

    // Draw ring layer
    this.outputLayer = this.drawRing(
      Scale.rangeOf("C major")("C2", "C5").slice(0, this.state.radix - 1)
    )

    // Connect the input layer to the module layer
    for (const n of this.layerOne) {
      this.inputLayer[0].connect(ctx, n)
    }

    // Connect the module layer to the ring layer
    this.layerOne.forEach((n, i) => {
      const index = !((n.l * (this.inputLayer[0].l)) % this.state.radix) ? this.state.radix : ((n.l * (this.inputLayer[0].l)) % this.state.radix);
      n.connect(ctx, this.outputLayer[(index) - 1])
    });

  };

  drawInputLayer = (input) => {
    const { width, height, ctx } = this.stage;
    const neurons = [];
    input.forEach((element, index) => {
      const neuron = new Neuron(25, height / (index + 2), (height / (3 * this.state.radix)), input); // Label is the last param
      neurons.push(neuron);
      neuron.draw(ctx)
    });
    return neurons;
  }

  drawModule = (nodes) => {
    const { width, height, ctx } = this.stage;
    const neurons = [];
    nodes.forEach((element, index) => {
      const neuron = new Neuron(
        (width / 2) + (height / (3 * nodes.length)),
        index * (height / nodes.length) + (height / (3 * nodes.length)),
        (height / (3 * nodes.length)),
        element)
      neurons.push(neuron)
      neuron.draw(ctx)
    })
    return neurons;
  }

  drawRing = (nodes) => {
    const { width, height, ctx } = this.stage;
    const neurons = [];
    for (let i = 0; i < this.state.radix; i++) {
      // const neuron = new Neuron(
      //   width - (height / (3 * nodes.length)),
      //   i * (height / nodes.length) + (height / (3 * nodes.length)),
      //   (height / (3 * nodes.length)),
      //   nodes[i])
      console.log(i * (height / nodes.length) + (height / (3 * nodes.length)))
      const neuron = new Neuron(
        width - (height / (3 * nodes.length)), //x
        i * (height / nodes.length) + (height / (3 * nodes.length)),//y
        (height / (3 * nodes.length)), //r
        nodes[i] // label
      )

      neurons.push(neuron)
      neuron.draw(ctx)
    }

    return neurons;
  }

  handleChangeInput = value => {
    this.setState({ input: value }, () => this.draw(this.stage))
  }

  handleChangeRadix = radix => {
    this.setState({ radix: +radix, input: this.state.input % radix, }, () => this.draw(this.stage))

  }

  render() {
    const { dimensions } = this.props;
    return (
      <div>
        <h3>Interference Network Graph</h3>
        <Canvas
          onMount={this.draw}
          onResize={this.draw}
          refreshRate={0}
          dimensions={dimensions}
          style={{
            margin: "0 auto"
          }}
        />
        <div style={{ width: "50vw", margin: "0 auto", marginTop: "3vh" }}>
          <h4>Radix</h4>
          <Slider value={this.state.radix} min={5} max={103} onChange={this.handleChangeRadix} />
          <h4>Input</h4>
          <Slider value={this.state.input} min={1} max={this.state.radix - 1} onChange={this.handleChangeInput} />
        </div>
      </div>
    );
  }
}

function App() {
  return <HelloCanvas dimensions={{ width: "80vw", height: "80vh" }} />;
}

export default App;
