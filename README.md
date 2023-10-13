
# Micro:bit Explorer
Explorer BBC micro:bit sensor data and inputs over BLE

See the Explorer online: https://microbit-explorer.ok-y.xyz

![alt text](./doc/assets/microbit-explorer_ui.png "Microbit Explorer UI")
## Quickstart
### Micro:bit Explorer
to run locally
```
yarn install
yarn dev
```
### micro:bit
to prepare the micro:bit follow the following steps:
1. Open [MakeCode](https://makecode.microbit.org/) 
2. Import a project from the .hex found in `doc/microbit/microbit-basic_ble.hex` *OR* create a new project and copy and paste the python code in `doc/microbit/microbit-basic_ble.py` to the MakeCode python editor.
3. Connect micro:bit with USB cable and download the project to the micro:bit

For more info about how to program and work with the micro:bit see one of the many MakeCode tutorials on the [MakeCode](https://makecode.microbit.org/).
## Features
### Show device info
:ballot_box_with_check: BLE ID  
:ballot_box_with_check: name  
:ballot_box_with_check: model
### Visual feedback
![alt text](./doc/assets/microbit-explorer_tilt.gif "Microbit Explorer Sensor Data")  
Visually shows device tilt (based on the accelerometer data) and accelerometer and magnetometer vectors
### Sensor value stream
:ballot_box_with_check: accelerometer and magnetometer  
:ballot_box_with_check: temperature  
:ballot_box_with_check: button state  
:ballot_box_with_check: pin state
### Send data to micro:bit
![alt text](./doc/assets/microbit-explorer_smile.gif "Microbit Explorer Sensor Data")  
:ballot_box_with_check: LED array text  
:ballot_box_with_check: LED array  
:ballot_box_with_check: pin digital and analog output values (for configured pins)
### Set GPIO type
:ballot_box_with_check: input/output  
:ballot_box_with_check: digital/analog
## Known Issues
:x: not every browser supports BLE (see [browser compaibility](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API#browser_compatibility))

## Resources: 
 - accelerometer: https://microbit-challenges.readthedocs.io/en/latest/tutorials/accelerometer.html
 - BLE profile: https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html
 - BLE description: https://lancaster-university.github.io/microbit-docs/ble/profile/
 - LSM303AGR datasheet: https://www.st.com/resource/en/datasheet/lsm303agr.pdf 