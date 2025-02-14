import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import GameDetail from '.';
import dataTest from './data-test';
import sleep from '../../helpers/sleep';

const mockLoader = vi.fn();

const mockGetGame = (() => ({
  res: async (data, delay = 1000) => {
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

const routes = [
  {
    path: '/game/:title',
    loader: mockLoader,
    element: <GameDetail />,
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe.only('Game detail route', () => {
  it('renders a spinner when the data is fetching', async () => {
    mockLoader.mockImplementation(async () => {
      const game = mockGetGame.res(dataTest.game, 0);

      return { game };
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/game/dragon-island'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  it('renders the game detail, header and footer on a successful fetch', async () => {
    mockLoader.mockImplementation(async () => {
      const game = mockGetGame.res(dataTest.game, 0);

      return { game };
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/game/dragon-island'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText(/dragon-island/)).toBeInTheDocument();

      dataTest.game.targets.forEach((target) => {
        expect(screen.getByAltText(target.name)).toBeInTheDocument();
      });
    });
  });
});
