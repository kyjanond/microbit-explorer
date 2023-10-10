import * as THREE from 'three'
import { SceneManager } from '../sceneFactory'
import { ACC_HELPER_NAME, AXIS_HELPER_NAME, MAG_HELPER_NAME, MICROBIT_MODEL_NAME } from '../../app/constants'
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
  const zVec = new THREE.Vector3(0,0,1)

  const avgAccData = floatingAvgVector(accData,accDataArray,15)
  const accVec = new THREE.Vector3(avgAccData.x,avgAccData.y,avgAccData.z)
  const accVecLocal = microbitModel?.localToWorld(accVec.clone()) ?? accVec.clone()
  const accHelper = sceneManager.scene.getObjectByName(ACC_HELPER_NAME) as THREE.Line
  if (accHelper !== undefined) {
    const angle = accVecLocal.angleTo(zVec)
    const axis = new THREE.Vector3().crossVectors(zVec,accVecLocal)
    axis.normalize()
    accHelper.setRotationFromAxisAngle(axis,angle)
  }

  const accHelperEnd = sceneManager.scene.getObjectByName(ACC_HELPER_NAME + '_END') as THREE.Mesh
  if (accHelperEnd !== undefined) {
    const accHelperEndPos = microbitModel?.localToWorld(accVec.clone()) ?? accVec.clone()
    accHelperEndPos.normalize().multiplyScalar(50)
    accHelperEnd.position.copy(accHelperEndPos)
  }

  const avgMagData = floatingAvgVector(magData,magDataArray,15)
  const magVec = new THREE.Vector3(avgMagData.x,avgMagData.y,avgMagData.z)
  const magVecLocal = microbitModel?.localToWorld(magVec.clone()) ?? magVec.clone()
  const magHelper = sceneManager.scene.getObjectByName(MAG_HELPER_NAME) as THREE.Line
  if (magHelper !== undefined) {
    const angle = magVecLocal.angleTo(zVec)
    const axis = new THREE.Vector3().crossVectors(zVec,magVecLocal)
    axis.normalize()
    magHelper.setRotationFromAxisAngle(axis,angle)
  }

  const magHelperEnd = sceneManager.scene.getObjectByName(MAG_HELPER_NAME + '_END') as THREE.Mesh
  if (magHelperEnd !== undefined) {
    const magHelperEndPos = magVecLocal.clone()
    magHelperEndPos.normalize().multiplyScalar(50)
    magHelperEnd.position.copy(magHelperEndPos)
  }
}