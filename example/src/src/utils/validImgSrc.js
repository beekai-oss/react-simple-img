const pathRegex = /^(.*\/)([^/]*)$/;

export default function validImgSrc(placeholder) {
  return pathRegex.test(placeholder) || placeholder.startsWith('data:image');
}
