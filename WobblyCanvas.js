const HALF_PI = Math.PI / 2;

class Blob {
    constructor() {
        this.wobbleIncrement = 0;
        // use this to change the size of the blob
        this.radius = 1;
        // think of this as detail level
        // number of connections in the `bezierSkin`
        this.segments = 12;
        this.step = HALF_PI / this.segments;
        this.anchors = [];
        this.radii = [];
        this.thetaOff = [];

        this.wiggle()
    }

    wiggle() {
        const bumpRadius = 100;
        const halfBumpRadius = bumpRadius / 2;

        for (let i = 0; i < this.segments + 2; i++) {
            this.anchors.push(0, 0);
            this.radii.push(Math.random() * bumpRadius - halfBumpRadius);
            this.thetaOff.push(Math.random() * 2 * Math.PI);
        }

        this.theta = 0;
        this.thetaRamp = 0;
        this.thetaRampDest = 12;
        this.rampDamp = 25;
    }

    update() {
        this.thetaRamp += (this.thetaRampDest - this.thetaRamp) / this.rampDamp;
        this.theta += 0.03;

        this.anchors = [0, this.radius];
        for (let i = 0; i <= this.segments + 2; i++) {
            const sine = Math.sin(this.thetaOff[i] + this.theta + this.thetaRamp);
            const rad = this.radius + this.radii[i] * sine;
            const x = rad * Math.sin(this.step * i);
            const y = rad * Math.cos(this.step * i);
            this.anchors.push(x, y);
        }

        c.save();
        c.translate(-10, -10);
        c.scale(0.5, 0.5);
        c.fillStyle = this.fillColor;
        c.beginPath();
        c.moveTo(0, 0);
        bezierSkin(this.anchors, false);

        c.lineTo(0, 0);
        c.fill();
        c.restore();
    }

    open() {
        let start;

        blob.radius = 1
        blob.show()
        loop()

        function step(timestamp) {
            if (start === undefined)
                start = timestamp;

            blob.radius += 30

            if (blob.radius < 800) { // Stop the animation after blob radius is larger  than 800
                window.requestAnimationFrame(step);
            } else {
                blob.wiggle()
            }
        }

        window.requestAnimationFrame(step);
    }

    close() {
        let start;

        function step(timestamp) {
            if (start === undefined)
                start = timestamp;

            blob.radius -= 40

            if (blob.radius > 0) { // Stop the animation after blob radius is zero
                window.requestAnimationFrame(step);
            } else {
                blob.hide()
            }
        }

        window.requestAnimationFrame(step);
    }

    show() {
        canvas.style.display = 'block'
    }

    hide() {
        canvas.style.display = 'none'
    }
}


function loop() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    blob.update();
    if (blob.radius > 0) {
        window.requestAnimationFrame(loop);
    }
}

// array of xy coords, closed boolean
function bezierSkin(bez, closed = true) {
    const avg = calcAvgs(bez);
    const leng = bez.length;

    if (closed) {
        c.moveTo(avg[0], avg[1]);
        for (let i = 2; i < leng; i += 2) {
            let n = i + 1;
            c.quadraticCurveTo(bez[i], bez[n], avg[i], avg[n]);
        }
        c.quadraticCurveTo(bez[0], bez[1], avg[0], avg[1]);
    } else {
        c.moveTo(bez[0], bez[1]);
        c.lineTo(avg[0], avg[1]);
        for (let i = 2; i < leng - 2; i += 2) {
            let n = i + 1;
            c.quadraticCurveTo(bez[i], bez[n], avg[i], avg[n]);
        }
        c.lineTo(bez[leng - 2], bez[leng - 1]);
    }
}

// create anchor points by averaging the control points
function calcAvgs(p) {
    const avg = [];
    const leng = p.length;
    let prev;

    for (let i = 2; i < leng; i++) {
        prev = i - 2;
        avg.push((p[prev] + p[i]) / 2);
    }
    // close
    avg.push((p[0] + p[leng - 2]) / 2, (p[1] + p[leng - 1]) / 2);
    return avg;
}

const canvas = document.createElement("canvas")
const c = canvas.getContext("2d")
const blob = new Blob()

canvas.setAttribute("id", "wobbly-canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.style.position = 'absolute'
canvas.style.left = '0'
canvas.style.top = '0'
canvas.style.pointerEvents = 'none'

document.body.appendChild(canvas)


export default class WobblyCanvas {
    static open() {
        blob.open()
    }

    static close() {
        blob.close()
    }

    static wiggle() {
        blob.wiggle()
    }

    static color(color) {
        blob.fillColor = color
    }
}
