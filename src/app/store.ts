import {  applyMiddleware, configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import sesnsorDataReducer from '../features/SensorDataView/sensorDataSlice'
import deviceConfigReducer from '../features/DeviceConfig/deviceConfigSlice'
import deviceInfoReducer from '../features/DeviceInfo/deviceInfoSlice'

const isProduction = process.env.NODE_ENV === 'production'
const middlewares = []

if (!isProduction) {
  const logger = createLogger(
    {
      predicate: (_getState,action)=>{
        if (
          action.type === 'sensorData/setAccelerometer' || 
          action.type === 'sensorData/setMagnetometer' ||
          action.type === 'sensorData/setTemperature' ||
          action.type === 'sensorData/setPinValues'
        ) {
          return false
        }
        return true
      },
      collapsed:true, // takes a Boolean or optionally a Function that receives `getState` function for accessing current store state and `action` object as parameters. Returns `true` if the log group should be collapsed, `false` otherwise.
      duration: true, // print the duration of each action?
      timestamp: true, // print the timestamp with each action?
      level: 'debug' // console's level
    }
  )
  middlewares.push(logger)
}

const store = configureStore({
  reducer: {
    sensorData:sesnsorDataReducer,
    deviceConfig:deviceConfigReducer,
    deviceInfo:deviceInfoReducer
  },
  enhancers: [applyMiddleware(...middlewares)],
  devTools: !isProduction,
})

export type RootState = ReturnType<typeof store.getState>
export default store