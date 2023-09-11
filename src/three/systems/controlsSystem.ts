import { SceneManager } from '../sceneFactory'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const controlsSystem:ThreeSystem<SceneManager> = (sceneManager,_deltaTime)=>{
  sceneManager.controls.update()
}