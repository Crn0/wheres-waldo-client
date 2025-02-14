import { DateTime } from 'luxon';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeaderBoards from '.';
import dataTest from './date-test';
import sleep from '../../helpers/sleep';

const mockLoader = vi.fn();
let currLeaderBoardId;

const getLeaderBoards = (() => ({
  res: async (delay = 1000, data = dataTest.leaderBoards) => {
    await new Promise((res) => {
      setTimeout(res, delay);
    });

    return new Promise((res, _) => {
      res([null, data]);
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

const getCurrentLeaderBoard = (() => ({
  res: async (id, delay = 1000) => {
    currLeaderBoardId = Number(id);

    try {
      await sleep(delay);

      const leaderBoard = dataTest.leaderBoardScores.reduce(
        (prev, currLeaderBoard) =>
          currLeaderBoard.id === currLeaderBoardId ? currLeaderBoard : prev,
        {},
      );

      return [null, leaderBoard];
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
    path: '/leader-boards',
    loader: mockLoader,
    element: <LeaderBoards />,
  },
];

beforeEach(() => {
  mockLoader.mockRestore();
});

describe('Game route', () => {
  it('renders a spinner when the data is fetching', async () => {
    mockLoader.mockImplementation(async () => {
      const leaderBoards = getLeaderBoards.res(0);

      return { leaderBoards };
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/leader-boards'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  it('renders the leader-board list, header and footer on a successful fetch', async () => {
    mockLoader.mockImplementation(async () => {
      const leaderBoards = getLeaderBoards.res(0);

      return { leaderBoards };
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/leader-boards'],
      initialIndex: 1,
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByAltText('dragon-island')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  it('renders the leader-board data when the user clicked the leader-board button', async () => {
    mockLoader.mockImplementation(async ({ request }) => {
      const url = new URL(request.url);
      const searchUrl = new URLSearchParams(url.search);
      const intent = searchUrl.get('intent');

      if (intent === 'leader_board:get:current') {
        return getCurrentLeaderBoard.res(searchUrl.get('leaderBoardId'), 0);
      }

      return { leaderBoards: getLeaderBoards.res(0) };
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ['/leader-boards'],
      initialIndex: 1,
    });

    const { user } = setup(router);

    await waitFor(async () => {
      await user.click(screen.getByAltText('dragon-island'));

      const leaderBoard = dataTest.leaderBoardScores.reduce(
        (prev, currLeaderBoard) =>
          currLeaderBoard.id === Number(currLeaderBoardId) ? currLeaderBoard : prev,
        {},
      );

      const hash = {};

      leaderBoard.players.forEach((ply) => {
        Object.values(ply).forEach((val, i) => {
          if (!hash[val] && i !== 0) {
            hash[val] = true;
          }
        });
      });

      leaderBoard.players.forEach((player) => {
        const date = DateTime.fromISO(player?.sessionStart);
        const score = `${player.time}s`;
        const sessionStart = date.toLocaleString(DateTime.DATE_MED);
        const { username } = player;

        if (hash[player.time]) {
          const scoreTexts = screen.getAllByText(score);

          expect(scoreTexts).toHaveLength(scoreTexts.length);
        } else {
          expect(screen.getByText(score)).toBeInTheDocument();
        }

        if (hash[player.sessionStart]) {
          const sessionStartTexts = screen.getAllByText(sessionStart);

          expect(sessionStartTexts).toHaveLength(sessionStartTexts.length);
        } else {
          expect(screen.getByText(sessionStart)).toBeInTheDocument();
        }

        if (hash[username]) {
          const usernameTexts = screen.getAllByText(username);

          expect(usernameTexts).toHaveLength(usernameTexts.length);
        } else {
          expect(screen.getByText(username)).toBeInTheDocument();
        }
      });
    });
  });
});
