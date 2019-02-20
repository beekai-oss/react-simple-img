// @flow
export default function convertStyleIntoString(style) {
  return Object.entries(style).reduce((previousState, [key, value]) => `${previousState}${key}:${value};`, '');
}
