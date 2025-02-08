import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

export default function useTimer({
  startDate,
  state = {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  },
  duration = 2 * 60 * 1000,
}) {
  // const
}

useTimer.propTypes = {
  state: PropTypes.shape({
    hours: PropTypes.number,
    minutes: PropTypes.number,
    seconds: PropTypes.number,
    milliseconds: PropTypes.number,
  }),
  startDate: PropTypes.instanceOf(Date).isRequired,
  duration: PropTypes.number,
};
