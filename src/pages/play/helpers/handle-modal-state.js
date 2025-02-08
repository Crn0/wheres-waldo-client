const handleModalState = (cb, allTargetsAreFound) => (e) => {
  if (allTargetsAreFound) return cb((prev) => ({ ...prev, on: false }));

  const rect = e.target.getBoundingClientRect();
  const left = e.clientX - rect.left;
  const top = e.clientY - rect.top;

  return cb((prev) => ({ ...prev, left, top, on: true }));
};

export default handleModalState;
