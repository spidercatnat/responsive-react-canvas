import React, { Component } from "react";
import { Canvas, Layer, Neuron } from "../../components";
import { Slider } from "antd";
import { Scale } from "@tonaljs/tonal";

class Figure1 extends Component {
    state = {
        radix: 13,
        input: 3,
    }

    setupCanvas = (stage) => {
        this.stage = stage;
        const { ctx, width, height } = stage;
        ctx.clearRect(0, 0, width, height);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 0.35;
    }

    draw = (stage) => {
        const N_NEURONS = Array.from(Array(this.state.radix).keys()).map(k => k + 1);

        // Setup
        this.setupCanvas(stage);

        // Draw input layer
        this.drawInputLayer();

        // Draw module layer
        this.drawModuleLayer(N_NEURONS);

        // Draw ring layer
        this.drawRing(N_NEURONS);

        // Connect the layers
        this.connectLayers();
    };

    connectLayers = () => {
        const { stage: { ctx }, state: { radix } } = this;

        // Connect the input layer to the module layer
        for (const neuron of this.moduleLayer.neurons) {
            this.inputLayer.neurons[0].connect(ctx, neuron)
        }

        // Connect the module layer to the ring layer
        this.moduleLayer.neurons.forEach((n, i) => {
            const index = !((n.l * (this.inputLayer.neurons[0].l)) % radix) ? radix : (n.l * (this.inputLayer.neurons[0].l)) % radix
            n.connect(this.stage.ctx, this.ringLayer.neurons[(index) - 1])
        });

    }

    drawInputLayer = () => {
        const { stage: { ctx, width, height }, state: { input, radix } } = this;
        this.inputLayer = new Layer();
        this.inputLayer.addNeuron(new Neuron(35, height / 2, (height / (3 * radix)), input))
        this.inputLayer.draw(ctx);
    }

    drawModuleLayer = (N_NEURONS) => {
        const { stage: { ctx, width, height } } = this;
        this.moduleLayer = new Layer();

        N_NEURONS.forEach((l, index) => {
            const x = +(width / 2) + (height / (3 * N_NEURONS.length));
            const y = 10 + index * (height / N_NEURONS.length) + (height / (3 * N_NEURONS.length));
            const r = (height / (3 * N_NEURONS.length));
            const neuron = new Neuron(x, y, r, l);
            neuron.draw(ctx)
            this.moduleLayer.addNeuron(neuron);
        })
    }

    drawRing = (N_NEURONS) => {
        const { width, height, ctx } = this.stage;
        this.ringLayer = new Layer();
        const labels = Scale.rangeOf("C major")("C2", "C5");
        for (let i = 0; i < labels.length; i++) {
            const x = width - (height / (3 * N_NEURONS.length)) - 10;
            const y = 10 + i * (height / N_NEURONS.length) + (height / (3 * N_NEURONS.length));
            const r = (height / (3 * N_NEURONS.length));
            const neuron = new Neuron(x, y, r, labels[i % labels.length])
            neuron.draw(ctx)
            this.ringLayer.addNeuron(neuron);
        }
    }

    handleChangeInput = value => {
        this.setState({ input: value }, () => this.draw(this.stage))
    }

    handleChangeRadix = radix => {
        this.setState({ radix: radix, input: this.state.input % radix, ascii: `x in ZZ//${radix}Z` }, () => this.draw(this.stage))

    }

    render() {
        const { dimensions } = this.props;
        return (
            <div style={{ width: "50vw", height: "50vh", margin: "0 auto", marginTop: "3vh", position: "relative" }}>

                <div style={{ marginBottom: "5vh" }}>
                    <Canvas
                        onMount={this.draw}
                        onResize={this.draw}
                        refreshRate={0}
                        dimensions={dimensions}
                        style={{
                            margin: "0 auto",
                        }}
                    />
                    <h4>Radix</h4>
                    <Slider value={this.state.radix} min={5} max={19} onChange={this.handleChangeRadix} />
                    <h4>Input</h4>
                    <Slider value={this.state.input} min={1} max={this.state.radix} onChange={this.handleChangeInput} />
                </div>

                <p>
                    <h3>Figure 1 - Digital Network Computation Graph with 1 Input</h3>
                    The input `y` is defined as any integer `ZZ` where `{`y in {1 ... 13}`} `<br />
                </p>
                <p>
                    The second layer can be viewed as the multiplication table of the monoid `M = {`( (ZZ//${this.state.radix}ZZ), {1, @} )`}`, where `{`ZZ//${this.state.radix}ZZ`}` is the set of positive integers partitioned by the residue classes modulo {this.state.radix}, and the operator `@` refers to the abstract multiplication between `y` and elements of this monoid. <br />
                </p>
                <p>
                    Let `S subset ZZ//12ZZ` be a subring representing any collection of notes from the chromatic scale.
                </p>
                <p>
                    The third layer takes `M` to form an R-Module over `S` yielding output `hat y`.  <br />
                </p>
                <p>
                    Although the network produces compelling outputs worthy of more detailed analyses, it is not yet "learning," per se.
                    Rather, it is simply taking advantage of congruences between symbolic representations of standing wave interference patterns produced by different radices.
                </p>
            </div>
        );
    }
}

export { Figure1 }
