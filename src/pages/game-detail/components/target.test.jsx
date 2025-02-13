import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Target from './target';
import dataTest from '../data-test';

describe('Target', () => {
  it('renders the game information', async () => {
    const target = { ...dataTest.targets[0] };

    const { container } = render(
      <MemoryRouter>
        <Target target={target} />
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
