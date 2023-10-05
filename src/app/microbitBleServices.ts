import { IMicrobitService, CharProps } from './ble'

export const parseUuid = (uuidString:string)=>{
  const uuid = uuidString.replace(
    /(.{8})(.{4})(.{4})(.{4})(.{12})/g,
    '$1-$2-$3-$4-$5',
  ).toLowerCase()
  return uuid
}

// source: https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html
// source: https://lancaster-university.github.io/microbit-docs/ble/profile/

export const deviceInfoService:IMicrobitService<
  'modelNr' | 
  // 'serNr' | // this is blocked: https://github.com/WebBluetoothCG/registries/blob/master/gatt_blocklist.txt
  //'hwRev' // this is not exposed
  'fwRev'
  //'manufacturerName' // this is not exposed
> = {
  name: 'DEVICE_INFO_SERVICE',
  uuid: parseUuid('0000180A00001000800000805F9B34FB'),
  characteristics: {
    modelNr: {
      name: 'MODEL_NR',
      uuid: parseUuid('00002A2400001000800000805F9B34FB'),
      props: CharProps.Read
    },
    // serNr:{
    //   name:'SER_NR',
    //   uuid:parseUuid('00002A2500001000800000805F9B34FB'),
    //   props: CharProps.Read
    // },
    // hwRev:{
    //   name:'HW_REV',
    //   uuid:parseUuid('00002A2700001000800000805F9B34FB'),
    //   props: CharProps.Read
    // },
    fwRev:{
      name:'FW_REV',
      uuid:parseUuid('00002A2600001000800000805F9B34FB'),
      props: CharProps.Read
    },
    // manufacturerName:{
    //   name:'MANUFACTURER_NAME',
    //   uuid:parseUuid('00002A2900001000800000805F9B34FB'),
    //   props: CharProps.Read
    // }
  }
}

export const btnService:IMicrobitService<'btnA' | 'btnB'> = {
  name: 'BTN_SERVICE',
  uuid: parseUuid('E95D9882251D470AA062FA1922DFA9A8'),
  characteristics: {
    btnA: {
      name: 'BTNA',
      uuid: parseUuid('E95DDA90251D470AA062FA1922DFA9A8'),
      props: CharProps.Read | CharProps.Notify
    },
    btnB:{
      name:'BTNB',
      uuid:parseUuid('E95DDA91251D470AA062FA1922DFA9A8'),
      props: CharProps.Read | CharProps.Notify
    }
  }
}

export const pinService:IMicrobitService<'pinData' | 'pinIOConfig' | 'pinADConfig'> = {
  name: 'PIN_SERVICE',
  uuid: parseUuid('E95D127B251D470AA062FA1922DFA9A8'),
  characteristics: {
    pinData: {
      name: 'PIN_DATA',
      uuid: parseUuid('E95D8D00251D470AA062FA1922DFA9A8'),
      props: CharProps.Read | CharProps.Notify | CharProps.Write
    },
    pinIOConfig: {
      name: 'PIN_IO_CONFIG',
      uuid: parseUuid('E95DB9FE251D470AA062FA1922DFA9A8'),
      props: CharProps.Read | CharProps.Write
    },
    pinADConfig: {
      name: 'PIN_AD_CONFIG',
      uuid: parseUuid('E95D5899251D470AA062FA1922DFA9A8'),
      props: CharProps.Read | CharProps.Write
    }
  }
}

export const accService:IMicrobitService<'accData'> = {
  name: 'ACC_SERVICE',
  uuid: parseUuid('E95D0753251D470AA062FA1922DFA9A8'),
  characteristics: {
    accData:{
      name:'ACC_DATA',
      uuid:parseUuid('E95DCA4B251D470AA062FA1922DFA9A8'),
      props: CharProps.Read | CharProps.Notify
    }
  }
}

export const magService:IMicrobitService<'magData'> = {
  name: 'MAG_SERVICE',
  uuid: parseUuid('E95DF2D8251D470AA062FA1922DFA9A8'),
  characteristics: {
    magData:{
      name:'MAG_DATA',
      uuid:parseUuid('E95DFB11251D470AA062FA1922DFA9A8'),
      props: CharProps.Read | CharProps.Notify
    }
  }
}

export const ledService:IMicrobitService<'matrixState' | 'text'> = {
  name: 'LED_SERVICE',
  uuid: parseUuid('E95DD91D251D470AA062FA1922DFA9A8'),
  characteristics: {
    matrixState:{
      name:'MATRIX_STATE',
      uuid:parseUuid('E95D7B77251D470AA062FA1922DFA9A8'),
      props: CharProps.Read | CharProps.Write
    },
    text:{
      name:'TEXT',
      uuid:parseUuid('E95D93EE251D470AA062FA1922DFA9A8'),
      props: CharProps.Write
    }
  }
}

export const eventService:IMicrobitService<
  'mbRequirements' | 
  'mbEvent' | 
  'clientRequirements' |
  'clientEvent'
> = {
  name: 'EVENT_SERVICE',
  uuid: parseUuid('E95D93AF251D470AA062FA1922DFA9A8'),
  characteristics: {
    mbRequirements:{
      name:'MB_REQUIREMENTS',
      uuid:parseUuid('E95DB84C251D470AA062FA1922DFA9A8'),
      props: CharProps.Read | CharProps.Notify
    },
    mbEvent:{
      name:'MB_EVENT',
      uuid:parseUuid('E95D9775251D470AA062FA1922DFA9A8'),
      props: CharProps.Read | CharProps.Notify
    },
    clientRequirements:{
      name:'CLIENT_REQUIREMENTS',
      uuid:parseUuid('E95D23C4251D470AA062FA1922DFA9A8'),
      props: CharProps.Write
    },
    clientEvent:{
      name:'CLIENT_EVENT',
      uuid:parseUuid('E95D5404251D470AA062FA1922DFA9A8'),
      props: CharProps.Write
    }
  }
}

export const tmpService:IMicrobitService<'tmpData'> = {
  name: 'TMP_SERVICE',
  uuid: parseUuid('E95D6100251D470AA062FA1922DFA9A8'),
  characteristics: {
    tmpData:{
      name:'TMP_DATA',
      uuid:parseUuid('E95D9250251D470AA062FA1922DFA9A8'),
      props: CharProps.Read | CharProps.Notify
    }
  }
}

