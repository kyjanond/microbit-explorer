import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { glbAssetLoaderSingleton } from './loaders/geometryLoader'
import { ACC_HELPER_NAME, AXES_HELPER_NAME, GEOMETRY_ASSETS, GRID_HELPER_NAME, MAG_HELPER_NAME, TEXTURE_ASSETS } from '../app/constants'

THREE.Object3D.DEFAULT_UP = new THREE.Vector3(0,0,1)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createHelpers = (scene:THREE.Scene) => {
  const axesHelper = new THREE.AxesHelper( 0.001 )
  axesHelper.name = AXES_HELPER_NAME
  scene.add( axesHelper )

  const gridHelper = new THREE.GridHelper( 
    100, 
    10,
    THREE.Color.NAMES.darkgrey,
    THREE.Color.NAMES.lightgrey
  )
  gridHelper.rotateX(Math.PI / 2)
  gridHelper.name = GRID_HELPER_NAME
  scene.add( gridHelper )
  
  const accHelperGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(),
    new THREE.Vector3(0,0,50)
  ])
  const accHelper = new THREE.Line( 
    accHelperGeometry, 
    new THREE.LineBasicMaterial({
      color: 0x0000ff
    })
  )
  accHelper.name = ACC_HELPER_NAME
  scene.add( accHelper )

  const magHelperGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(),
    new THREE.Vector3(0,0,50)
  ])
  const magHelper = new THREE.Line( 
    magHelperGeometry, 
    new THREE.LineBasicMaterial({
      color: 0xff0000
    })
  )
  magHelper.name = MAG_HELPER_NAME
  scene.add( magHelper )
}

export const loadAssets = async (sceneManager:SceneManager)=>{
  // setup scene
  // MODELS
  const animationClips = {} as {[key:string]:THREE.AnimationClip[]}
  const models = await Promise.all([
    glbAssetLoaderSingleton.loadModel(GEOMETRY_ASSETS.model),
  ]) as GLTF[]
  models.forEach(model=>{
    console.debug(`Adding model ${model.scene.name} ${model.scene.uuid}`)
    model.scene.visible = true
    sceneManager.scene.add(model.scene)
    if (model.animations.length !== 0){
      animationClips[model.scene.uuid] = model.animations
      // const clipAction = mixer.clipAction(animation)
      // clipAction.reset().play()
    }
  })
}

const sceneManagerFactory = (container: HTMLElement)=>{
  // Create basic instances
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
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 150
  // CONTROLS
  const controls = new OrbitControls(
    camera,
    renderer.domElement
  )
  controls.target = new THREE.Vector3(
    0,
    0,
    0
  )
  // DEBUG
  const stats:Stats = new Stats()
  createHelpers(scene)
  // ANIMATION MIXER
  const animationMixer = new THREE.AnimationMixer(scene)
  // TONE MAPPING
  const rgbeLoader = new RGBELoader()
    .setDataType( THREE.HalfFloatType )
  rgbeLoader.loadAsync(TEXTURE_ASSETS.env)
    .then(toneMappingTexture=>{
      toneMappingTexture.mapping = THREE.EquirectangularReflectionMapping
      scene.environment = toneMappingTexture 
      toneMappingTexture.dispose()
      scene.background = new THREE.Color('#e6e6e6')
      renderer.toneMapping = THREE.LinearToneMapping
      renderer.toneMappingExposure = 1.3
    })
  
  // LIGHTS
  const light = new THREE.AmbientLight( 0x404040,2 ) // soft white light
  scene.add( light )

  console.debug('Scene created and loaded')

  return {
    renderer: renderer,
    scene: scene,
    clock: clock,
    camera: camera, 
    container: container,
    controls: controls,
    mixer: animationMixer,
    animationClips: {} as {[key:string]:THREE.AnimationClip[]},
    stats: stats
  }
}
export type SceneManager = ReturnType<typeof sceneManagerFactory>
export default sceneManagerFactory