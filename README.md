# @iiot2k/node-red-ads1115

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
[![platform](https://img.shields.io/badge/platform-Raspberry--Pi-ff69b4)](https://www.raspberrypi.com/)

Node-Red node for ads1115 analog to digital converter

<a href="https://www.buymeacoffee.com/iiot2ka" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-red.png" height="41" width="174"></a>

## Installation
Install with Node-Red Palette Manager or npm command:
```
cd ~/.node-red
npm install @iiot2k/node-red-ads1115
```
[View on npm](https://www.npmjs.com/package/@iiot2k/node-red-ads1115)<br>
[View on Node-Red](https://flows.nodered.org/node/@iiot2k/node-red-ads1115)<br>
[View used library](https://www.npmjs.com/package/@iiot2k/ads1115)

Report any issues [here](https://github.com/iiot2k/ads1115/issues)

## [ads1115](https://www.ti.com/product/ADS1115) 16bit analog to digital converter
- 16bit Conversion Resolution.
- Four Analog Inputs.
- Each input can be selected Single-Ended, Differential.
- Internal Voltage Reference.
- Internal Oscillator.
- Programmable Data Rate 8 SPS to 860 SPS.
- The PGA offers input ranges from ±256 mV to ±6144 mV.
- I2C Interface with four pin-selectable addresses.

## Detail
> Node **ads1115** reads single adc input.<br>
> Node **ads1115-m** reads multiple adc inputs.

- This node works on Raspberry Pi with 32bit or 64bit OS.
- The output value is mV or adc raw data.
- Enable I2C with raspi-config.
- In this case i2c-1 is enabled (port=1).
- If you use i2c-0 port add<br>
  **dtparam=i2c_vc=on**<br>
  to /boot/config.txt,<br>
  then Pin27=SDA, Pin28=SCK.<br>
- For other ports add this to /boot/config.txt.

## Address Pin Connection

|I2C Address|ADDR Pin|
|:----|:---|
|48H|GND or open|
|49H|VCC|
|4AH|SDA|
|4BH|SCL|
