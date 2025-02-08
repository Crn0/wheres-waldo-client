const handleImageClick = (setCharacterId, setErrorState) => (id) => {
  setCharacterId(id);
  setErrorState({ hasError: false, on: true });
};

export default handleImageClick;
