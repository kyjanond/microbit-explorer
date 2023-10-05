import { SceneManager } from '../sceneFactory'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const renderSystem:ThreeSystem<SceneManager> = (sceneManager,_deltaTime)=>{
  //update size
  if (sceneManager.container.offsetWidth !== sceneManager.scene.userData[0] || 
    sceneManager.container.offsetHeight !== sceneManager.scene.userData[1])
  {
    window.dispatchEvent(new Event('scene-dom-resized'))
  }
  //render
  sceneManager.renderer.render(sceneManager.scene,sceneManager.camera)
}