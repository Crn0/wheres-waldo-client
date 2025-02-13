import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Card from './game-card';
import dataTest from '../data-test';

describe('Game card', () => {
  it('renders the game image', async () => {
    const { container } = render(
      <MemoryRouter>
        <Card game={dataTest.gameList[0]} />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
