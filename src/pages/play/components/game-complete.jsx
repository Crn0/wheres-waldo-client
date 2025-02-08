import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Form, useActionData, useFetcher, useNavigation } from 'react-router-dom';
import { DateTime } from 'luxon';
import Input from '../../../components/ui/input';
import Button from '../../../components/ui/button';
import Spinner from '../../../components/ui/spinner';
import helper from '../../../helpers/index';
import style from './css/game-complete.module.css';

export default function GameComplete({ gameSession }) {
  const fetcher = useFetcher();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [playDate, setPlayDate] = useState({
    start: gameSession.sessionStart,
    end: gameSession.sessionEnd,
  });

  const isSubmitting = navigation.state === 'submitting';

  const start = DateTime.fromISO(playDate.start);
  const end = DateTime.fromISO(playDate.end);
  const timeDiff = end.diff(start, ['seconds', 'milliseconds']).toObject();

  const actionError = actionData?.[0];

  useEffect(() => {
    if (fetcher.data) {
      const fetchedGameSessionData = fetcher.data.gameSessionData;
      const [error, data] = fetchedGameSessionData;

      if (error) throw error;

      setPlayDate({
        start: data.sessionStart,
        end: data.sessionEnd,
      });
    }

    if (fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load(`/play?game=${gameSession.game.title}`);
    }
  }, [fetcher, gameSession.game.title]);

  return (
    <div
      className={`${style.grid} ${style.grid_center} ${style.gap_2rem} ${style.pad_10rem}  ${style.border}`}
    >
      <h1>
        <span className={`${style.span_color}`}>Game completed!</span>
      </h1>
      <p>
        <span className={`${style.span_color}`}>You have found all the characters!</span>
      </p>
      <h3>
        <span className={`${style.span_color}`}>Score:</span>
      </h3>
      <time dateTime={`${gameSession.sessionEnd}`}>
        <span
          className={`${style.span_color}`}
        >{`${timeDiff.seconds}.${timeDiff.milliseconds} seconds`}</span>
      </time>

      <Form
        action=''
        method='POST'
        className={`${style.grid} ${style.grid_center} ${style.gap_2rem}`}
      >
        <Input type='hidden' name='playerId' value={gameSession.player.id} autoComplete='off' />
        <Input type='hidden' name='intent' value='player:update:username' autoComplete='off' />
        <Input type='text' name='username' placeholder='John Doe' autoComplete='off' uncontrolled />
        <Button type='submit' size='m' styles={`${style.button}`} disabled={isSubmitting}>
          {!isSubmitting ? <span>submit</span> : <Spinner />}
        </Button>
      </Form>

      {(() => {
        if (!actionError?.errors.length) return null;

        return (
          <div>
            {actionError.errors.map((err) => (
              <p key={err.field} className={`${style.error}`}>
                {err.message}
              </p>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
GameComplete.propTypes = {
  gameSession: PropTypes.shape({
    id: PropTypes.number.isRequired,
    player: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    game: PropTypes.shape({
      title: PropTypes.string.isRequired,
      board: PropTypes.shape({
        url: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    sessionStart: PropTypes.string.isRequired,
    sessionEnd: PropTypes.string,
    sessionCharacters: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        found: PropTypes.bool.isRequired,
        sprite: PropTypes.shape({
          artist: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    ),
  }),
};
