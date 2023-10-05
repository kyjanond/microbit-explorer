import * as THREE from 'three'
import { SceneManager } from '../sceneFactory'
import { ACC_HELPER_NAME, AXES_HELPER_NAME, MAG_HELPER_NAME } from '../../app/constants'
import store from '../../app/store'
import { observeStore } from '../../app/utilities'

const accVec = new THREE.Vector3(0,0,0)
const magVec = new THREE.Vector3(0,0,0)
observeStore(
  store,
  (store)=>{return store.sensorData.accelerometer},
  (state)=>{
    accVec.set(state.x,state.y,state.z)
  }
)

observeStore(
  store,
  (store)=>{return store.sensorData.magnetometer},
  (state)=>{
    magVec.set(state.x,state.y,state.z)
  }
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const helperSystem:ThreeSystem<SceneManager> = (sceneManager,_deltaTime)=>{
  // update axesHelper
  const axesHelper = sceneManager.scene.getObjectByName(AXES_HELPER_NAME)
  if (axesHelper){
    sceneManager.camera.updateProjectionMatrix()
    const vh = sceneManager.renderer.domElement.height*0.5
    const vw = sceneManager.renderer.domElement.width*0.5
    const axesPosition = new THREE.Vector3(
      (-vw+50)/vw,
      (-vh+50)/vh,
      0
    )
    axesPosition.unproject(sceneManager.camera)
    axesHelper.position.copy(axesPosition)
  }
  const accHelper = sceneManager.scene.getObjectByName(ACC_HELPER_NAME) as THREE.Line
  if (accHelper) {
    const xVec = new THREE.Vector3(0,0,1)
    const angle = accVec.angleTo(xVec)
    const axis = new THREE.Vector3().crossVectors(xVec,accVec)
    axis.normalize()
    accHelper.setRotationFromAxisAngle(axis,angle)
  }

  const magHelper = sceneManager.scene.getObjectByName(MAG_HELPER_NAME) as THREE.Line
  if (magHelper) {
    const xVec = new THREE.Vector3(0,0,1)
    const angle = magVec.angleTo(xVec)
    const axis = new THREE.Vector3().crossVectors(xVec,magVec)
    axis.normalize()
    magHelper.setRotationFromAxisAngle(axis,angle)
  }
}