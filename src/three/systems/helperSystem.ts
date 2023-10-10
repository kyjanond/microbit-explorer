import * as THREE from 'three'
import { SceneManager } from '../sceneFactory'
import { ACC_HELPER_NAME, AXIS_HELPER_NAME, MAG_HELPER_NAME, MB_AXIS_HELPER_NAME, MICROBIT_MODEL_NAME } from '../../app/constants'
import store from '../../app/store'
import { Vec3, floatingAvgVector, observeStore } from '../../app/utilities'

const magDataArray = [] as Vec3[]
const magData:Vec3 = {
  x: 0,
  y: 0,
  z: 0
}

const accDataArray = [] as Vec3[]
const accData:Vec3 = {
  x: 0,
  y: 0,
  z: 0
}

observeStore(
  store,
  (store)=>{return store.sensorData.accelerometer},
  (state)=>{
    accData.x = -state.x * 0.001
    accData.y = state.y * 0.001
    accData.z = -state.z * 0.001
  }
)

observeStore(
  store,
  (store)=>{return store.sensorData.magnetometer},
  (state)=>{
    magData.x = -state.x * 0.001
    magData.y = state.y * 0.001
    magData.z = -state.z * 0.001
  }
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const helperSystem:ThreeSystem<SceneManager> = (sceneManager,_deltaTime)=>{
  // update axisHelper
  const axisHelper = sceneManager.scene.getObjectByName(AXIS_HELPER_NAME)
  if (axisHelper){
    sceneManager.camera.updateProjectionMatrix()
    const vh = sceneManager.renderer.domElement.height*0.5
    const vw = sceneManager.renderer.domElement.width*0.5
    const axesPosition = new THREE.Vector3(
      (-vw+50)/vw,
      (-vh+50)/vh,
      0
    )
    axesPosition.unproject(sceneManager.camera)
    axisHelper.position.copy(axesPosition)
  }
  const microbitModel = sceneManager.scene.getObjectByName(MICROBIT_MODEL_NAME)
  const mbAxisHelper = sceneManager.scene.getObjectByName(MB_AXIS_HELPER_NAME)
  if (microbitModel !== undefined && mbAxisHelper !== undefined) {
    mbAxisHelper.rotation.copy(microbitModel.rotation)
  }

  const avgAccData = floatingAvgVector(accData,accDataArray,15)
  const accVec = new THREE.Vector3(avgAccData.x,avgAccData.y,avgAccData.z)
  const accHelper = sceneManager.scene.getObjectByName(ACC_HELPER_NAME) as THREE.ArrowHelper
  if (accHelper !== undefined) {
    const accHelperEndPos = microbitModel?.localToWorld(accVec.clone()) ?? accVec.clone()
    accHelperEndPos.normalize()
    accHelper.setDirection(accHelperEndPos)
  }

  const avgMagData = floatingAvgVector(magData,magDataArray,15)
  const magVec = new THREE.Vector3(avgMagData.x,avgMagData.y,avgMagData.z)
  const magHelper = sceneManager.scene.getObjectByName(MAG_HELPER_NAME) as THREE.ArrowHelper
  if (magHelper !== undefined) {
    const magHelperEndPos = microbitModel?.localToWorld(magVec.clone()) ?? magVec.clone()
    magHelperEndPos.normalize()
    magHelper.setDirection(magHelperEndPos)
  }
}