import { renderSystem } from './systems/renderSystem'
import { type SceneManager, sceneFactory } from './sceneFactory'
import { controlsSystem } from './systems/controlsSystem'

export const threeInit = async (containerElement: HTMLElement, window: Window) => {
  // create scene
  const sceneManager = await sceneFactory(containerElement)
  // register resized callback
  window.addEventListener( 'scene-dom-resized', ()=>onDOMResize(sceneManager), false )
  // append renderer
  containerElement.appendChild(
    sceneManager.renderer.domElement
  )
  // start clock and loop
  sceneManager.clock.start()
  gameLoop(sceneManager)
  console.debug('---Scene initialized---')
}

const gameLoop = (sceneManager:SceneManager) => {
  const deltaTime = sceneManager.clock.getDelta()
  requestAnimationFrame( ()=>gameLoop(sceneManager) )
  sceneManager.stats.begin()

  controlsSystem(sceneManager,deltaTime)
  renderSystem(sceneManager,deltaTime)

  sceneManager.stats.end()
  sceneManager.renderer.info.render.calls
  sceneManager.renderer.info.reset()
}

function onDOMResize(sceneManager:SceneManager) {
  sceneManager.camera.aspect = sceneManager.container.offsetWidth / sceneManager.container.offsetHeight
  sceneManager.camera.updateProjectionMatrix()
  sceneManager.renderer.setSize( sceneManager.container.offsetWidth, sceneManager.container.offsetHeight )
  sceneManager.scene.userData.offsetWidth = sceneManager.container.offsetWidth
  sceneManager.scene.userData.offsetHeight = sceneManager.container.offsetHeight
}