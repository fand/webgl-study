export default class Surface {
    public buffer: any;
    public positionAttribute: any;

    public centerX: number;
    public centerY: number;
    public width: number;
    public height: number;
    public isPanning: boolean;
    public isZooming: boolean;
    public lastX: number;
    public lastY: number;

    constructor(private gl: any) {
        this.buffer = this.gl.createBuffer();

        this.centerX = 0;
        this.centerY = 0;
        this.width = 1;
        this.height = 1;
        this.isPanning = false;
        this.isZooming = false;
        this.lastX = 0;
        this.lastY = 0;
    }

    get bufferData(): Float32Array {
        const halfWidth = this.width * 0.5;
        const halfHeight = this.height * 0.5;
        return new Float32Array([
            this.centerX - halfWidth, this.centerY - halfHeight,
            this.centerX + halfWidth, this.centerY - halfHeight,
            this.centerX - halfWidth, this.centerY + halfHeight,
            this.centerX + halfWidth, this.centerY - halfHeight,
            this.centerX + halfWidth, this.centerY + halfHeight,
            this.centerX - halfWidth, this.centerY + halfHeight
        ]);
    }

    reset(aspectRatio: number): void {
        this.width = this.height * aspectRatio;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.bufferData, this.gl.STATIC_DRAW);
    }

    onCompile(program: WebGLProgram): void {
        this.positionAttribute = this.gl.getAttribLocation(program, 'surfacePosAttrib');
        this.gl.enableVertexAttribArray(this.positionAttribute);
    }
}
