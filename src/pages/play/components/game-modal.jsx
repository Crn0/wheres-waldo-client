import PropTypes from 'prop-types';
import { useRef } from 'react';
import useOnClickOutside from '../../../hooks/use-onclickoutside';
import helpers from '../helpers';
import style from './css/game-modal.module.css';

export default function GameModal({ done, modalState, setModalState, children }) {
  const ref = useRef();
  const styleObj = {
    position: modalState.position,
    zIndex: modalState.zIndex,
    top: modalState.top,
    left: modalState.left,
    padding: modalState.padding,
  };

  const close = helpers.handleCloseModal(setModalState);

  useOnClickOutside(ref, close, done);

  return (
    <dialog ref={ref} open={modalState.on} className={`${style.modal}`} style={styleObj}>
      {children}
    </dialog>
  );
}

GameModal.propTypes = {
  done: PropTypes.bool,
  modalState: PropTypes.shape({
    on: PropTypes.bool.isRequired,
    position: PropTypes.string.isRequired,
    zIndex: PropTypes.number.isRequired,
    top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
  setModalState: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element])
    .isRequired,
};
