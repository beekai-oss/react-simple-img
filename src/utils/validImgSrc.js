const pathRegex = /^(.*\/)([^/]*)$/;

export default function validImgSrc(placeholder) {
  return placeholder && (pathRegex.test(placeholder) || placeholder.indexOf('data:image') === 0);
}
