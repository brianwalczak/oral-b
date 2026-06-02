import { Brush } from './brush.js';
import { EventEmitter } from 'node:events';
import { BluetoothFilter } from './bluetoothFilter.js';
import { toSigned } from './utils/helpers.js';

export class OralBClient extends EventEmitter {
  constructor(noble) {
    super();
    this.noble = noble;
  }

  async discover(options = {}) {
    const { timeout = 5000 } = options;
    const filter = new BluetoothFilter();
    const brushes = new Map();

    const onDiscover = (peripheral) => {
      if (peripheral?.advertisement?.manufacturerData) {
        peripheral.advertisement.manufacturerData = toSigned(peripheral.advertisement.manufacturerData); // Convert to signed for ez handling
      }

      if (!filter.matches(peripheral)) return;
      const address = peripheral.address;

      if (brushes.has(address)) {
        brushes.get(address).rssi = peripheral.rssi;
      } else {
        const brush = new Brush(peripheral);
        
        brushes.set(address, brush);
        this.emit('discover', brush);
      }
    };

    this.noble.on('discover', onDiscover);
    await this.noble.startScanningAsync([], false);

    await new Promise((resolve) => setTimeout(resolve, timeout));

    await this.noble.stopScanningAsync();
    this.noble.removeListener('discover', onDiscover);

    return Array.from(brushes.values());
  }
}