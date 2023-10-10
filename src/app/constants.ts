import model from '../assets/models/microbit_V2_simple2.glb'
import env from '../assets/textures//tonemapping/studio021.hdr'
// import env2 from './assets/textures/syferfontein_0d_clear_2k.hdr'

export const GEOMETRY_ASSETS = {
  model: model,
}

export const TEXTURE_ASSETS = {
  env: env,
}

export const MICROBIT_MODEL_NAME = 'Tinkercad_GLTF_Scene'

export const AXIS_HELPER_NAME = 'axesHelper'
export const GRID_HELPER_NAME = 'gridHelper'
export const ACC_HELPER_NAME = 'accHelper'
export const MAG_HELPER_NAME = 'magHelper'

export const PIN_FILTER = [0,1,2]