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
export const MB_AXIS_HELPER_NAME = 'mbAxesHelper'
export const GRID_HELPER_NAME = 'gridHelper'
export const ACC_HELPER_NAME = 'accHelper'
export const MAG_HELPER_NAME = 'magHelper'

export const MAG_HELPER_COLOR = '#00ffd0'
export const ACC_HELPER_COLOR = '#ff00ff'

export const PIN_FILTER = [0,1,2]