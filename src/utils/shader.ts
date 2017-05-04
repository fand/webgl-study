import Params from './params';
import Surface from './surface';
import Program from './program';
import Target from './target';

declare function require(name: string);
const screenVertexShader = require('./screen.vert');
const screenFragmentShader = require('./screen.frag');
const surfaceVertexShader = require('./surface.vert');

const quality = 2;
const quality_levels = [ 0.5, 1, 2, 4, 8 ];
const errorLines = [];

export default class Shader {
    private gl: WebGLRenderingContext;
    private surface: Surface;
    private params: Params;
    private buffer: WebGLBuffer;
    private currentProgram: Program;
    private screenProgram: Program;
    private vertexPosition: number;
    private screenVertexPosition: number;
    private frontTarget: Target;
    private backTarget: Target;

    constructor (
        private canvas: HTMLCanvasElement,
        private code: string
    ) {

        // Initialise WebGL
        // let gl;
        try {
            this.gl = this.canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
        } catch (e) {}

        if (!this.gl) {
            alert("WebGL not supported");
            return;
        }

        this.params = new Params();
        this.surface = new Surface(this.gl);

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

        const surfaceMouseDown = (e) => {
            if (e.shiftKey) {
                this.surface.reset(this.params.aspectRatio);
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
                e.clientX / this.canvas.clientWidth,
                e.clientY / this.canvas.clientHeight
            )
        }, false);

        this.onWindowResize();
        window.addEventListener('resize', () => this.onWindowResize(), false);

        this.compile();
        this.compileScreenProgram();

        this.animate();
    }

    compileProgram(vertex: string, fragment: string): Program {
        const program = this.gl.createProgram();

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
        }

        // Load program into GPU
        this.gl.useProgram(program);

        return new Program(this.gl, program);
    }

    compile(): void {
        if (this.currentProgram) {
            this.gl.deleteProgram(this.currentProgram.program);
        }

        this.currentProgram = this.compileProgram(surfaceVertexShader, this.code);

        this.currentProgram.setCaches(['time', 'mouse', 'resolution', 'backbuffer', 'surfaceSize']);

        // Set up buffers
        this.surface.setPositionAttribute(this.gl.getAttribLocation(this.currentProgram.program, 'surfacePosAttrib'));
    }

    compileScreenProgram(): void {
        this.screenProgram = this.compileProgram(screenVertexShader, screenFragmentShader);
        this.screenProgram.setCaches(['resolution', 'texture']);
    }

    createRenderTargets(): void {
        this.frontTarget = new Target(this.gl, this.params.screenWidth, this.params.screenHeight);
        this.backTarget = new Target(this.gl, this.params.screenWidth, this.params.screenHeight);
    }

    createShader(src, type): WebGLShader {
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

    onWindowResize(): void {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        // TODO: resize on fullscreen mode
        // this.canvas.width = window.innerWidth / quality;
        // this.canvas.height = window.innerHeight / quality;
        // this.canvas.style.width = window.innerWidth + 'px';
        // this.canvas.style.height = window.innerHeight + 'px';

        this.params.resize(this.canvas.width, this.canvas.height);
        this.surface.reset(this.params.aspectRatio);

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.createRenderTargets();
    }

    animate(): void {
        requestAnimationFrame(() => this.animate());
        this.render();
    }

    render(): void {
        if (!this.currentProgram) { return; }

        this.params.tick();

        // Set uniforms for custom shader
        this.gl.useProgram(this.currentProgram.program);

        this.gl.uniform1f(this.currentProgram.get('time'), this.params.seconds);
        this.gl.uniform2f(this.currentProgram.get('mouse'), this.params.mouseX, this.params.mouseY);
        this.gl.uniform2f(this.currentProgram.get('resolution'), this.params.screenWidth, this.params.screenHeight);
        this.gl.uniform1i(this.currentProgram.get('backbuffer'), 0);
        this.gl.uniform2f(this.currentProgram.get('surfaceSize'), this.surface.width, this.surface.height);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surface.buffer);
        this.gl.vertexAttribPointer(this.surface.positionAttribute, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.vertexAttribPointer(this.currentProgram.vertexPosition, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.backTarget.texture);

        // Render custom shader to front buffer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frontTarget.framebuffer);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        // Set uniforms for screen shader
        this.gl.useProgram(this.screenProgram.program);

        this.gl.uniform2f(this.screenProgram.get('resolution'), this.params.screenWidth, this.params.screenHeight);
        this.gl.uniform1i(this.screenProgram.get('texture'), 1);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.vertexAttribPointer(this.screenProgram.vertexPosition, 2, this.gl.FLOAT, false, 0, 0);

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

    getImg(width: number, height: number): string {
        this.canvas.width = width;
        this.canvas.height = height;
        this.params.resize(width, height);

        this.gl.viewport(0, 0, width, height);
        this.createRenderTargets();
        this.surface.reset(this.params.aspectRatio);
        this.render();
        const img = this.canvas.toDataURL('image/png');
        this.onWindowResize();
        return img;
    }
}
