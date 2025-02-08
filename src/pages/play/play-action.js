import { replace } from 'react-router-dom';
import Client from '../../api/client';
import Service from './play-service';
import APIError from '../../errors/api-error';
import FieldError from '../../errors/field-error';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new Client(BASE_URL);

const service = Service(client);

const createGameSession = async (request) => {
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    const gameSesionDTO = {
      title: params.get('game') || 'dragon-island',
    };

    const [err, data] = await service.createGameSession(request, gameSesionDTO);

    if (err) throw err;

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

const checkAnswer = async (request, formData) => {
  try {
    const sessionId = Number(formData.get('sessionId'));

    const characterDTO = {
      characterId: Number(formData.get('characterId')),

      width: Number(formData.get('width')),
      height: Number(formData.get('height')),
      currentX: Number(formData.get('currentX')),
      currentY: Number(formData.get('currentY')),
    };

    const [err, data] = await service.checkAnswer(request, sessionId, characterDTO);

    if (err) throw err;

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

const updateUsername = async (request, formData) => {
  try {
    const playerDTO = {
      id: Number(formData.get('playerId')),
      username: formData.get('username'),
    };

    const [err, _] = await service.updateUsername(request, playerDTO);

    if (err) throw err;

    return replace('/');
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

export default async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'player:update:username') {
    return updateUsername(request, formData);
  }

  if (intent === 'game-session:create') {
    return createGameSession(request);
  }

  return checkAnswer(request, formData);
}
