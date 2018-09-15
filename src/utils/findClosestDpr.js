// @flow

export default (result: Array<Object>, target: number) =>
  result.reduce((prev, curr) => (Math.abs(curr.dpr - target) < Math.abs(prev.dpr - target) ? curr : prev));
