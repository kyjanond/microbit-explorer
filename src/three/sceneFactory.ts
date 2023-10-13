import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { glbAssetLoaderSingleton } from './loaders/geometryLoader'
import { ACC_HELPER_COLOR, ACC_HELPER_NAME, AXIS_HELPER_NAME, GEOMETRY_ASSETS, GRID_HELPER_NAME, MAG_HELPER_COLOR, MAG_HELPER_NAME, MB_AXIS_HELPER_NAME, TEXTURE_ASSETS } from '../app/constants'
import { changeOpacity } from './threeUtils'

THREE.Object3D.DEFAULT_UP = new THREE.Vector3(0,0,1)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createHelpers = (scene:THREE.Scene) => {
  const defaultHelperEnd = new THREE.Vector3(0,0,50)
  const helperLength = 50

  // axis helper
  const axisHelper = new THREE.AxesHelper( 0.001 )
  axisHelper.name = AXIS_HELPER_NAME
  scene.add( axisHelper )

  // axis helper
  const mbAxisHelper = new THREE.AxesHelper( 30 )
  mbAxisHelper.name = MB_AXIS_HELPER_NAME
  scene.add( mbAxisHelper )

  //grid helper
  const gridHelper = new THREE.GridHelper( 
    100, 
    10,
    THREE.Color.NAMES.darkgrey,
    THREE.Color.NAMES.lightgrey
  )
  gridHelper.rotateX(Math.PI / 2)
  gridHelper.name = GRID_HELPER_NAME
  scene.add( gridHelper )
  
  //acc helper
  const accHelper = new THREE.ArrowHelper( 
    defaultHelperEnd.clone(), 
    new THREE.Vector3(), 
    helperLength, 
    ACC_HELPER_COLOR,
    helperLength*0.1,
    helperLength*0.04
  )
  accHelper.name = ACC_HELPER_NAME
  scene.add( accHelper )
  
  //mag helper
  const magHelper = new THREE.ArrowHelper( 
    defaultHelperEnd.clone(), 
    new THREE.Vector3(), 
    helperLength, 
    MAG_HELPER_COLOR,
    helperLength*0.1,
    helperLength*0.04
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
    // change opacity
    changeOpacity(model.scene,0.75)
    sceneManager.scene.add(model.scene)
    // add animations
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
  camera.position.x = 90
  camera.position.y = -90
  camera.position.z = 90
  camera.lookAt(new THREE.Vector3())
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