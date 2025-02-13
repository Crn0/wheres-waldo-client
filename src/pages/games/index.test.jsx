import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Games from '.';
import dataTest from './data-test';

const mockLoader = vi.fn();

const mockGetGames = (() => ({
  res: async (delay = 1000, error = null, data = dataTest.gameList) => {
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
    path: '/',
    children: [
      {
        index: true,
        loader: mockLoader,
        element: <Games />,
      },
    ],
  },
];

beforeEach(() => {
  mockLoader.mockRestore();
});

describe('Game route', () => {
  it('renders a spinner when the data is fetching', async () => {
    mockLoader.mockImplementation(async () => {
      const games = mockGetGames.res(0);

      return { games };
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  it('renders the game list, header and footer on a successful fetch', async () => {
    mockLoader.mockImplementation(async () => {
      const games = mockGetGames.res(0);

      return { games };
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('dragon-island')).toBeInTheDocument();
      expect(screen.getByText('fake-game')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders an alternate text on a successful fetch but there is no game list in the db', async () => {
    mockLoader.mockImplementation(() => {
      const games = mockGetGames.res(0, null, []);

      return { games };
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText(/There are no games./)).toBeInTheDocument();
    });
  });
});
