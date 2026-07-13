import { Brush } from './brush.js';
import { EventEmitter } from 'node:events';
import { BluetoothFilter } from './bluetoothFilter.js';
import { toSigned } from './utils/helpers.js';

export class OralBClient extends EventEmitter {
  #connectedBrushes = new Map();

  constructor(noble) {
    super();

    if (!noble) {
      throw new Error('Noble is required for OralBClient. Please install `@stoprocent/noble` and pass it as a parameter.');
    }

    this.noble = noble;
  }

  getConnectedBrushes() {
    return Array.from(this.#connectedBrushes.values());
  }

  getBrush(macAddress) {
    return this.#connectedBrushes.get(macAddress);
  }

  async disconnectAll() {
    await Promise.all(this.getConnectedBrushes().map((b) => b.disconnect()));
  }

  #waitUntilReady(timeout = 5000) {
    if (this.noble?.state === 'poweredOn') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.noble.removeListener('stateChange', onStateChange);

        reject(new Error(`Cannot start scanning: Bluetooth adapter not powered on (timed out after ${timeout}ms)!`));
      }, timeout);

      const onStateChange = (state) => {
        if (state === 'poweredOn') {
          clearTimeout(timer);
          this.noble.removeListener('stateChange', onStateChange);
          resolve();
        }
      };

      this.noble.on('stateChange', onStateChange);
    });
  }

  #trackBrush(brush) {
    brush.on('connect', () => {
      this.#connectedBrushes.set(brush.macAddress, brush);
      this.emit('connect', brush);
    });

    brush.on('disconnect', () => {
      this.#connectedBrushes.delete(brush.macAddress);
      this.emit('disconnect', brush);
    });
  }

  async discover({ timeout = 10000 } = {}) {
    await this.#waitUntilReady();

    const filter = new BluetoothFilter();
    const brushes = new Map();

    const onDiscover = (peripheral) => {
      if (peripheral?.advertisement?.manufacturerData) {
        peripheral.advertisement.manufacturerData = toSigned(peripheral.advertisement.manufacturerData); // Convert to signed for ez handling
      }

      if (!filter.matches(peripheral)) return;
      const address = peripheral.address;

      if (!brushes.has(address)) {
        const brush = new Brush(peripheral);
        this.#trackBrush(brush);
        
        brushes.set(address, brush);
        this.emit('discover', brush);
      }
    };

    this.noble.on('discover', onDiscover);
    await this.noble.startScanningAsync([], false);

    await new Promise((resolve) => setTimeout(resolve, timeout));

    await this.noble.stopScanningAsync();
    this.noble.removeListener('discover', onDiscover);

    const result = Array.from(brushes.values());
    this.emit('discoverEnd', result);
    return result;
  }

  // just for convenience in-case they wanna use the client instead
  async connect(brush, options) {
    return brush.connect(options);
  }

  async disconnect(brush) {
    return brush.disconnect();
  }
}