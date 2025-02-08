import Client from '../../api/client';
import Service from './game-service';
import APIError from '../../errors/api-error';
import FieldError from '../../errors/field-error';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new Client(BASE_URL);

const service = Service(client);

const getGame = async (request, params) => {
  const { title } = params;

  try {
    const [err, data] = await service.getGame(request, title);

    if (err) throw err;

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

export default function loader({ request, params }) {
  const game = getGame(request, params);

  return { game };
}
