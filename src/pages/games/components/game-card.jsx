import PropTypes from 'prop-types';
import Link from '../../../components/ui/links';
import style from './css/card.module.css';

export default function Card({ game }) {
  return (
    <figure>
      <Link to={`/games/${game.title}`}>
        <img src={game.board.url} alt={game.title} />
        <figcaption className={`${style.figcaption}`}>{game.title}</figcaption>
      </Link>
    </figure>
  );
}

Card.propTypes = {
  game: PropTypes.shape({
    title: PropTypes.string.isRequired,
    board: PropTypes.shape({
      url: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
