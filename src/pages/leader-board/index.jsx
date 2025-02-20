import { Suspense, useCallback, useEffect, useState } from 'react';
import { Await, useAsyncValue, useLoaderData, useFetcher } from 'react-router-dom';
import { DateTime } from 'luxon';
import { VscGithubInverted } from 'react-icons/vsc';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Link from '../../components/ui/links';
import Button from '../../components/ui/button';
import Spinner from '../../components/ui/spinner';
import style from './css/index.module.css';

function Wrapper() {
  const fetcher = useFetcher();
  const [e, leaderBoards] = useAsyncValue();
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const fetcherError = fetcher.data?.[0];
  const fetcherData = fetcher.data?.[1];

  if (e) throw e;

  const handleClick = useCallback(
    (leadBoardId, indexId) => () => {
      const formData = new FormData();

      formData.append('intent', 'leader_board:get:current');
      formData.append('leaderBoardId', leadBoardId);

      setActiveCardIndex(indexId);

      fetcher.submit(formData);
    },
    [fetcher],
  );

  useEffect(() => {
    if (leaderBoards.length !== 0 && !fetcherData && !fetcherError && fetcher.state === 'idle') {
      handleClick(leaderBoards[0].id, 0)();
    }
  }, [fetcher.state, fetcherData, fetcherError, handleClick, leaderBoards]);

  return (
    <div>
      {(() => {
        if (leaderBoards.length === 0) {
          return (
            <div
              className={`${style.clr_white} ${style.flex} ${style.items_center} ${style.content_center} ${style.h_100dvh}`}
            >
              <p>There are no leader boards</p>
            </div>
          );
        }

        return (
          <>
            <div>
              <h1 className={`${style.text_center}`}>Leader Board</h1>
              <div className={`${style.boards_container} `}>
                {leaderBoards.map((leaderBoard, index) => (
                  <Button
                    key={leaderBoard.id}
                    type='button'
                    size='sm'
                    styles={`${style.board} ${style.h_400px} ${style.bg_none}`}
                    onClick={handleClick(leaderBoard.id, index)}
                  >
                    <img
                      className={`${style.image_shape} ${index === activeCardIndex ? style.active_img : ''}`}
                      src={leaderBoard.game.board.url}
                      alt={leaderBoard.game.title}
                    />
                  </Button>
                ))}
              </div>
            </div>
            <div className={`${style.flex} ${style.items_center} ${style.direct_column}`}>
              <h2
                className={`${style.text_capitalize} ${style.text_center} ${style.m_top_2} ${style.clr_white}`}
              >
                {leaderBoards[activeCardIndex].game.title}
              </h2>

              <table className={`${style.table} ${style.m_bottom_2}`}>
                <colgroup>
                  <col span='1' />
                  <col span='1' />
                  <col span='1' />
                  <col span='1' />
                </colgroup>
                <thead>
                  <tr>
                    <th scope='col' id='rank' className={`${style.th}`}>
                      <span>Rank</span>
                    </th>
                    <th scope='col' id='player' className={`${style.th}`}>
                      <span>Player</span>
                    </th>
                    <th scope='col' id='score' className={`${style.th}`}>
                      <span>Score</span>
                    </th>
                    <th scope='col' id='start_date' className={`${style.th}`}>
                      <span>Start Date</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    if (fetcherError) {
                      return (
                        <tr>
                          <td colSpan={4} className={`${style.text_center}`}>
                            {fetcherError?.message}
                          </td>
                        </tr>
                      );
                    }

                    if (
                      (!fetcherData && (fetcher.state === 'loading' || fetcher.state === 'idle')) ||
                      fetcher.state === 'loading'
                    )
                      return (
                        <tr>
                          <td colSpan={4} className={`${style.text_center}`}>
                            Fetching leader-board
                          </td>
                        </tr>
                      );

                    if (fetcherData.players.length === 0) {
                      return (
                        <tr>
                          <td colSpan={4} className={`${style.text_center}`}>
                            There&apos;s no data available
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <>
                        {fetcherData.players.map((player, i) => {
                          const rank = i + 1;
                          const date = DateTime.fromISO(player?.sessionStart);
                          const humanReadable = date.toLocaleString(DateTime.DATE_MED);

                          return (
                            <tr key={player.id}>
                              <td className={`${style.td}`}>{rank}</td>
                              <td className={`${style.td}`}>{player.username}</td>
                              <td className={`${style.td}`}>{`${player.time}s`}</td>
                              <td className={`${style.td}`}>{humanReadable}</td>
                            </tr>
                          );
                        })}
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </>
        );
      })()}
    </div>
  );
}

export default function LeaderBoards() {
  const { leaderBoards } = useLoaderData();

  return (
    <div className={`${style.app}`}>
      <Header styles={`${style.flex} ${style.space_around} ${style.items_center} ${style.padd_2}`}>
        <Link to='/'>
          <span className={`${style.link}`}>Home</span>
        </Link>

        <Link to='/leader-boards'>
          <span className={`${style.link}`}>Leader-Board</span>
        </Link>
      </Header>
      <main>
        <Suspense fallback={<Spinner styles={`${style.spinner}`} />}>
          <Await resolve={leaderBoards}>
            <Wrapper />
          </Await>
        </Suspense>
      </main>
      <Footer styles={`${style.flex} ${style.content_center} ${style.padd_1}`}>
        <Link
          to='https://github.com/Crn0/wheres-waldo-client'
          styles={`${style.flex} ${style.content_center}  ${style.gap_1} `}
        >
          <span className={`${style.footer_items_color}`}>Crno</span>
          <VscGithubInverted className={`${style.footer_items_color}`} size='1.5rem' />
        </Link>
      </Footer>
    </div>
  );
}
