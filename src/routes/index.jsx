import Games from '../pages/games';
import GameDetail from '../pages/game-detail';
import GamePlay from '../pages/play';
import LeaderBoards from '../pages/leader-board';
import loaders from '../loaders';
import actions from '../actions';

const routes = [
  {
    path: '/',
    children: [
      {
        index: true,
        loader: loaders.games,
        shouldRevalidate: () => false,
        element: <Games />,
      },
      {
        path: 'games',
        loader: loaders.games,
        shouldRevalidate: () => false,
        element: <Games />,
      },
    ],
  },
  {
    path: '/games/:title',
    loader: loaders.game,
    shouldRevalidate: () => false,
    element: <GameDetail />,
  },
  {
    path: '/play',
    loader: loaders.gamePlay,
    action: actions.gamePlay,
    shouldRevalidate: () => false,
    element: <GamePlay />,
  },
  {
    path: '/leader-boards',
    loader: loaders.leaderBoard,
    shouldRevalidate: () => false,
    element: <LeaderBoards />,
  },
];

export default routes;
