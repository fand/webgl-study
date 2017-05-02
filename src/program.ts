export default class Program {
    public cache: Object

    constructor (
        private gl: WebGLRenderingContext,
        public program: WebGLProgram
    ) {
        this.cache = {};
    }

    get (label) {
        return this.cache[label]
    }

    set (label) {
        this.cache[label] = this.gl.getUniformLocation(this.program, label)
    }
}
