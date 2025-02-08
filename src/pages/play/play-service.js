import APIError from '../../errors/api-error';
import FieldError from '../../errors/field-error';

export default function Service(client) {
  const createGameSession = async (request, gameSesionDTO) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [err, data] = await client.callApi(
        `games/${gameSesionDTO.title}/game-sessions`,
        'POST',
        headers,
        {},
        request,
      );

      if (err) throw err;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError || e instanceof FieldError) return [e, null];
      throw e;
    }
  };

  const getSession = async (request) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [err, data] = await client.callApi(
        'game-sessions/current-game',
        'GET',
        headers,
        null,
        request,
      );

      if (err) throw err;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError || e instanceof FieldError) return [e, null];
      throw e;
    }
  };

  const getGame = async (request, dataDto) => {
    try {
      const headers = new Headers();

      const { title } = dataDto;

      headers.append('Content-Type', 'application/json');

      const [err, data] = await client.callApi(`games/${title}`, 'GET', headers, null, request);

      if (err) throw err;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError || e instanceof FieldError) return [e, null];

      throw e;
    }
  };

  const checkAnswer = async (request, sessionId, characterDTO) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [err, data] = await client.callApi(
        `game-sessions/${sessionId}/answer`,
        'POST',
        headers,
        characterDTO,
        request,
      );

      if (err) throw err;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError || e instanceof FieldError) return [e, null];
      throw e;
    }
  };

  const updateUsername = async (request, playerDTO) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [err, data] = await client.callApi(
        `players/${playerDTO.id}`,
        'PUT',
        headers,
        playerDTO,
        request,
      );

      if (err) throw err;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError || e instanceof FieldError) return [e, null];

      throw e;
    }
  };

  return Object.freeze({
    createGameSession,
    getSession,
    getGame,
    checkAnswer,
    updateUsername,
  });
}
