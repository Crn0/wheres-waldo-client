import PropTypes from 'prop-types';
import style from './css/target-input.module.css';

export default function TargetInput({ target, onClick, isSubmitting }) {
  return (
    <div className={`${style.img_target}`}>
      {(() => {
        if (!target.found) return null;

        return <div className={`${style.cross}`} />;
      })()}

      <input
        key={target.id}
        src={target.sprite.url}
        alt={target.name}
        className={`${target.found ? style.found : ''}`}
        type='image'
        value={target.id}
        name={target.name}
        onClick={() => onClick(target.id)}
        disabled={target.found || isSubmitting}
        autoComplete='off'
        width='48'
        height='48'
      />
    </div>
  );
}

TargetInput.propTypes = {
  target: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    found: PropTypes.bool.isRequired,
    sprite: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};
