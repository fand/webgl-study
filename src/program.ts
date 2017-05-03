export default class Program {
    public cache: Object;

    constructor (
        private gl: WebGLRenderingContext,
        public program: WebGLProgram
    ) {
        this.cache = {};
    }

    get(label: string): any {
        return this.cache[label]
    }

    set(label: string): void {
        this.cache[label] = this.gl.getUniformLocation(this.program, label)
    }
}
