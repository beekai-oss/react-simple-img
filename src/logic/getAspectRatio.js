// @flow

export default function getAspectRatio({
  height,
  width,
  applyAspectRatio,
}: {
  height: number,
  width: number,
  applyAspectRatio: boolean,
}) {
  const aspectRatio = parseInt(height, 10) / parseInt(width, 10);
  const shouldUseAspectRatio = applyAspectRatio && !Number.isNaN(aspectRatio);
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
