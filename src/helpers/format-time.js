const formatTime = (timeDTO) => {
  let { minutes } = timeDTO;
  let { seconds } = timeDTO;
  const { milliseconds } = timeDTO;
  if (minutes?.toString().length <= 1) {
    minutes = `0${minutes}`;
  }
  if (seconds?.toString().length <= 1) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${typeof seconds === 'string' ? seconds : Math.floor(seconds)}:${milliseconds}`;
};

export default formatTime;
