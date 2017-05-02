const quality = 2;
const quality_levels = [ 0.5, 1, 2, 4, 8 ];
const errorLines = [];

class Shader {
  constructor (canvas, code) {
    this.canvas = canvas;
    this.code = code;

    this.params = new Params();

    this.surface = {
      centerX: 0,
      centerY: 0,
      width: 1,
      height: 1,
      isPanning: false,
      isZooming: false,
      lastX: 0,
      lastY: 0,
    };

    // Initialise WebGL
    // let gl;
    try {
      this.gl = this.canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    } catch (e) {}

    if (!this.gl) {
      alert("WebGL not supported");
      return;
    }

    // enable dFdx, dFdy, fwidth
    this.gl.getExtension('OES_standard_derivatives');

    // Create vertex buffer (2 triangles)
    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0,
      1.0,  -1.0,
      -1.0,  1.0,
      1.0,  -1.0,
      1.0, 1.0,
      - 1.0, 1.0
    ]), this.gl.STATIC_DRAW);

    // Create surface buffer (coordinates at screen corners)
    this.surface.buffer = this.gl.createBuffer();

    const surfaceMouseDown = (e) => {
      if (e.shiftKey) {
        resetSurface();
      }
      this.surface.lastX = e.clientX;
      this.surface.lastY = e.clientY;
      e.preventDefault();
    };

    const noContextMenu = e => e.preventDefault();
    this.canvas.addEventListener('mousedown', surfaceMouseDown, false);
    this.canvas.addEventListener('contextmenu', noContextMenu, false);

    this.canvas.addEventListener('mousemove', (e) => {
      this.params.updateMouse(
        e.clientX / this.canvas.width,
        e.clientY / this.canvas.height
      )
    }, false);

    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize, false);

    this.compile();
    this.compileScreenProgram();

    this.animate();
  }

  computeSurfaceCorners () {
    this.surface.width = this.surface.height * this.params.aspectRatio;

    var halfWidth = this.surface.width * 0.5, halfHeight = this.surface.height * 0.5;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surface.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array( [
      this.surface.centerX - halfWidth, this.surface.centerY - halfHeight,
      this.surface.centerX + halfWidth, this.surface.centerY - halfHeight,
      this.surface.centerX - halfWidth, this.surface.centerY + halfHeight,
      this.surface.centerX + halfWidth, this.surface.centerY - halfHeight,
      this.surface.centerX + halfWidth, this.surface.centerY + halfHeight,
      this.surface.centerX - halfWidth, this.surface.centerY + halfHeight ] ), this.gl.STATIC_DRAW );
  }

  resetSurface () {
    this.surface.centerX = this.surface.centerY = 0;
    this.surface.height = 1;
    computeSurfaceCorners();
  }

  compile () {
    const program = this.gl.createProgram();
    const fragment = this.code;
    const vertex = document.getElementById('surfaceVertexShader').textContent;

    const vs = this.createShader(vertex, this.gl.VERTEX_SHADER);
    const fs = this.createShader(fragment, this.gl.FRAGMENT_SHADER);

    if (vs == null || fs == null) {
      return null;
    }

    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);

    this.gl.deleteShader(vs);
    this.gl.deleteShader(fs);

    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(program);
      const validateStatus = this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS);
      console.error(error);
      console.error(`VALIDATE_STATUS: ${validateStatus}`);
      return;
    }

    if (this.currentProgram) {
      this.gl.deleteProgram(this.currentProgram);
      setURL(fragment);
    }

    this.currentProgram = program;

    // Cache uniforms
    this.cacheUniformLocation(program, 'time');
    this.cacheUniformLocation(program, 'mouse');
    this.cacheUniformLocation(program, 'resolution');
    this.cacheUniformLocation(program, 'backbuffer');
    this.cacheUniformLocation(program, 'surfaceSize');

    // Load program into GPU
    this.gl.useProgram(this.currentProgram);

    // Set up buffers
    this.surface.positionAttribute = this.gl.getAttribLocation(this.currentProgram, "surfacePosAttrib");
    this.gl.enableVertexAttribArray(this.surface.positionAttribute);

    this.vertexPosition = this.gl.getAttribLocation(this.currentProgram, "position");
    this.gl.enableVertexAttribArray(this.vertexPosition);
  }

  compileScreenProgram() {
    const program = this.gl.createProgram();
    const fragment = document.getElementById('fragmentShader').textContent;
    const vertex = document.getElementById('vertexShader').textContent;

    const vs = this.createShader(vertex, this.gl.VERTEX_SHADER);
    const fs = this.createShader(fragment, this.gl.FRAGMENT_SHADER);

    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);

    this.gl.deleteShader(vs);
    this.gl.deleteShader(fs);

    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(program);
      const validateStatus = this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS);
      console.error(error);
      console.error(`VALIDATE_STATUS: ${validateStatus}`);
      return;
    }

    this.screenProgram = program;

    this.gl.useProgram(this.screenProgram);

    this.cacheUniformLocation(program, 'resolution');
    this.cacheUniformLocation(program, 'texture');

    this.screenVertexPosition = this.gl.getAttribLocation(this.screenProgram, "position");
    this.gl.enableVertexAttribArray(this.screenVertexPosition);
  }

  cacheUniformLocation(program, label) {
    if (program.uniformsCache === undefined) {
      program.uniformsCache = {};
    }
    program.uniformsCache[label] = this.gl.getUniformLocation(program, label);
  }

  createTarget (width, height) {
    var target = {};

    target.framebuffer = this.gl.createFramebuffer();
    target.renderbuffer = this.gl.createRenderbuffer();
    target.texture = this.gl.createTexture();

    // set up framebuffer
    this.gl.bindTexture(this.gl.TEXTURE_2D, target.texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target.framebuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, target.texture, 0);

    // set up renderbuffer
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, target.renderbuffer);

    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, target.renderbuffer);

    // clean up
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    return target;
  }

  createRenderTargets() {
    this.frontTarget = this.createTarget(this.params.screenWidth, this.params.screenHeight);
    this.backTarget = this.createTarget(this.params.screenWidth, this.params.screenHeight);
  }

  createShader (src, type) {
    var shader = this.gl.createShader(type);
    var line, lineNum, lineError, indexEnd;

    while (errorLines.length > 0) {
      line = errorLines.pop();
    }

    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {

      var error = this.gl.getShaderInfoLog(shader);

      // Remove trailing linefeed, for FireFox's benefit.
      while ((error.length > 1) && (error.charCodeAt(error.length - 1) < 32)) {
        error = error.substring(0, error.length - 1);
      }

      console.error(error);

      let index = 0;
      while (index >= 0) {
        index = error.indexOf("ERROR: 0:", index);
        if (index < 0) { break; }
        index += 9;
        indexEnd = error.indexOf(':', index);
        if (indexEnd > index) {
          lineNum = parseInt(error.substring(index, indexEnd));
          if ((!isNaN(lineNum)) && (lineNum > 0)) {
            index = indexEnd + 1;
            indexEnd = error.indexOf("ERROR: 0:", index);
            errorLines.push(line);
          }
        }
      }

      return null;
    }

    return shader;
  }

  onWindowResize (event) {
    // TODO: resize on fullscreen mode
    // this.canvas.width = window.innerWidth / quality;
    // this.canvas.height = window.innerHeight / quality;
    // this.canvas.style.width = window.innerWidth + 'px';
    // this.canvas.style.height = window.innerHeight + 'px';

    this.params.resize(this.canvas.width, this.canvas.height);

    this.computeSurfaceCorners();

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.createRenderTargets();
  }

  animate () {
    requestAnimationFrame(() => this.animate());
    this.render();
  }

  render () {
    if (!this.currentProgram) { return; }

    this.params.tick();

    // Set uniforms for custom shader
    this.gl.useProgram(this.currentProgram);

    this.gl.uniform1f(this.currentProgram.uniformsCache['time'], this.params.seconds);
    this.gl.uniform2f(this.currentProgram.uniformsCache['mouse'], this.params.mouseX, this.params.mouseY);
    this.gl.uniform2f(this.currentProgram.uniformsCache['resolution'], this.params.screenWidth, this.params.screenHeight);
    this.gl.uniform1i(this.currentProgram.uniformsCache['backbuffer'], 0);
    this.gl.uniform2f(this.currentProgram.uniformsCache['surfaceSize'], this.surface.width, this.surface.height);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surface.buffer);
    this.gl.vertexAttribPointer(this.surface.positionAttribute, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(this.vertexPosition, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.backTarget.texture);

    // Render custom shader to front buffer
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frontTarget.framebuffer);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    // Set uniforms for screen shader
    this.gl.useProgram(this.screenProgram);

    this.gl.uniform2f(this.screenProgram.uniformsCache['resolution'], this.params.screenWidth, this.params.screenHeight);
    this.gl.uniform1i(this.screenProgram.uniformsCache['texture'], 1);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(this.screenVertexPosition, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.frontTarget.texture);

    // Render front buffer to screen
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    // Swap buffers
    const tmp = this.frontTarget;
    this.frontTarget = this.backTarget;
    this.backTarget = tmp;
  }

  getImg (width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.params.resize(width, height);

    this.gl.viewport(0, 0, width, height);
    this.createRenderTargets();
    this.resetSurface();
    this.render();
    const img = this.canvas.toDataURL('image/png');
    this.onWindowResize();
    return img;
  }
}
