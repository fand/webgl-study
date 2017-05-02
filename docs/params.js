class Params {
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

  updateMouse (x, y) {
    if (x === this.lastX && y === this.lastY) {
      return;
    }
    this.lastX = x;
    this.lastY = y;
    this.mouseX = x;
    this.mouseY = 1 - y;
  }

  get aspectRatio () {
    return this.screenWidth / this.screenHeight;
  }

  get seconds () {
    return this.time / 1000;
  }

  resize (width, height) {
    this.screenWidth = width;
    this.screenHeight = height;
  }

  tick () {
    this.time = Date.now() - this.startTime;
  }
}
