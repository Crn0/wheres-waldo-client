import Client from '../../api/client';
import Service from './leader-board-service';
import APIError from '../../errors/api-error';
import FieldError from '../../errors/field-error';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new Client(BASE_URL);

const service = Service(client);

const getLeaderBoards = async (request) => {
  try {
    const [err, data] = await service.getLeaderBoards(request);

    if (err) throw err;

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];
    throw e;
  }
};

const getCurrentLeaderBoard = async (request, id) => {
  try {
    const [err, data] = await service.getLeaderBoardById(request, id);

    if (err) throw err;

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];
    throw e;
  }
};

export default async function loader({ request }) {
  const url = new URL(request.url);
  const searchUrl = new URLSearchParams(url.search);
  const intent = searchUrl.get('intent');

  if (intent === 'leader_board:get:current') {
    return getCurrentLeaderBoard(request, searchUrl.get('leaderBoardId'));
  }

  return {
    leaderBoards: getLeaderBoards(request),
  };
}
