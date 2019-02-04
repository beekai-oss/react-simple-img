// @flow

export default function logError(message: string, target: any, e: any = '') {
  console.error(`💩 ${message}\n\n${target.outerHTML}\n\nand error message ${JSON.stringify(e, null, 2)}`);
}
