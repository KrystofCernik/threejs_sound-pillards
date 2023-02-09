
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from "three"
import MyGUI from '../utils/MyGui'

import spectrumFrag from '../shaders/spectrum.frag'
import spectrumVert from '../shaders/spectrum.vert'

class Spectrum {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader()
        this.textureLoader = new THREE.TextureLoader()
    }

    init(scene) {
        this.scene = scene

        this.uniforms = {
            uMatCap: {
                value: this.textureLoader.load('assets/textures/blackMetal.png')
            },
            uSpecterSize: {
                value: 1
            },
            uTime: {
                value: 0.8
            },
            uWaveBorder: {
                value: 0.4
            },
            uWaveSpeed: {
                value: 0.04
            },
            uBorderColor: {
                value: new THREE.Color("hsl(287, 80%, 80%)")
            }
        }

        const shaderFolder = MyGUI.addFolder('Spectrum')
        shaderFolder.open()
        shaderFolder.add(this.uniforms.uSpecterSize, 'value', -1, 1).name('Spectrum Size')
        shaderFolder.add(this.uniforms.uWaveBorder, 'value', 0, 1).name('Border Size')
        shaderFolder.add(this.uniforms.uWaveSpeed, 'value', 0, 0.2).name('Wave Speed')

        this.shaderMat = new THREE.ShaderMaterial({
            fragmentShader: spectrumFrag,
            vertexShader: spectrumVert,
            uniforms: this.uniforms,
            transparent: true
        })
        this.spectrum

        this.modelLoader.load('./assets/models/spectrum.glb', (glb => {
            glb.scene.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    child.material = this.shaderMat
                    child.scale.multiplyScalar(1.5)
                    child.position.y = -3
                }
            })
            this.scene.add(glb.scene)
        }))
    }

    update() {
        this.uniforms.uTime.value += 1
    }


    resizeCanvas() {

    }

    bind() {

    }
}

const _instance = new Spectrum()
export default _instance