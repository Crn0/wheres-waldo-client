import PropTypes from 'prop-types';
import style from './css/target.module.css';

export default function Target({ target, children }) {
  return (
    <div className={`${style.img_target} ${target.found ? style.found : ''}`}>
      {(() => {
        if (!target.found) return null;

        return (
          <>
            <div className={`${style.diag} ${style.diag_1}`} />
            <div className={`${style.diag} ${style.diag_2}`} />
          </>
        );
      })()}
      <img src={`${target.sprite.url}`} alt={`${target.name}`} />
      {children}
    </div>
  );
}

Target.propTypes = {
  target: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    found: PropTypes.bool,
    sprite: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
};
