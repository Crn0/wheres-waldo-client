import PropTypes from 'prop-types';
import Spinner from './spinner';
import style from './css/button.module.css';

export default function Button({
  type,
  size,
  onClick,
  children,
  testId,
  styles = '',
  isLoading = false,
  disabled = false,
}) {
  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={`${style.btn} ${style[`btn__${size}`]} ${styles}`}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {(() => {
        if (isLoading) return <Spinner />;

        return children;
      })()}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  styles: PropTypes.string,
  disabled: PropTypes.bool,
  testId: PropTypes.string,
  isLoading: PropTypes.bool,
};
