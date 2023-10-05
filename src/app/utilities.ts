import _ from 'lodash'
import store, { RootState } from './store'

export const observeStore = <T>(
  _store:(typeof store), 
  select: (state:RootState)=>T, 
  cb: (currentState:T)=>void
) => {
  let currentState:T

  function handleChange() {
    const nextState = select(store.getState())
    if (nextState !== currentState) {
      currentState = nextState
      cb(currentState)
    }
  }

  const unsubscribe = store.subscribe(handleChange)
  handleChange()
  return unsubscribe
}

export const interactionListener = () => {
  let lastId = Date.now()
  const callbacks = {} as {[key:string]:(time:number)=>void}
  const onInteraction = (cb:(time:number)=>void) => {
    lastId++
    callbacks[++lastId] = cb
    return
  }

  const handleInteraction = _.debounce(() => {
    for (const i in callbacks) {
      if (typeof callbacks[i] === 'function') {
        callbacks[i](Date.now())
      } else {
        delete callbacks[i]
      }
    }
  }, 500)
  document.body.addEventListener('mousemove', handleInteraction)
  document.body.addEventListener('scroll', handleInteraction)
  document.body.addEventListener('keydown', handleInteraction)
  document.body.addEventListener('click', handleInteraction)
  document.body.addEventListener('touchstart', handleInteraction)
  return onInteraction
}

export const dataViewToUint8Array = (value:DataView)=>{
  const byteArr = []
  for (let index = 0; index < (value?.byteLength || 0); index++) {
    byteArr.push(value?.getUint8(index))
  }
  return byteArr
}