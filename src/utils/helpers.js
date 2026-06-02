export function toSigned(arr) {
  if (!arr || arr.length === 0) return arr;
  return new Int8Array(Uint8Array.from(arr).buffer);
}