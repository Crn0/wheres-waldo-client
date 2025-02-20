import { replace } from 'react-router-dom';
import Games from '../pages/games';
import GameDetail from '../pages/game-detail';
import GamePlay from '../pages/play';
import LeaderBoards from '../pages/leader-board';
import ErrorHandler from '../components/error';
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
        errorElement: <ErrorHandler />,
        element: <Games />,
      },
      {
        path: 'games',
        loader: loaders.games,
        errorElement: <ErrorHandler />,
        shouldRevalidate: () => false,
        element: <Games />,
      },
    ],
  },
  {
    path: '/games/:title',
    loader: loaders.game,
    shouldRevalidate: () => false,
    errorElement: <ErrorHandler />,
    element: <GameDetail />,
  },
  {
    path: '/play',
    loader: loaders.gamePlay,
    action: actions.gamePlay,
    shouldRevalidate: () => false,
    errorElement: <ErrorHandler />,
    element: <GamePlay />,
  },
  {
    path: '/leader-boards',
    loader: loaders.leaderBoard,
    shouldRevalidate: () => false,
    errorElement: <ErrorHandler />,
    element: <LeaderBoards />,
  },
  {
    path: '*',
    action: () => replace('/'),
    element: <ErrorHandler />,
  },
];

export default routes;
