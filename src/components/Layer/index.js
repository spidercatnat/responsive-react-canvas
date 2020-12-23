
class Layer {
    neurons = [];

    addNeuron = (neuron) => {
        this.neurons.push(neuron);
    }

    draw = (ctx) => {
        this.neurons.forEach(neuron => neuron.draw(ctx))
    }
}

export { Layer }