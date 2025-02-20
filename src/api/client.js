import FieldError from '../errors/field-error';
import APIError from '../errors/api-error';

const httpRequest = async (url, method, headers, dataToSend, signal) => {
  const ifTheRequestHasNoDataToSend = dataToSend === null || dataToSend === undefined;

  if (ifTheRequestHasNoDataToSend) {
    return fetch(url, {
      method,
      signal,
      headers,
      credentials: 'include',
      redirect: 'follow',
    });
  }

  return fetch(url, {
    method,
    signal,
    headers,
    body: JSON.stringify(dataToSend),
    credentials: 'include',
    redirect: 'follow',
  });
};

const fetchApi = async (url, method, headers, dataToSend, signal) => {
  try {
    const responce = await httpRequest(url, method, headers, dataToSend, null, signal);

    if (responce.status === 204) return [null, null];

    const data = await responce.json();

    // redirect the user if the status is 302: found
    if (responce?.status === 302) {
      window.location.href = data.url;
      return [null, null];
    }

    if (data?.code >= 400 && data?.errors?.[0]?.type === 'field') {
      throw new FieldError(data.message, data.errors, data.code);
    }

    if (responce.status === 429) {
      throw new APIError(data.message, data.code);
    }

    if (data?.code >= 400) {
      throw new APIError(data.message, data.code);
    }

    return [null, data];
  } catch (error) {
    if (error instanceof FieldError || error instanceof APIError) return [error, null];

    throw new Error(error);
  }
};

export default class Client {
  #baseURL;

  constructor(baseURL) {
    this.#baseURL = baseURL;

    if (!this.#baseURL.endsWith('/')) {
      this.#baseURL += '/';
    }
  }

  async callApi(path, method, headers, dataToSend, request) {
    const url = `${this.#baseURL}${path}`;

    try {
      const [error, data] = await fetchApi(url, method, headers, dataToSend, request.signal);

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if ((e instanceof APIError && e.code === 401) || e instanceof FieldError) return [e, null];

      throw e;
    }
  }
}
