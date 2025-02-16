import { Suspense } from 'react';
import { Await, useAsyncValue, useLoaderData } from 'react-router-dom';
import Detail from './components/detail';
import Spinner from '../../components/ui/spinner';
import style from './css/index.module.css';

function Wrapper() {
  const [error, game] = useAsyncValue();

  if (error) throw error;

  return (
    <div className={` ${style.h_100dvh}`}>
      <div className={`${style.image}`}>
        <img src={game.board.url} alt={game.title} />
      </div>
      <div>
        <Detail game={game} />
      </div>
    </div>
  );
}

export default function Game() {
  const { game } = useLoaderData();

  return (
    <Suspense fallback={<Spinner styles={`${style.spinner}`} />}>
      <Await resolve={game}>
        <Wrapper />
      </Await>
    </Suspense>
  );
}
