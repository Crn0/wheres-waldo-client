import PropTypes from 'prop-types';
import style from './css/target.module.css';

export default function Target({ target }) {
  return (
    <div className={`${style.flex} ${style.items_center} ${style.gap_1}`}>
      <div className={`${style.img_target}`}>
        <img src={`${target.sprite.url}`} alt={`${target.name}`} />
      </div>
      <span>{target.name}</span>
    </div>
  );
}

Target.propTypes = {
  target: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    sprite: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
