import { Await, useAsyncValue, useLoaderData } from 'react-router-dom';
import { Suspense } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Card from './components/game-card';
import Link from '../../components/ui/links';
import Spinner from '../../components/ui/spinner';
import style from './css/index.module.css';

function Wrapper() {
  const [_, games] = useAsyncValue();

  return (
    <div
      className={`${style.flex} ${style.flex_center} ${style.flex_wrap} ${style.gap_1} ${style.margin_top_2} ${style.margin_bottom_2}`}
    >
      {(() => {
        if (games.length === 0) return <p>There are no games.</p>;

        return games.map((game) => (
          <div key={game.id} className={` ${style.card}`}>
            <Card game={game} />
          </div>
        ));
      })()}
    </div>
  );
}

export default function Games() {
  const { games } = useLoaderData();

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
        <Suspense fallback={<Spinner />}>
          <Await resolve={games}>
            <Wrapper />
          </Await>
        </Suspense>
      </main>

      <Footer styles={`${style.flex} ${style.flex_center} ${style.padd_1}`}>
        <Link
          to='https://github.com/Crn0/wheres-waldo-client'
          styles={`${style.flex} ${style.flex_center}  ${style.gap_1} `}
        >
          <span className={`${style.footer_items_color}`}>Crno</span>
          <VscGithubInverted className={`${style.footer_items_color}`} size='1.5rem' />
        </Link>
      </Footer>
    </div>
  );
}
