import Client from '../../api/client';
import Service from './play-service';
import APIError from '../../errors/api-error';
import FieldError from '../../errors/field-error';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new Client(BASE_URL);

const service = Service(client);

const getSession = async (request) => {
  try {
    const [err, data] = await service.getSession(request);

    if (err) throw err;

    // await new Promise((res) => setTimeout(res, 100000));

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

const getGame = async (request, searchParams) => {
  const dataDTO = {
    title: searchParams.get('game') || 'dragon-island',
  };

  try {
    const [err, data] = await service.getGame(request, dataDTO);

    if (err) throw err;

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

export default async function loader({ request }) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const currentGameData = await getGame(request, searchParams);
  const gameSessionData = getSession(request);

  return { gameSessionData, currentGameData };
}
