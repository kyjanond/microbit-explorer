import { EventEmitter2 } from 'eventemitter2'
import * as THREE from 'three'

export class TextureAssetsLoader extends EventEmitter2{
  loader:THREE.TextureLoader
  isLoaded:boolean
  constructor(){
    super()
    this.loader = new THREE.TextureLoader()
    this.isLoaded = false
  }
  async loadTextures(urls:string[]){
    const promises = []

    for (const url of urls) {
      promises.push(this.loadTexture(url))
    }
    return Promise.all(promises)
  }

  async loadTexture(url:string){
    return this.loader.loadAsync(
      url,
      (xhr:ProgressEvent)=>onProgress(url,xhr)
    ).then(
      (texture:THREE.Texture)=>{
        this.onTextureLoaded(url,texture)
        return texture
      }
    ).catch(
      (error:ErrorEvent)=>{
        this.onError(url,error)
      }
    )
  }

  onTextureLoaded(url:string,texture:THREE.Texture){
    console.debug(`textureLoaded ${url}`)
    this.emit('textureLoaded',{url:url,texture:texture})
  }

  onError(_url:string,error:ErrorEvent){
    console.debug( 'An error happened' )
    console.error(error)
  }
}

function onProgress(
  loaderName:string,
  xhr:ProgressEvent)
{
  console.debug(`Loading texture ${loaderName}: ${Math.round((xhr.loaded/xhr.total)*100)}%`)
}

export const textureLoaderSingleton = new TextureAssetsLoader()