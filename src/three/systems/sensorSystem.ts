import * as THREE from 'three'
import store from '../../app/store'
import { floatingAvgVector, observeStore } from '../../app/utilities'
import { SceneManager } from '../sceneFactory'
import { MICROBIT_MODEL_NAME } from '../../app/constants'
import { ISimpleVector3 } from '../../features/SensorDataView/sensorDataSlice'

const accDataArray = [] as ISimpleVector3[]
const magDataArray = [] as ISimpleVector3[]

const updateAccVectorAngleOri = (model:THREE.Object3D)=>{
  const avgAccData = floatingAvgVector(accData,accDataArray,15)
  const accVecLocal = new THREE.Vector3(avgAccData.x,avgAccData.y,avgAccData.z)
  //accVecLocal.normalize()
  const microbitZAxis = new THREE.Vector3(0,0,1)
  const rotationAngle = accVecLocal.angleTo(microbitZAxis)
  const rotAxis = new THREE.Vector3()
  rotAxis.crossVectors(accVecLocal,microbitZAxis)
  rotAxis.normalize()
  model.setRotationFromAxisAngle(rotAxis,rotationAngle)
}

const updateAccMagOri = (model:THREE.Object3D)=>{
  const avgAccData = floatingAvgVector(accData,accDataArray,15)
  const avgMagData = floatingAvgVector(magData,magDataArray,50)
  const accVecLocal = new THREE.Vector3(avgAccData.x,avgAccData.y,avgAccData.z)
  const magVecLocal = new THREE.Vector3(avgMagData.x,avgMagData.y,avgMagData.z)

  magVecLocal.projectOnPlane(accVecLocal)
  magVecLocal.normalize()

  const microbitZAxis = new THREE.Vector3(0,0,1)
  const microbitXAxis = new THREE.Vector3(1,0,0)

  const zAngle = accVecLocal.angleTo(microbitZAxis)
  const rotAxis = new THREE.Vector3().crossVectors(accVecLocal,microbitZAxis)
  rotAxis.normalize()
  model.setRotationFromAxisAngle(rotAxis,zAngle)
  model.updateMatrix()

  const xAngle = magVecLocal.angleTo(microbitXAxis)
  rotAxis.crossVectors(magVecLocal,microbitXAxis)
  rotAxis.normalize()
  model.setRotationFromAxisAngle(rotAxis,xAngle)
  model.updateMatrix()
}

interface SimpleVector3Data extends ISimpleVector3 {
  needsUpdate:boolean
}

const magData: SimpleVector3Data = {
  needsUpdate:false,
  x:0,
  y:0,
  z:1
}

const accData: SimpleVector3Data = {
  needsUpdate:false,
  x:0,
  y:0,
  z:1
}

observeStore(
  store,
  (store)=>{return store.sensorData.accelerometer},
  (state)=>{
    accData.needsUpdate = true
    accData.x = -state.x
    accData.y = state.y
    accData.z = -state.z
  }
)

observeStore(
  store,
  (store)=>{return store.sensorData.magnetometer},
  (state)=>{
    magData.needsUpdate = true
    magData.x = -state.x
    magData.y = state.y
    magData.z = -state.z
  }
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const sensorSystem:ThreeSystem<SceneManager> = (sceneManager,_deltaTime)=>{
  //update rotation
  const microbitModel = sceneManager.scene.getObjectByName(MICROBIT_MODEL_NAME)
  if (accData.needsUpdate && microbitModel){
    accData.needsUpdate = false
    updateAccVectorAngleOri(microbitModel)
  }
}