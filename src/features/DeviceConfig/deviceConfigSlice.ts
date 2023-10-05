import {
  createSlice
} from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { IPinState } from '../../common/PinsConfig/PinsConfig'

//default state
const _initialState = {
  pinsConfig: {} as {[key:number]:IPinState}
}

//SLICE
//we are creating a slice factory here to be able to use mock states in stories
export const deviceConfigSliceFactory = (initialState:typeof _initialState)=>createSlice({
  name: 'deviceConfig',
  initialState,
  reducers: {
    setPinConfig: (state, action: {type:string, payload:{nr:number,config:IPinState}}) => {
      state.pinsConfig[action.payload.nr] = action.payload.config
    },
    setPinConfigAll: (state, action: {type:string, payload:{[key:number]:IPinState}}) => {
      state.pinsConfig = action.payload
    }
  }
})

const slice = deviceConfigSliceFactory(_initialState)

//SELECTORS
export const selectPinConfigAll = (state: RootState) => {
  return state.deviceConfig.pinsConfig
}

export const selectPinConfig = (state: RootState, nr:number) => {
  return state.deviceConfig.pinsConfig[nr]
}

export const selectPinConfigFiltered = (filter:number[]) => (state: RootState) => {
  return Object.fromEntries(Object.entries(state.deviceConfig.pinsConfig).filter(([k,v])=>k in filter))
}


export const {
  setPinConfig,
  setPinConfigAll
} = slice.actions

const deviceConfigReducer = slice.reducer
export default deviceConfigReducer
