export default class Program {
    public cache: Object;
    public vertexPosition: number;

    constructor (
        private gl: WebGLRenderingContext,
        public program: WebGLProgram
    ) {
        this.cache = {};
        this.vertexPosition = this.gl.getAttribLocation(this.program, "position");
        this.gl.enableVertexAttribArray(this.vertexPosition);
    }

    get(label: string): any {
        return this.cache[label]
    }

    set(label: string): void {
        this.cache[label] = this.gl.getUniformLocation(this.program, label)
    }

    /**
     * Cache uniforms by name
     */
    setCaches(labels: string[]): void {
        labels.forEach(l => this.set(l));
    }
}
