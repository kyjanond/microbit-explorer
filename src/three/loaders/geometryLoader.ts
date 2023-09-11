import { EventEmitter2 } from 'eventemitter2'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

//load draco decoder

//require('../lib/draco/draco_wasm_wrapper.js')
//require("../lib/draco/draco_decoder.wasm");

export class GLBAssetLoader extends EventEmitter2{
  loader:GLTFLoader
  isLoaded:boolean
  constructor(){
    super()
    
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/lib/draco/')
    dracoLoader.setDecoderConfig({type: 'js'}) // (Optional) Override detection of WASM support.

    this.loader = new GLTFLoader()
    this.loader.setDRACOLoader(dracoLoader)
    this.isLoaded = false
  }
  
  async loadModels(urls:string[]){
    const promises = []

    for (const url of urls) {
      promises.push(this.loadModel(url))
    }
    return Promise.all(promises)
  }

  async parseFile(file:File){
    return file.arrayBuffer()
      .then((buf)=>{
        return new Promise((resolve,reject) => this.loader.parse(
          buf,
          '',
          (gltf:GLTF)=>{
            this.onModelLoaded(file.name,gltf)
            resolve(gltf)
          },
          (error:ErrorEvent)=>{
            this.onError(file.name,error)
            reject(error)
          }
        ))
      })
      .catch((error:ErrorEvent)=>{
        this.onError(file.name,error)
      }
      )
  }

  async loadModel(url:string){
    return this.loader.loadAsync(
      url,
      (xhr:ProgressEvent)=>onProgress(url,xhr)
    ).then((gltf:GLTF)=>{
      this.onModelLoaded(url,gltf)
      return gltf
    }
    ).catch((error:ErrorEvent)=>{
      this.onError(url,error)
    }
    )
  }

  onModelLoaded(url:string,gltf:GLTF){
    console.debug(`modelLoaded ${url}`)
    this.emit('modelLoaded',{url:url,model:gltf})
  }

  onError(url:string,error:ErrorEvent){
    console.debug( `An error happened with model: ${url}` )
    console.error(error)
  }
}

function onProgress(
  loaderName:string,
  xhr:ProgressEvent)
{
  console.debug(`Loading geometry ${loaderName}: ${Math.round((xhr.loaded/xhr.total)*100)}%`)
}

export const glbAssetLoaderSingleton = new GLBAssetLoader()