import * as THREE from 'three';

export default class AudioLoader {
    static ctx: AudioContext = new ((<any> window).AudioContext || (<any> window).webkitAudioContext)();

    private ctx: AudioContext;
    private gain: GainNode;
    private analyser: AnalyserNode;
    private source: AudioBufferSourceNode;
    private spectrumArray: Uint8Array;
    private samplesArray: Uint8Array;
    private sound: any;

    spectrum: THREE.DataTexture;
    samples: THREE.DataTexture;
    isPlaying: boolean;

    constructor() {
        this.ctx = AudioLoader.ctx;
        this.gain = this.ctx.createGain();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.connect(this.gain);
        this.gain.connect(this.ctx.destination);

        this.analyser.fftSize = 512;
        this.spectrumArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.samplesArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.spectrum = new (<any> THREE.DataTexture)(
            this.spectrumArray,
            this.analyser.frequencyBinCount,
            1,
            THREE.LuminanceFormat,
            THREE.UnsignedByteType
        );
        this.samples = new (<any> THREE.DataTexture)(
            this.samplesArray,
            this.analyser.frequencyBinCount,
            1,
            THREE.LuminanceFormat,
            THREE.UnsignedByteType
        );

        this.isPlaying = false;
    }

    loadSound(url: string, isSilent?: boolean): Promise<any> {
        if (!url) { return; }
        if (isSilent) {
            this.gain.gain.value = 0;
        }

        return fetch(url)
            .then(res => res.arrayBuffer())
            .then(abuf => this.ctx.decodeAudioData(abuf))
            .then(data => {
                this.sound = data;
                this.play();
            });
    }

    play() {
        if (this.isPlaying || !this.sound) { return; }
        if (this.source) {
            this.source.stop();
            this.source.disconnect();
        }
        this.source = this.ctx.createBufferSource();
        this.source.buffer = this.sound;
        this.source.loop =  true;

        this.source.connect(this.analyser);
        this.source.start();

        this.isPlaying = true;
    }

    stop() {
        if (!this.isPlaying) { return; }
        this.source.stop();
        this.source.disconnect();
        this.source = null;
        this.isPlaying = false;
    }

    update() {
        this.analyser.getByteFrequencyData(this.spectrumArray);
        this.analyser.getByteTimeDomainData(this.samplesArray);
        this.spectrum.needsUpdate = true;
        this.samples.needsUpdate = true;
    }

    getVolume(): number {
        return this.spectrumArray.reduce((x, y) => x + y, 0) / this.spectrumArray.length;
    }
}
