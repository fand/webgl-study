export default class Params {
    public startTime: number;
    public time: number;
    public mouseX: number;
    public mouseY: number;
    public screenWidth: number;
    public screenHeight: number;
    private lastX: number;
    private lastY: number;

    constructor () {
        this.startTime = Date.now();
        this.time = 0;
        this.mouseX = 0.5;
        this.mouseY = 0.5;
        this.screenWidth = 0;
        this.screenHeight = 0;

        this.lastX = null;
        this.lastY = null;
    }

    updateMouse(x: number, y: number): void {
        if (x === this.lastX && y === this.lastY) {
            return;
        }
        this.lastX = x;
        this.lastY = y;
        this.mouseX = x;
        this.mouseY = 1 - y;
    }

    get aspectRatio(): number  {
        return this.screenWidth / this.screenHeight;
    }

    get seconds(): number {
        return this.time / 1000;
    }

    resize(width: number, height: number): void {
        this.screenWidth = width;
        this.screenHeight = height;
    }

    tick(): void {
        this.time = Date.now() - this.startTime;
    }
}
