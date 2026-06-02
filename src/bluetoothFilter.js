// src\main\java\codes\alchemy\oralb\blesdk\scan\model\BrushFilter.java
import { BrushModel } from './definitions/brushModel.js';

export class BluetoothFilter {
  matches(peripheral) {
    const advertisement = peripheral?.advertisement;
    const manufacturerData = advertisement?.manufacturerData;

    if (!manufacturerData || manufacturerData.length < 4) return false;

    // Java [2] -> [0], and [3] -> [1] cuz Noble's manufacturerData already strips the first 2 bytes to isolate manufacturer-specific data
    if (manufacturerData[0] !== -36 || manufacturerData[1] !== 0) {
        return false;
    }

    return !!BrushModel.fromByte(manufacturerData[3]); // Check if it's a valid brush model
  }
}