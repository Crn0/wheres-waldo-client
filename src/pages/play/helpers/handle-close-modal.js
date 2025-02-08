const handleCloseModal = (cb) => () => {
  cb((prev) => ({ ...prev, on: false }));
};

export default handleCloseModal;
