import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import RAF from '../utils/raf'

import SpherePillards from './SpherePillardsClass'
import Floor from './FloorClass'
import Spectrum from './SpectrumClass'
import Particles from './Particles'
import CamParallax from './CamParallax'

class ThreeScene {
    constructor() {
        this.bind()

        this.camera
        this.scene
        this.renderer
        this.controls
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.debug.checkShaderErrors = true
        document.body.appendChild(this.renderer.domElement)

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 0, 7)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enabled = true
        this.controls.maxDistance = 1500
        this.controls.minDistance = 0
        // CamParallax.init(this.camera)

        let light = new THREE.AmbientLight()
        let pointLight = new THREE.PointLight()
        pointLight.position.set(10, 10, 0)
        this.scene.add(light, pointLight)

        SpherePillards.init(this.scene)
        Floor.init(this.scene)
        Spectrum.init(this.scene)
        Particles.init(this.scene)
        CamParallax.init(this.scene)

        window.addEventListener("resize", this.resizeCanvas)
        RAF.subscribe('threeSceneUpdate', this.update)
    }

    update() {
        this.renderer.render(this.scene, this.camera);
        SpherePillards.update()
        Spectrum.update()
        Particles.update()
        // CamParallax.update()
    }


    resizeCanvas() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
    }
}

const _instance = new ThreeScene()
export default _instance