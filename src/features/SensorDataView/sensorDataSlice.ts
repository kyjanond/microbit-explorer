import {
  createSlice
} from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export interface ISimpleVector3 {
  x:number,
  y:number,
  z:number
}

//default state
const _initialState = {
  accelerometer: {
    x:0,
    y:0,
    z:-1
  } as ISimpleVector3,
  magnetometer: {
    x:1,
    y:0,
    z:0
  } as ISimpleVector3,
  temperature: 0,
  btnState: {
    A:0,
    B:0
  },
  pinValues: {} as {[key:number]:number}
}

//SLICE
//we are creating a slice factory here to be able to use mock states in stories
export const sensorDataSliceFactory = (initialState:typeof _initialState)=>createSlice({
  name: 'sensorData',
  initialState,
  reducers: {
    setAccelerometer: (state, action: {type:string, payload:typeof _initialState.accelerometer}) => {
      state.accelerometer.x = action.payload.x
      state.accelerometer.y = action.payload.y
      state.accelerometer.z = action.payload.z
    },
    setMagnetometer: (state, action: {type:string, payload:typeof _initialState.magnetometer}) => {
      state.magnetometer.x = action.payload.x
      state.magnetometer.y = action.payload.y
      state.magnetometer.z = action.payload.z
    },
    setTemperature: (state, action: {type:string, payload:typeof _initialState.temperature}) => {
      state.temperature = action.payload
    },
    setBtnAState: (state, action: {type:string, payload:number}) => {
      state.btnState.A = action.payload
    }, 
    setBtnBState: (state, action: {type:string, payload:number}) => {
      state.btnState.B = action.payload
    }, 
    setPinValues: (state, action: {type:string, payload:typeof _initialState.pinValues}) => {
      state.pinValues = {...state.pinValues,...action.payload}
    },
    setPinValuesAll: (state, action: {type:string, payload:typeof _initialState.pinValues}) => {
      state.pinValues = action.payload
    },
  }
})

const slice = sensorDataSliceFactory(_initialState)

//SELECTORS
export const selectAccelerometerData = (state: RootState) => {
  return state.sensorData.accelerometer
}

export const selectMagnetometerData = (state: RootState) => {
  return state.sensorData.magnetometer
}

export const selectTemperatureData = (state: RootState) => {
  return state.sensorData.temperature
}

export const selectBtnState = (state: RootState) => {
  return state.sensorData.btnState
}

export const selectPinValues = (state: RootState) => {
  return state.sensorData.pinValues
}


export const {
  setAccelerometer,
  setMagnetometer,
  setTemperature,
  setBtnAState,
  setBtnBState,
  setPinValues,
  setPinValuesAll
} = slice.actions

const sesnsorDataReducer = slice.reducer
export default sesnsorDataReducer
