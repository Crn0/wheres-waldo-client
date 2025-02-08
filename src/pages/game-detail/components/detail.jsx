import PropTypes from 'prop-types';
import Target from './target';
import Link from '../../../components/ui/links';
import style from './css/detail.module.css';

export default function Detail({ game }) {
  return (
    <div className={`${style.overlay} ${style.flex} ${style.flex_center}`}>
      <div
        className={`${style.flex} ${style.modal_width} ${style.h_80} ${style.flex_end} ${style.bg_cover} ${style.no_repeat}`}
        style={{ backgroundImage: `url(${game.board.url})` }}
      >
        <div className={`${style.modal_overlay} ${style.w_80} ${style.paragraph_color}`}>
          <div className={`${style.modal_overlay_top} ${style.grid}`}>
            <h1 className={`${style.h1}`}>{game.title}</h1>
            <span className={`${style.self_center}`}>
              Art by <cite>{game.board.artist}</cite>
            </span>
          </div>

          <div className={`${style.modal_overlay_middle}`}>
            <h2>Targets</h2>
            <div className={`${style.flex_1} ${style.grid}`}>
              {game.targets.map((target) => (
                <Target key={target.id} target={target} />
              ))}
            </div>
          </div>

          <div className={`${style.grid} ${style.content_center} ${style.m_bottom_1}`}>
            <Link to={`/play?game=${game.title}`} styles={`${style.modal_btn}`}>
              Play game
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

Detail.propTypes = {
  game: PropTypes.shape({
    title: PropTypes.string.isRequired,
    board: PropTypes.shape({
      url: PropTypes.string.isRequired,
      artist: PropTypes.string.isRequired,
    }).isRequired,
    targets: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        sprite: PropTypes.shape({
          url: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};
