import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Form, useActionData, useNavigation } from 'react-router-dom';
import { ImLocation } from 'react-icons/im';
import GameModal from './game-modal';
import Input from '../../../components/ui/input';
import TargetInput from './target-input';
import helpers from '../helpers';
import style from './css/game-board.module.css';

export default function GameBoard({ gameSession, targets, setTargets, allTargetsAreFound }) {
  const actionData = useActionData();
  const navigation = useNavigation();
  const formRef = useRef();
  const boardRef = useRef();
  const [characterId, setCharacterId] = useState('');
  const [modalState, setModalState] = useState({
    on: false,
    position: 'absolute',
    zIndex: 10,
    top: 0,
    left: 0,
    padding: '2rem',
  });

  const [position, setPosition] = useState({
    width: 0,
    height: 0,
    currentX: 0,
    currentY: 0,
  });

  const [errorState, setErrorState] = useState({
    error: false,
    on: false,
  });

  const isSubmitting = navigation.state === 'submitting';
  const characterError = actionData?.[0];

  const handleModalState = helpers.handleModalState(setModalState, allTargetsAreFound);
  const handleGuessAnwser = helpers.handleGuessAnwser(setPosition);
  const handleImageClick = helpers.handleImageClick(setCharacterId, setErrorState);

  useEffect(() => {
    if (allTargetsAreFound) {
      setModalState((prev) => ({ ...prev, on: false }));
    }

    if (actionData) {
      if (actionData[1]) {
        setTargets((prev) =>
          prev.map((target) => (target.id === actionData[1].id ? { ...actionData[1] } : target)),
        );
      }
    }

    if (errorState.hasError === true) {
      const id = setTimeout(() => {
        setErrorState({ hasError: false, on: false });
      }, 2000);
      return () => clearTimeout(id);
    }

    if (!actionData?.[1] && actionData?.[0] && errorState.on) {
      setErrorState((prev) => ({ ...prev, hasError: true }));
    }

    return () => {};
  }, [allTargetsAreFound, actionData, setTargets, errorState, navigation.state]);

  return (
    <div className={`${style.board}`}>
      {!actionData?.[1] && navigation.state !== 'submitting' && errorState.hasError === true && (
        <div className={`${style.character_error}`}>
          <p>{characterError?.message}</p>
        </div>
      )}
      <GameModal done={allTargetsAreFound} modalState={modalState} setModalState={setModalState}>
        <Form
          method='POST'
          ref={formRef}
          className={`${style.grid} ${style.grid_center} ${style.gap_1rem}`}
        >
          <Input type='hidden' name='sessionId' value={gameSession.id} autoComplete='off' />
          <Input type='hidden' name='characterId' value={characterId} autoComplete='off' />
          <Input type='hidden' name='width' value={position.width} autoComplete='off' />
          <Input type='hidden' name='height' value={position.height} autoComplete='off' />
          <Input type='hidden' name='currentX' value={position.currentX} autoComplete='off' />
          <Input type='hidden' name='currentY' value={position.currentY} autoComplete='off' />
          {targets?.map((target) => (
            <TargetInput
              key={target.id}
              target={target}
              onClick={handleImageClick}
              isSubmitting={isSubmitting}
            />
          ))}
        </Form>
      </GameModal>
      <div
        className={`${style.board_img}`}
        style={{ position: 'relative' }}
        role='button'
        aria-label='board'
        tabIndex={0}
        onKeyDown={() => {}}
        onClick={(e) => {
          handleModalState(e);
          handleGuessAnwser(e);
        }}
      >
        <img
          ref={boardRef}
          src={gameSession.game.board.url}
          alt={gameSession.game.title}
          style={{ position: 'relative' }}
        />
        {targets?.map((target) => {
          if (!boardRef.current) return null;
          if (!target.found || !target.coordinates) return null;

          const rect = boardRef.current.getBoundingClientRect();
          const { width, height } = rect;
          const { normalizedX, normalizedY } = target.coordinates;
          const top = Math.floor(normalizedY * height) - 7;
          const left = Math.floor(normalizedX * width);
          return (
            <div
              key={target.id}
              style={{
                top: top - 30,
                left: left - 42,
                position: 'absolute',
                padding: '2rem',
              }}
            >
              <ImLocation color='red' size='1rem' />
            </div>
          );
        })}
      </div>
    </div>
  );
}

GameBoard.propTypes = {
  gameSession: PropTypes.shape({
    id: PropTypes.number.isRequired,
    player: PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired,
    game: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      board: PropTypes.shape({
        url: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    sessionCharacters: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        found: PropTypes.bool.isRequired,
        sprite: PropTypes.shape({
          url: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    ),
  }),
  targets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      found: PropTypes.bool.isRequired,
      sprite: PropTypes.shape({
        url: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  ),
  setTargets: PropTypes.func.isRequired,
  allTargetsAreFound: PropTypes.bool,
};
