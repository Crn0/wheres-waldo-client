const handleGuessAnwser = (cb) => (e) => {
  const rect = e.target.getBoundingClientRect();
  const { width } = rect;
  const { height } = rect;
  const { clientX } = e.nativeEvent;
  const { clientY } = e.nativeEvent;

  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const currentX = x / width;
  const currentY = y / height;

  cb((prev) => ({
    ...prev,
    width,
    height,
    currentX,
    currentY,
    left: currentX * width,
    top: currentY * height,
  }));
};

export default handleGuessAnwser;
