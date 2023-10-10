import * as THREE from 'three'

export const changeOpacity = (parent:THREE.Object3D, opacity:number)=>{
  parent.visible = true
  parent.traverse((x)=>{
    if ( x instanceof THREE.Mesh && x.material ) {
      //(child.material as THREE.MeshBasicMaterial).map
      x.material.transparent = true
      x.material.opacity = opacity
    }
  })
}