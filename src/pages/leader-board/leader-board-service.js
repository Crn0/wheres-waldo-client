import APIError from '../../errors/api-error';
import FieldError from '../../errors/field-error';

export default function Service(client) {
  const getLeaderBoards = async (request) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [err, data] = await client.callApi('leader-boards', 'GET', headers, null, request);

      if (err) throw err;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError || e instanceof FieldError) return [e, null];
      throw e;
    }
  };

  const getLeaderBoardById = async (request, id) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [err, data] = await client.callApi(
        `leader-boards/${id}`,
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

  return Object.freeze({ getLeaderBoards, getLeaderBoardById });
}
