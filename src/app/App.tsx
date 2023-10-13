/// <reference types="web-bluetooth" />

//@ts-ignore: : needs React
import React from 'react'
import { threeInit } from '../three/threeMain'
import MicrobitBle from '../features/MicrobitBle/MicrobitBle'
import Footer from '../common/Footer/Footer'
import About from '../common/About/About'
import { AlertDialogProvider } from '../common/AlertDialog/AlertDialogContext'

function App() {
  React.useEffect(()=>{
    const container = document.getElementById('scene')
    if (container?.children.length === 0){
      threeInit(document.getElementById('scene') as HTMLElement,window)
    }
  },[])
  return (
    <>
      <AlertDialogProvider>
        <MicrobitBle/>
        <div id="scene" className={'app__scene'}/>
        <Footer visible={true}/>
        <About/>
      </AlertDialogProvider>
    </>
  )
}

export default App
