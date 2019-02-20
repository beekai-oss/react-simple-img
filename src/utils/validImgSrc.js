const pathRegex = /^(.*\/)([^/]*)$/;

export default function validImgSrc(placeholder) {
  return placeholder && (pathRegex.test(placeholder) || placeholder.startsWith('data:image'));
}
