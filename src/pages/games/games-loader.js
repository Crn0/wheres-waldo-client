import Client from '../../api/client';
import Service from './games-service';
import APIError from '../../errors/api-error';
import FieldError from '../../errors/field-error';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new Client(BASE_URL);

const service = Service(client);

const gameList = async (request) => {
  try {
    const [err, data] = await service.getGames(request);

    if (err) throw err;

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

export default function loader({ request }) {
  const games = gameList(request);

  return { games };
}
