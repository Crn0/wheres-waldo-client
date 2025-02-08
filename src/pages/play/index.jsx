import PropTypes from 'prop-types';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useLoaderData, Await, useAsyncValue, useFetcher } from 'react-router-dom';
import { VscGithubInverted } from 'react-icons/vsc';
import GameBoard from './components/game-board';
import GameComplete from './components/game-complete';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Input from '../../components/ui/input';
import Link from '../../components/ui/links';
import Target from './components/target';
import Timer from './components/timer';
import Button from '../../components/ui/button';
import Spinner from '../../components/ui/spinner';
import BaseError from '../../errors/base-error';
import style from './css/index.module.css';

function Wrapper({ gameSessionData }) {
  const fetcher = useFetcher();
  const gameData = useAsyncValue();

  const [_, gameSession] = gameSessionData;
  const [gameError, game] = gameData;
  const isSubmitting = fetcher.state === 'submitting';

  const gameSessionObj = useMemo(
    () => gameSession || fetcher.data?.[1],
    [fetcher.data, gameSession],
  );

  const [targets, setTargets] = useState(gameSessionObj?.sessionCharacters);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const allTargetsFound = targets?.every((target) => target.found === true);

  useEffect(() => {
    if (!targets?.length && gameSessionObj?.sessionCharacters) {
      setTargets(gameSessionObj.sessionCharacters);
    }

    if (allTargetsFound) {
      setIsTimerRunning(false);
    }
  }, [allTargetsFound, fetcher.data, gameSessionObj?.sessionCharacters, targets?.length]);

  if (gameError && !gameSession) throw gameError;

  if (!gameSession && game && !fetcher.data) {
    return (
      <>
        <Header
          styles={`${style.flex} ${style.space_around} ${style.items_center} ${style.padd_2}`}
        >
          <Link to='/'>
            <span className={`${style.link}`}>Home</span>
          </Link>

          <Link to='/leader-boards'>
            <span className={`${style.link}`}>Leader-Board</span>
          </Link>
        </Header>

        <main>
          <div>
            <div
              className={`${style.board_image} ${style.flex} ${style.flex_center} ${style.margin_top_10per}`}
              style={{ backgroundImage: `url(${game.board.url})` }}
            >
              <fetcher.Form method='POST'>
                <Input type='hidden' name='gameId' value={game.id} autoComplete='off' />
                <Input type='hidden' name='intent' value='game-session:create' autoComplete='off' />
                <Button type='submit' size='sm' styles={`${style.button}`} disabled={isSubmitting}>
                  {!isSubmitting ? <span>start game</span> : <Spinner />}
                </Button>
              </fetcher.Form>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header styles={`${style.flex} ${style.space_around} ${style.items_center}`}>
        <div>
          <Timer
            startDate={gameSessionObj.sessionStart}
            isRunning={isTimerRunning}
            styles={`${style.header_clr}`}
          />
        </div>

        <div className={`${style.flex} ${style.gap_1} ${style.padd_1}`}>
          {targets?.map((target) => (
            <Target key={target.id} target={target} />
          ))}
        </div>
      </Header>
      <main className={`${style.h_100}`}>
        <GameBoard
          gameSession={gameSessionObj}
          targets={targets}
          setTargets={setTargets}
          allTargetsAreFound={allTargetsFound}
        />

        {(() => {
          if (!allTargetsFound) return null;

          return (
            <div className={`${style.overlay} ${style.grid} ${style.grid_center}`}>
              <GameComplete gameSession={gameSessionObj} />
            </div>
          );
        })()}
      </main>
    </>
  );
}

export default function Game() {
  const { gameSessionData, currentGameData } = useLoaderData();

  return (
    <div className={`${style.app}`}>
      <Suspense fallback={<Spinner />}>
        <Await resolve={currentGameData}>
          <Wrapper gameSessionData={gameSessionData} />
        </Await>
      </Suspense>
      <Footer styles={`${style.flex} ${style.flex_center} ${style.padd_1} ${style.zIndex_1}`}>
        <Link
          to='https://github.com/Crn0/wheres-waldo-client'
          styles={`${style.flex} ${style.flex_center}   ${style.gap_1} `}
        >
          <span className={`${style.footer_items_color}`}>Crno</span>
          <VscGithubInverted className={`${style.footer_items_color}`} size='1.5rem' />
        </Link>
      </Footer>
    </div>
  );
}

Wrapper.propTypes = {
  gameSessionData: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.instanceOf(BaseError),
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        sessionStart: PropTypes.string.isRequired,
        sessionEnd: PropTypes.string,
        game: PropTypes.shape({
          title: PropTypes.string.isRequired,
          board: PropTypes.shape({
            url: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
        sessionCharacters: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            found: PropTypes.bool.isRequired,
            sprite: PropTypes.shape({
              url: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        ),
      }),
    ]),
  ),
};
