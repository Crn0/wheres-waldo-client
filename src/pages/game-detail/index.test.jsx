import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import GameDetail from '.';
import ApiError from '../../errors/api-error';
import dataTest from './data-test';

const mockLoader = vi.fn();

const mockGetGame = (() => ({
  res: async (delay = 1000, error = null, data = dataTest.game) => {
    await new Promise((res) => {
      setTimeout(res, delay);
    });

    return new Promise((res, _) => {
      res([error, data]);
    });
  },
  rej: async (error, delay = 1000) => {
    await new Promise((_, rej) => {
      setTimeout(rej, delay);
    });

    return new Promise((_, rej) => {
      rej(error);
    });
  },
}))();

const routes = [
  {
    path: '/game/:title',
    loader: mockLoader,
    element: <GameDetail />,
  },
];

describe.only('Game detail route', () => {
  it('renders a spinner when the data is fetching', async () => {
    mockLoader.mockImplementation(async () => {
      const game = mockGetGame.res(0);

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
      const game = mockGetGame.res(0);

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
