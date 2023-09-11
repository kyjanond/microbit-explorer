/// <reference types="web-bluetooth" />

//@ts-ignore: : needs React
import React, { useEffect } from 'react'
import { threeInit } from '../three/threeMain'

function App() {
  useEffect(()=>{
    const container = document.getElementById('scene')
    if (container?.children.length === 0){
      threeInit(document.getElementById('scene') as HTMLElement,window)
    }
  },[])
  return (
    <>
      <div id="scene" className={'app__scene'}/>
    </>
  )
}

export default App
