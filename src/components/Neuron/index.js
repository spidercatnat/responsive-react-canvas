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

export { Neuron }