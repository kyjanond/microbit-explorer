import {
  createSlice
} from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

//default state
const _initialState = {
  id: '',
  name: '',
  modelNr: '',
  fwRev: '',
}

//SLICE
//we are creating a slice factory here to be able to use mock states in stories
export const deviceInfoSliceFactory = (initialState:typeof _initialState)=>createSlice({
  name: 'deviceInfo',
  initialState,
  reducers: {
    setDeviceId: (state, action: {type:string, payload:string}) => {
      state.id = action.payload
    },
    setDeviceName: (state, action: {type:string, payload:string}) => {
      state.name = action.payload
    },
    setModelNr: (state, action: {type:string, payload:string}) => {
      state.modelNr = action.payload
    },
    setFwRev: (state, action: {type:string, payload:string}) => {
      state.fwRev = action.payload
    },
  }
})

const slice = deviceInfoSliceFactory(_initialState)

//SELECTORS
export const selectDeviceInfo = (state: RootState) => {
  return state.deviceInfo
}


export const {
  setDeviceName,
  setDeviceId,
  setModelNr,
  setFwRev,
} = slice.actions

const deviceInfoReducer = slice.reducer
export default deviceInfoReducer
