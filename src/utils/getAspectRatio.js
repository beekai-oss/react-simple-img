// @flow

export default function getAspectRatio({
  height = 0,
  width = 0,
  applyAspectRatio,
}: {
  height?: number,
  width?: number,
  applyAspectRatio?: boolean,
}) {
  const aspectRatio = parseInt(height, 10) / parseInt(width, 10);
  const shouldUseAspectRatio = applyAspectRatio && !isNaN(aspectRatio); // eslint-disable-line
  const aspectRatioStyle = {
    position: 'relative',
    display: 'block',
    paddingBottom: shouldUseAspectRatio ? `${Math.abs(aspectRatio * 100)}%` : '',
  };

  return {
    shouldUseAspectRatio,
    aspectRatioStyle,
  };
}
