import * as THREE from 'three';

const DEFAULT_VERTEX_SHADER = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export default class ThreeShader {
    private camera: THREE.Camera;
    private scene: THREE.Scene;
    private geometry: THREE.PlaneGeometry;
    public renderer: THREE.Renderer;
    private targets: THREE.WebGLRenderTarget[];
    private uniforms: any;
    private plane: THREE.Mesh;
    private start: number;
    public canvas: HTMLCanvasElement;
    private frame: number;
    private isPlaying: boolean;

    constructor(private ratio: number, private skip: number) {
        this.scene = new THREE.Scene();

        // Create camera
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(this.scene.position);

        // Create a target for backBuffer
        this.targets = [
            new THREE.WebGLRenderTarget(
                0, 0,
                { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat }
            ),
            new THREE.WebGLRenderTarget(
                0, 0,
                { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat }
            )
        ];

        // Prepare uniforms
        this.start = Date.now();
        this.uniforms = {
            time: { type: "f", value: 0.0 },
            mouse: { type: "v2", value: new THREE.Vector2() },
            resolution: { type: "v2", value: new THREE.Vector2() },
            backBuffer: { type: "t", value: new THREE.Texture() },
        };
    }

    public setCanvas(canvas: HTMLCanvasElement) {
        // if (this.renderer) {
        //     this.renderer.domElement = null;
        //     this.renderer = null;
        // }
        if (!canvas) { return; }

        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
        (<any>this.renderer).setPixelRatio(1 / this.ratio);
        this.resize();
        window.addEventListener('resize', this.resize);
        this.renderer.domElement.addEventListener('mousemove', this.mousemove);

        this.frame = 0;
        this.animate();
    }

    get aspect () {
        return this.renderer.domElement.width / this.renderer.domElement.height;
    }

    public loadShader(shader: string): void {
        if (this.plane) {
            this.scene.remove(this.plane);
        }

        // Create plane
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial(<any>{
            uniforms: this.uniforms,
            vertexShader: DEFAULT_VERTEX_SHADER,
            fragmentShader: shader,
            extensions: {
                derivatives: true,
                fragDepth: false,
                drawBuffers: false,
                shaderTextureLOD: false,
            },
        });
        this.plane = new THREE.Mesh(geometry, material);
        this.scene.add(this.plane);
    }

    mousemove = (e: MouseEvent) => {
        this.uniforms.mouse.value.x = e.offsetX - this.renderer.domElement.offsetLeft;
        this.uniforms.mouse.value.y = e.offsetY - this.renderer.domElement.offsetTop;
    }

    resize = () => {
        const [ width, height ] = [ this.canvas.clientWidth, this.canvas.clientHeight ];
        this.renderer.setSize(width, height);
        this.targets.forEach(t => t.setSize(width / this.ratio, height / this.ratio));
        this.uniforms.resolution.value.x = width / this.ratio;
        this.uniforms.resolution.value.y = height / this.ratio;
    }

    animate = () => {
        this.frame++;
        if (!this.isPlaying) { return; }
        requestAnimationFrame(this.animate);
        if (this.frame % this.skip === 0) {
            this.render();
        }
    }

    play() {
        this.isPlaying = true;
        this.animate();
    }

    stop() {
        this.isPlaying = false;
    }

    render() {
        this.uniforms.time.value = (Date.now() - this.start) / 1000;
        this.targets = [this.targets[1], this.targets[0]];
        this.uniforms.backBuffer.value = this.targets[0].texture;
        this.renderer.render(this.scene, this.camera);
        (<any>this.renderer).render(this.scene, this.camera, this.targets[1], true);
    }
}
