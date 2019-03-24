// @flow

export default function logError(message: string, target: any, e: any = '') {
  if (window.__REACT_SIMPLE_IMG__.logConsoleError) {
    console.error(`${message}\n\n${target.outerHTML}\n\nand error message ${e.message}`);
  }
}
