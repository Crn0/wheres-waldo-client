import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Games from '.';
import dataTest from './data-test';
import sleep from '../../helpers/sleep';

const mockLoader = vi.fn();

const mockGetGames = (() => ({
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
      const games = mockGetGames.res(dataTest.gameList, 0);

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
      const games = mockGetGames.res(dataTest.gameList, 0);

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
      const games = mockGetGames.res([], 0);

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
