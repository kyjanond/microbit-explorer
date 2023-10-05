/// <reference types="web-bluetooth" />

//@ts-ignore: : needs React
import React, { useEffect } from 'react'
import { threeInit } from '../three/threeMain'
import MicrobitBle from '../features/MicrobitBle/MicrobitBle'

function App() {
  useEffect(()=>{
    const container = document.getElementById('scene')
    if (container?.children.length === 0){
      threeInit(document.getElementById('scene') as HTMLElement,window)
    }
  },[])
  return (
    <>
      <MicrobitBle/>
      <div id="scene" className={'app__scene'}/>
    </>
  )
}

export default App
