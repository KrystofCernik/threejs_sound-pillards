import RAF from '../utils/raf'

class SoundReactor {

    constructor(audioUrl) {
        this.ctx
        this.audio
        this.audioSource
        this.analyser
        this.fdata
        this.url = audioUrl
        this.playing = false

        this.bind()
    }

    init() {
        this.ctx = new AudioContext();
        this.audio = new Audio(this.url);
        this.audioSource = this.ctx.createMediaElementSource(this.audio);
        this.analyser = this.ctx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.8

        this.audioSource.connect(this.analyser);
        this.audioSource.connect(this.ctx.destination);
        this.fdata = new Uint8Array(this.analyser.frequencyBinCount);
        this.audio.currentTime = 44;

        this.audio.play()
    }

    play() {
        this.audio.play()
        this.playing = true
        RAF.subscribe('audioReactorUpdate', this.update)
    }

    pause() {
        this.audio.pause()
        this.playing = false
        RAF.unsubscribe('audioReactorUpdate')
    }

    update() {
        this.analyser.getByteFrequencyData(this.fdata);

    }

    bind() {
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
    }

}

const _instance = new SoundReactor('assets/song.mp3')
export default _instance;