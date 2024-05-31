/**
 * @param {number} port
 * @param {Buffer} data
 */
export function onNPSData(port, data) {
  const hex = data.toString("hex");
  console.log(`Data received: ${hex}`);
}
