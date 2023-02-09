<template>
  <div class="audio-button">
    <button @click="play">{{ !init ? 'Play' : !playing ? 'Resume' : 'Pause' }}</button>
  </div>
</template>

<script>
import SoundReactor from '../classes/SoundReactor'

export default {
  name: "AudioButton",
  data() {
    return {
        playing: false,
        init: false
    }
  },
  methods: {
    play() {
        if (!this.init) {
            this.init = true
            SoundReactor.init()
            SoundReactor.play()
            this.playing = true
        } else {
            if (this.playing) {
                SoundReactor.pause()
                this.playing = false
            } else {
                SoundReactor.play()
                this.playing = true
            }
        }
    }
  }
}

</script>

<style scoped>

.audio-button {
    position: absolute;
    bottom: 0.8rem;
    right: 2rem;
}

.audio-button button {
    padding: 0.7rem 0rem;
    border: none;
    background-color: transparent;
    color: #FFFFFF;
    position: relative;
    cursor: pointer;
}

.audio-button button::before {
    content: '';
    position: absolute;
    bottom: 10px;
    left: 0;
    height: 1px;
    width: 0%;
    background-color: #FFFFFF;
    transition: 0.2s ease;    
}

.audio-button:hover button::before {
    width: 100%;
}

</style>
