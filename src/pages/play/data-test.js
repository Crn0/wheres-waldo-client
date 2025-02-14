const board = {
  url: 'https://res.cloudinary.com/dhtzg8kkq/image/upload/v1739172513/dev/wheres_waldo/dragon-island/dragon-island-wheres-waldo_lwnw1r.webp',
  artist: '@gozz_sss',
};

const targets = [
  {
    id: 1,
    name: 'raft-man',
    sprite: {
      url: 'https://res.cloudinary.com/dhtzg8kkq/image/upload/v1739172514/dev/wheres_waldo/dragon-island/raft-man_i1jqdl.png',
      artist: '@gozz_sss',
    },
  },
  {
    id: 2,
    name: 'cats',
    sprite: {
      url: 'https://res.cloudinary.com/dhtzg8kkq/image/upload/v1739172516/dev/wheres_waldo/dragon-island/cats_mwtwa7.png',
      artist: '@gozz_sss',
    },
  },
  {
    id: 3,
    name: 'sleeping-dragon',
    sprite: {
      url: 'https://res.cloudinary.com/dhtzg8kkq/image/upload/v1739172516/dev/wheres_waldo/dragon-island/sleeping-dragon_xx697n.png',
      artist: '@gozz_sss',
    },
  },
];

const game = {
  board,
  targets,
  id: 1,
  title: 'dragon-island',
};

const gameSession = {
  id: 1,
  sessionStart: '2025-02-11T07:24:01.831Z',
  sessionEnd: null,
  game: {
    id: 1,
    title: 'dragon-island',
    board: {
      name: 'dragon-island-wheres-waldo',
      url: 'https://res.cloudinary.com/dhtzg8kkq/image/upload/v1739172513/dev/wheres_waldo/dragon-island/dragon-island-wheres-waldo_lwnw1r.webp',
      artist: '@gozz_sss',
    },
  },
  sessionCharacters: [
    {
      id: 1,
      name: 'raft-man',
      found: false,

      sprite: {
        url: 'https://res.cloudinary.com/dhtzg8kkq/image/upload/v1739172514/dev/wheres_waldo/dragon-island/raft-man_i1jqdl.png',
        artist: '@gozz_sss',
      },
    },
    {
      id: 2,
      name: 'cats',
      found: false,

      sprite: {
        url: 'https://res.cloudinary.com/dhtzg8kkq/image/upload/v1739172516/dev/wheres_waldo/dragon-island/cats_mwtwa7.png',
        artist: '@gozz_sss',
      },
    },
    {
      id: 3,
      name: 'sleeping-dragon',
      found: false,
      sprite: {
        url: 'https://res.cloudinary.com/dhtzg8kkq/image/upload/v1739172516/dev/wheres_waldo/dragon-island/sleeping-dragon_xx697n.png',
        artist: '@gozz_sss',
      },
    },
  ],
  player: { id: 1 },
};

export default {
  gameSession,
  game,
  board,
  targets,
};
