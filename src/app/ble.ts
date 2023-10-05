import { Mutex } from 'async-mutex'
import { dataViewToUint8Array } from './utilities'

const options:RequestDeviceOptions = {
  filters: [
    { namePrefix: 'BBC' },
  ],
  optionalServices: [],
}

export enum CharProps {
  None = 0,
  Read = 1 << 0,
  Write = 1 << 2,
  Notify = 1 << 3,
  All = ~(~0 << 4)
}

type NotifyCb = (event:Event)=>void
type ReadCb = (uuid:string, data:DataView)=>void

export interface IMicrobitCharacteristic {
  name:string,
  readonly uuid:string,
  readonly props: CharProps,
  notifyCb?:NotifyCb
  readCb?:ReadCb
}

export interface IMicrobitService<T extends string> {
  name:string,
  readonly uuid:string,
  readonly characteristics:Record<T,IMicrobitCharacteristic>
}

const connectedGATTServer = {
  server:null as BluetoothRemoteGATTServer | null
}

const mutex = new Mutex()

export const isConnected = ()=>{
  return (connectedGATTServer.server && connectedGATTServer.server.connected) === true
}

export const readCharacteristic = (
  serviceUuid:string,
  characteristicUuid:string
)=>mutex.runExclusive(()=>{
  if (connectedGATTServer.server === null){
    throw new Error('Not connected to any device')
  } else if (!connectedGATTServer.server.connected) {
    throw new Error(`Not connected to device ${connectedGATTServer.server.device.id}`)
  }
  return connectedGATTServer.server.getPrimaryService(serviceUuid)
    .then(service=>{
      return service.getCharacteristic(characteristicUuid)
    })
    .then(characteristic=>{
      return characteristic.readValue()
    })
    .then(value=>{
      const byteArr = dataViewToUint8Array(value)
      console.debug(`value read ${byteArr}`)
      return value
    })
    .catch(error=>{
      throw error
    })
})


export const writeCharacteristic = (
  serviceUuid:string,
  characteristicUuid:string,
  value:ArrayBuffer
)=>mutex.runExclusive(()=>{
  if (connectedGATTServer.server === null){
    throw new Error('Not connected to any device')
  } else if (!connectedGATTServer.server.connected) {
    throw new Error(`Not connected to device ${connectedGATTServer.server.device.id}`)
  }
  return connectedGATTServer.server.getPrimaryService(serviceUuid)
    .then(service=>{
      return service.getCharacteristic(characteristicUuid)
    })
    .then(characteristic=>{
      return characteristic.writeValue(value)
    })
    .then(()=>{
      const byteArr = dataViewToUint8Array(new DataView(value))
      console.debug(`value written ${byteArr}`)
    })
    .catch(error=>{
      throw error
    })
})

export const connectDevice = (
  subscribers:IMicrobitService<string>[], 
  disconnectedCb:(event:Event)=>void,
  connectedCb:(id:string, name:string)=>void
)=>mutex.runExclusive(()=>{
  disconnectDevice()
  subscribers.forEach(x=>{
    options.optionalServices?.push(x.uuid)
  })
  navigator.bluetooth
    .requestDevice(options)
    .then(async (device:BluetoothDevice) => {
      if (connectedGATTServer !== null){
        disconnectDevice()
        await new Promise(r => setTimeout(r, 2000))
      }
      device.addEventListener('gattserverdisconnected', disconnectedCb)
      if (!device.gatt){
        throw new Error('Gatt not defined')
      }
      if (device.gatt.connected){
        console.error('still connected')
      }
      return device.gatt.connect()
    // Do something with the device.
    })
    .then((server:BluetoothRemoteGATTServer) => {
      connectedGATTServer.server = server
      const promises = subscribers.map(x=>server.getPrimaryService(x.uuid))
      return Promise.all(promises)
    })
    .then((services:BluetoothRemoteGATTService[]) => {
      const promises:Promise<BluetoothRemoteGATTCharacteristic>[] = []
      services.forEach(service=>{
        const sub = subscribers.find(x=>x.uuid===service.uuid)
        if (sub){
          promises.push(...Object.values(sub.characteristics).map(x=>service.getCharacteristic(x.uuid)))
        }
      })
      return Promise.all(promises)
    })
    .then((characteristics) => {
      characteristics.forEach(c=>{
        const srvSub = subscribers.find(x=>x.uuid === c.service.uuid)
        const charSub = Object.values(srvSub?.characteristics ?? []).find(x=>x.uuid===c.uuid)
        if (!charSub){
          return
        }
        // start notification
        if ((charSub.props & CharProps.Notify) === CharProps.Notify && charSub.notifyCb){
          c.addEventListener(
            'characteristicvaluechanged',
            charSub.notifyCb
          )
          c.startNotifications().catch(err=>console.error(charSub.name,err))
          console.debug(`${srvSub?.name}.${charSub.name} subscribed`)
        } 
        if((charSub.props & CharProps.Read) === CharProps.Read && charSub.readCb){
          c.readValue().then(value=>charSub.readCb!(c.uuid, value))
        }
      })
      connectedCb(
        connectedGATTServer.server?.device.id ?? '',
        connectedGATTServer.server?.device.name ?? ''
      )
    })
}).catch((error) => {
  disconnectDevice()
  console.error(error)
})

export const disconnectDevice = ()=>mutex.runExclusive(()=>{
  if (isConnected()){
    connectedGATTServer.server!.disconnect()
    connectedGATTServer.server = null
  }
  
  // navigator.bluetooth.requestDevice(options)
  //   .then((device:BluetoothDevice) => {
  //     if (!device.gatt){
  //       throw new Error('Gatt not defined')
  //     }
  //     device.gatt.disconnect()
  //     connectedGATTServer.server = null
  //   })
  //   .catch(error => { console.error(error) })
})