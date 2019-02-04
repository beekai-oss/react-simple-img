// @flow

export default function logError(message, target, e = '') {
  console.error(`💩 ${message}\n\n${target.outerHTML}\n\nand error message ${JSON.stringify(e, null, 2)}`);
}
