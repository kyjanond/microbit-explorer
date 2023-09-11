import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { glbAssetLoaderSingleton } from './loaders/geometryLoader'
import { GEOMETRY_ASSETS, TEXTURE_ASSETS } from '../app/constants'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createHelpers = (scene:THREE.Scene) => {
  const axesHelper = new THREE.AxesHelper( 0.25 )
  scene.add( axesHelper )
  const gridHelper = new THREE.GridHelper( 10, 40 )
  scene.add( gridHelper )
}

const sceneManagerFactory = (container: HTMLElement)=>{
  // SCENE
  const scene = new THREE.Scene()
  scene.userData.offsetWidth = container.offsetWidth
  scene.userData.offsetHeight = container.offsetHeight
  // RENDERER
  const renderer = new THREE.WebGLRenderer({
    antialias:true,
    preserveDrawingBuffer: false
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor('#e6e6e6', 1)
  container.appendChild(
    renderer.domElement
  )
  // CLOCK
  const clock = new THREE.Clock()
  // CAMERA
  const camera = new THREE.PerspectiveCamera( 
    50, 
    window.innerWidth / window.innerHeight, 
    0.01, 
    1000 
  )
  // CONTROLS
  const controls = new OrbitControls(
    camera,
    renderer.domElement
  )
  // DEBUG
  const stats:Stats = new Stats()
  // ANIMATION MIXER
  const animationMixer = new THREE.AnimationMixer(scene)
  return {
    renderer: renderer,
    scene: scene,
    clock: clock,
    camera: camera, 
    container: container,
    controls: controls,
    mixer: animationMixer,
    animatioClips: {} as {[key:string]:THREE.AnimationClip[]},
    stats: stats
  }
}
export type SceneManager = ReturnType<typeof sceneManagerFactory>

export const sceneFactory = async (container: HTMLElement)=>{
  // SCENE MANAGER
  const sceneManager = sceneManagerFactory(container)

  // MODELS
  const models = await Promise.all([
    glbAssetLoaderSingleton.loadModel(GEOMETRY_ASSETS.model),
  ]) as GLTF[]
  models.forEach(model=>{
    console.debug(`Adding model ${model.scene.name} ${model.scene.uuid}`)
    sceneManager.scene.add(model.scene)
    if (model.animations.length !== 0){
      sceneManager.animatioClips[model.scene.uuid] = model.animations
      // const clipAction = sceneManager.mixer.clipAction(animation)
      // clipAction.reset().play()
    }
  })

  //SET CAMERA
  sceneManager.camera.position.x = 31
  sceneManager.camera.position.y = 21.42
  sceneManager.camera.position.z = 100
  sceneManager.controls.target = new THREE.Vector3(
    31,
    21.42,
    -1
  )

  // TONE MAPPING
  const rgbeLoader = new RGBELoader()
    .setDataType( THREE.HalfFloatType )
  const texture = await Promise.all( [
    rgbeLoader.loadAsync(TEXTURE_ASSETS.env),
  ])
  texture[0].mapping = THREE.EquirectangularReflectionMapping
  sceneManager.scene.environment = texture[0] 
  texture[0].dispose()
  sceneManager.scene.background = new THREE.Color('#e6e6e6')
  sceneManager.renderer.toneMapping = THREE.LinearToneMapping
  sceneManager.renderer.toneMappingExposure = 1.3

  // LIGHTS
  const light = new THREE.AmbientLight( 0x404040,9 ) // soft white light
  sceneManager.scene.add( light )

  // APP SETUP
  console.debug('Scene created and loaded')
  return sceneManager
}