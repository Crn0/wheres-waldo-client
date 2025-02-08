import PropTypes from 'prop-types';
import { useState } from 'react';
import { DateTime } from 'luxon';
import useInterval from '../../../hooks/user-interval';
import helper from '../../../helpers/index';

export default function Timer({ startDate, isRunning, styles = '' }) {
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    milliseconds: '00',
  });

  const start = DateTime.fromISO(startDate);
  const now = DateTime.fromISO(new Date().toISOString());

  useInterval(
    () => {
      setTime(now.diff(start, ['minutes', 'seconds', 'milliseconds']).toObject());
    },
    isRunning ? 0 : null,
  );

  return (
    <time dateTime={`${now}`}>
      <span className={`${styles}`}>{helper.formatTime(time)}</span>
    </time>
  );
}

Timer.propTypes = {
  startDate: PropTypes.string.isRequired,
  isRunning: PropTypes.bool.isRequired,
  styles: PropTypes.string,
};
