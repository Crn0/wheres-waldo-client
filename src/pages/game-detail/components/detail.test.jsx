import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Detail from './detail';
import dataTest from '../data-test';

describe('Detail', () => {
  it('renders the game information', async () => {
    const { game } = dataTest;

    const { container } = render(
      <MemoryRouter>
        <Detail game={game} />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
