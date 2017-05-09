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
    private renderer: THREE.Renderer;
    private uniforms: any;
    private plane: THREE.Mesh;
    private start: number;

    constructor(
        private container: HTMLElement,
        private fragmentShader: string
    ) {
        this.scene = new THREE.Scene();

        // Create camera
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.camera.position.set(0, 0, 1);
        this.camera.lookAt(this.scene.position);

        // Create Renderer
        this.renderer = new THREE.WebGLRenderer();
        // this.renderer.setPixelRatio(this.canvas.clientWidth / this.canvas.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        // Prepare uniforms
        this.start = Date.now();
        this.uniforms = {
            time: { type: "f", value: 0.0 },
            mouse: { type: "v2", value: new THREE.Vector2() },
            resolution: { type: "v2", value: new THREE.Vector2() },
        };

        // Create plane
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial( {
            uniforms: this.uniforms,
            vertexShader: DEFAULT_VERTEX_SHADER,
            fragmentShader: this.fragmentShader,
        } );
        this.plane = new THREE.Mesh(geometry, material);
        this.scene.add(this.plane);

        // Events
        this.resize();
        window.addEventListener('resize', this.resize);
        this.renderer.domElement.addEventListener('mousemove', this.mousemove);

        this.animate();
    }

    get aspect () {
        return this.renderer.domElement.width / this.renderer.domElement.height;
    }

    mousemove = (e: MouseEvent) => {
        this.uniforms.mouse.value.x = e.offsetX - this.renderer.domElement.offsetLeft;
        this.uniforms.mouse.value.y = e.offsetY - this.renderer.domElement.offsetTop;
    }

    resize = () => {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.uniforms.resolution.value.x = this.renderer.domElement.width;
        this.uniforms.resolution.value.y = this.renderer.domElement.height;
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.render();
    }

    render() {
        this.uniforms.time.value = (Date.now() - this.start) / 1000;
        this.renderer.render(this.scene, this.camera);
    }
}
