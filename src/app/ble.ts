const parseUuid = (uuidString:string)=>{
  const uuid = uuidString.replace(
    /(.{8})(.{4})(.{4})(.{4})(.{12})/g,
    '$1-$2-$3-$4-$5',
  ).toLowerCase()
  return uuid
}

const ACC_UUID = parseUuid('E95D0753251D470AA062FA1922DFA9A8')
const ACC_UUID_CHAR = parseUuid('E95DCA4B251D470AA062FA1922DFA9A8')

const options = {
  filters: [
    //{ services: ["heart_rate"] },
    //{ services: [0x1802, 0x1803] },
    //{ services: [uuid] },
    //{ name: "ExampleName" },
    { namePrefix: 'BBC' },
  ],
  optionalServices: [ACC_UUID],
  //acceptAllDevices: true
}

const onDisconnected = (event:Event)=>{
  const device = event.target as BluetoothDevice
  console.log(`Device ${device.name} is disconnected.`)
}

const onConnected = (event:Event)=>{
  const device = event.target as BluetoothDevice
  console.log(`Device ${device.name} is connected.`)
}

const onAccChanged = (event:Event)=>{
  const acc = event.target as BluetoothRemoteGATTCharacteristic
  if (!acc || !acc.value){
    return
  }
  const accX = acc.value.getInt16(0,true)*0.001
  const accY = acc.value.getInt16(2,true)*0.001
  const accZ = acc.value.getInt16(4,true)*0.001
  console.log(`${event.timeStamp}: ${accX}, ${accY}, ${accZ}`)
}

const handleConnectDevice = ()=>{
  navigator.bluetooth
    .requestDevice(options)
    .then((device:BluetoothDevice) => {
      console.debug(device)
      device.addEventListener('gattserverdisconnected', onDisconnected)
      device.addEventListener('gattserverconnected', onConnected)
      if (!device.gatt){
        throw new Error('Gatt not defined')
      }
      return device.gatt.connect()
    // Do something with the device.
    })
    .then((server:BluetoothRemoteGATTServer) => {
      return server.getPrimaryService(ACC_UUID)
    })
    .then((service:BluetoothRemoteGATTService) => {
      return service.getCharacteristic(ACC_UUID_CHAR)
    })
    .then((characteristic:BluetoothRemoteGATTCharacteristic) => {
      characteristic.addEventListener(
        'characteristicvaluechanged',
        onAccChanged
      )
      return characteristic.startNotifications()
    })
    .catch((error) => console.error(`Something went wrong. ${error}`))
}

const handleDisconnectDevice = ()=>{
  navigator.bluetooth.requestDevice(options)
    .then((device:BluetoothDevice) => {
      if (!device.gatt){
        throw new Error('Gatt not defined')
      }
      device.gatt.disconnect()
    })
    .catch(error => { console.error(error) })
}