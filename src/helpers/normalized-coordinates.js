const findNormalizedCoords = (e) => {
  const rect = e.target.getBoundingClientRect();
  const { width } = rect;
  const { height } = rect;
  const { clientX } = e.nativeEvent;
  const { clientY } = e.nativeEvent;

  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const normalizedX = x / width;
  const normalizedY = y / height;

  return {
    normalizedX,
    normalizedY,
  };
};

export default findNormalizedCoords;
