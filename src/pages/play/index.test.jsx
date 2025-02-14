import { DateTime } from 'luxon';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Play from '.';
import dataTest from './data-test';
import sleep from '../../helpers/sleep';
import APIError from '../../errors/api-error';

const mockLoader = vi.fn();
const mockAction = vi.fn();

const getSession = (() => ({
  res: async (data, delay = 3000) => {
    try {
      await sleep(delay);

      return [null, data];
    } catch (e) {
      return [e, null];
    }
  },
  rej: async (error, delay = 1000) => {
    try {
      await sleep(delay);

      throw error;
    } catch (e) {
      return [e, null];
    }
  },
}))();

const getGame = (() => ({
  res: async (data, delay = 3000) => {
    try {
      await sleep(delay);

      return [null, data];
    } catch (e) {
      return [e, null];
    }
  },
  rej: async (error, delay = 1000) => {
    try {
      await sleep(delay);

      throw error;
    } catch (e) {
      return [e, null];
    }
  },
}))();

const createSession = (() => ({
  res: async (data, delay = 3000) => {
    try {
      await sleep(delay);

      return [null, data];
    } catch (e) {
      return [e, null];
    }
  },
  rej: async (error, delay = 1000) => {
    try {
      await sleep(delay);

      throw error;
    } catch (e) {
      return [e, null];
    }
  },
}))();

const checkAnswer = (() => ({
  res: async (id, delay = 3000) => {
    try {
      await sleep(delay);

      const foundTarget = dataTest.gameSession.sessionCharacters.reduce(
        (prev, target) => (target.id === id ? { ...target, found: true } : prev),
        {},
      );

      return [null, foundTarget];
    } catch (e) {
      return [e, null];
    }
  },
  rej: async (error, delay = 1000) => {
    try {
      await sleep(delay);

      throw error;
    } catch (e) {
      return [e, null];
    }
  },
}))();

const setup = (router) => ({
  user: userEvent.setup(),
  ...render(<RouterProvider router={router} />),
});

const routes = [
  {
    path: '/play',
    loader: mockLoader,
    action: mockAction,
    element: <Play />,
  },
];

beforeEach(() => {
  vi.resetAllMocks();
});

describe('Play route', () => {
  it('renders a spinner when the data is fetching', async () => {
    mockLoader.mockImplementation(async () => {
      const gameSessionData = await getSession.rej(new APIError('There is no ongoing session'), 0);
      const currentGameData = getGame.res(dataTest.game, 0);

      return { currentGameData, gameSessionData };
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/play'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  it('renders the start game button if there is no ongoing game session', async () => {
    mockLoader.mockImplementation(async () => {
      const gameSessionData = await getSession.rej(new APIError('There is no ongoing session'), 0);
      const currentGameData = getGame.res(dataTest.game, 0);

      return { currentGameData, gameSessionData };
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/play'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId('btn_start')).toBeInTheDocument();
    });
  });

  it('creates a game session when the user clicked the start button', async () => {
    mockLoader.mockImplementation(async () => {
      const gameSessionData = await getSession.rej(new APIError('There is no ongoing session'), 0);
      const currentGameData = getGame.res(dataTest.game, 0);

      return { currentGameData, gameSessionData };
    });
    mockAction.mockImplementation(async () => createSession.res(dataTest.gameSession, 0));

    const router = createMemoryRouter(routes, {
      initialEntries: ['/play'],
      initialIndex: 1,
    });

    const { user } = setup(router);

    await waitFor(async () => {
      await user.click(screen.getByTestId('btn_start'));

      expect(screen.queryByTestId('btn_start')).not.toBeInTheDocument();
      expect(screen.getByAltText(`${dataTest.game.title}_board`)).toBeInTheDocument();

      dataTest.targets.forEach((target) => {
        expect(screen.getAllByAltText(target.name)).toHaveLength(2);
      });
    });
  });

  it('marks the target if the user sends a correct position', async () => {
    mockLoader.mockImplementation(async () => {
      const gameSessionData = await getSession.res(dataTest.gameSession, 0);
      const currentGameData = getGame.res(dataTest.game, 0);

      return { currentGameData, gameSessionData };
    });

    mockAction.mockImplementation(async () => checkAnswer.res(1, 0));

    vi.spyOn(window.HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
      width: 100,
      left: 0,
      right: 100,
      height: 50,
      top: 0,
      bottom: 50,
    }));

    const router = createMemoryRouter(routes, {
      initialEntries: ['/play'],
      initialIndex: 1,
    });

    const { user } = setup(router);

    await waitFor(async () => {
      expect(screen.getByAltText(`${dataTest.game.title}_board`)).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'board',
        }),
      );
      await user.click(screen.getByRole('button', { name: 'raft-man' }));

      const [_, foundTarget] = await checkAnswer.res(1, 0);

      expect(screen.getByTestId(`found_${foundTarget.name}`)).toBeInTheDocument();
    });
  });

  it('renders a error message if the user sends a wrong position', async () => {
    mockLoader.mockImplementation(async () => {
      const gameSessionData = await getSession.res(dataTest.gameSession, 0);
      const currentGameData = getGame.res(dataTest.game, 0);

      return { currentGameData, gameSessionData };
    });

    mockAction.mockImplementation(async () => checkAnswer.rej(new APIError('Invalid position'), 0));

    vi.spyOn(window.HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
      width: 100,
      left: 0,
      right: 100,
      height: 50,
      top: 0,
      bottom: 50,
    }));

    const router = createMemoryRouter(routes, {
      initialEntries: ['/play'],
      initialIndex: 1,
    });

    const { user } = setup(router);

    await waitFor(async () => {
      expect(screen.getByAltText(`${dataTest.game.title}_board`)).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', {
          name: 'board',
        }),
      );

      await user.click(screen.getByRole('button', { name: 'raft-man' }));

      expect(screen.getByText(/Invalid position/)).toBeInTheDocument();
    });
    // error message remove after a set amount of time
    await act(async () => {
      await sleep(2001); // wait *just* a little longer than the timeout in the component
    });

    expect(screen.queryByText(/Invalid position/)).not.toBeInTheDocument();
  });
});
