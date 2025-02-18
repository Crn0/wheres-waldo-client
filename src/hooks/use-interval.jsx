import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

export default function useInterval(cb, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = cb;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return () => {};
  }, [delay]);
}

useInterval.propTypes = {
  cb: PropTypes.func.isRequired,
  delay: PropTypes.number,
};
