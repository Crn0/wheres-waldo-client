const findBoundary = (e) => (normalizedX, normalizedY) => {
  const rect = e.target.getBoundingClientRect();
  const { width } = rect;
  const { height } = rect;
  const { clientX } = e.nativeEvent;
  const { clientY } = e.nativeEvent;

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const currentX = x / width;
  const currentY = y / height;

  const diffX = Math.floor(Math.abs(normalizedX * width + 1 - currentX * width));
  const diffY = Math.floor(Math.abs(normalizedY * height + 1 - currentY * height));

  return {
    diffX,
    diffY,
  };
};

export default findBoundary;
