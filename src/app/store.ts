import {  applyMiddleware, configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'

const isProduction = process.env.NODE_ENV === 'production'
const middlewares = []

if (!isProduction) {
  const logger = createLogger(
    {
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
  },
  enhancers: [applyMiddleware(...middlewares)],
  devTools: !isProduction,
})

export type RootState = ReturnType<typeof store.getState>
export default store