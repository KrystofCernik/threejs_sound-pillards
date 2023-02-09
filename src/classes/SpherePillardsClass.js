
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from "three"
import SoundReactor from './SoundReactor'
import MyGUI from '../utils/MyGui'

class SpherePillards {
    constructor() {
        this.bind()
        this.modelLoader = new GLTFLoader()
        this.textureLoader = new THREE.TextureLoader()
        this.params = {
            waveSpeed: 1,
            subDiv: 2,
            pillardSize: 0.2
        }
    }

    init(scene) {
        this.scene = scene
        this.upVec = new THREE.Vector3(0, 1, 0)
        this.pillards = new THREE.Group()
        this.pillard

        const gTex = this.textureLoader.load('./assets/textures/greyMetal.png')
        const bTex = this.textureLoader.load('./assets/textures/blackMetal.png')

        this.gMatCap = new THREE.MeshMatcapMaterial({
            matcap: gTex
        })
        this.bMatCap = new THREE.MeshMatcapMaterial({
            matcap: bTex
        })

        this.modelLoader.load('./assets/models/pillard.glb', (glb => {
            glb.scene.traverse(child => {
                if (child.name == 'base') {
                    this.pillard = child
                    child.material = this.bMatCap
                }
                if (child.name == 'Cylinder') {
                    child.material = this.gMatCap
                }
            })
            this.computePositions()
        }))
        
        const sphereFolder = MyGUI.addFolder('Sphere Pillards')
        sphereFolder.open()
        sphereFolder.add(this.params, 'waveSpeed', 0.001, 3).name('Wave Speed')
        sphereFolder.add(this.params, 'subDiv', 1, 5).step(1).name('Subdivisions').onChange(this.computePositions)
        sphereFolder.add(this.params, 'pillardSize', 0.01, 1).name('Pill Size').onChange(this.computePositions)
    }

    computePositions() {

        let ico
        this.scene.traverse(child => {
            if (child.name == 'ico') {
                ico = child
            }
        })

        if (ico) {
            this.scene.remove(ico)
        }

        const sphereGeom = new THREE.IcosahedronGeometry(2, this.params.subDiv)
        const sphereMat = this.gMatCap
        const sphere = new THREE.Mesh(sphereGeom, sphereMat)
        sphere.name = 'ico'
        // const sphere = new THREE.Mesh(sphereGeom, new THREE.MeshNormalMaterial({
        //     wireframe: true
        // }))
        this.scene.add(sphere)

        this.pillards.children = []

        let verArray = []

        for(let i = 0; i < sphereGeom.vertices.length; i++) {

            verArray.push({
                x: sphereGeom.vertices[i].x,
                y: sphereGeom.vertices[i].y,
                z: sphereGeom.vertices[i].z
            })
        }
        
        let pillPos = []
        for(let i = 0; i < verArray.length; i++) {
            let exists = false
            for (let j = 0; j < pillPos.length; j++) {
                if (pillPos[j].x == verArray[i].x && pillPos[j].y == verArray[i].y && pillPos[j].z == verArray[i].z) {
                    console.log('dfg')
                    exists = true
                }
            }

            if (!exists) {
                pillPos.push({
                    x: verArray[i].x,
                    y: verArray[i].y,
                    z: verArray[i].z
                })
                
                const c = this.pillard.clone()
                c.scale.multiplyScalar(this.params.pillardSize)
                const posVec = new THREE.Vector3(verArray[i].x, verArray[i].y, verArray[i].z)
                c.position.copy(posVec)
                c.quaternion.setFromUnitVectors(this.upVec, posVec.normalize())
                this.pillards.add(c)
            }
        }

        this.scene.add(this.pillards)
    }

    update() {
        if (SoundReactor.playing) {
            let i = 0
            while (i < this.pillards.children.length) {
                this.pillards.children[i].children[0].position.y = SoundReactor.fdata[i] / 255 * 2
                i++
            }
        } else {
            let i = 0
            while (i < this.pillards.children.length) {
                this.pillards.children[i].children[0].position.y = (Math.sin(Date.now() * 0.008 * this.params.waveSpeed + this.pillards.children[i].position.x) + 0.6)
                i++
            }
        }


    }


    resizeCanvas() {

    }

    bind() {
        this.computePositions = this.computePositions.bind(this)
    }
}

const _instance = new SpherePillards()
export default _instance