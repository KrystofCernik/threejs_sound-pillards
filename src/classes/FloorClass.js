
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from "three"

class Floor {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader()
    }

    init(scene) {
        this.scene = scene
        this.floor

        this.modelLoader.load('./assets/models/floor.glb', (glb => {
            glb.scene.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    this.floor = child
                }
            })
            this.floor.translateY(-3)
            this.scene.add(this.floor)
        }))
    }

    update() {

    }


    resizeCanvas() {

    }

    bind() {

    }
}

const _instance = new Floor()
export default _instance