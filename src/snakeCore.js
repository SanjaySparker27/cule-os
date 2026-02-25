export const GRID_ROWS = 20;
export const GRID_COLS = 20;

export const DIRECTION = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

const OPPOSITE = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

function sameCell(a, b) {
  return a.row === b.row && a.col === b.col;
}

export function randomFoodCell(rows, cols, snake, rng = Math.random) {
  const freeCells = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const occupied = snake.some((segment) => segment.row === row && segment.col === col);
      if (!occupied) {
        freeCells.push({ row, col });
      }
    }
  }

  if (freeCells.length === 0) return null;

  const index = Math.floor(rng() * freeCells.length);
  return freeCells[index];
}

export function createInitialState(rows = GRID_ROWS, cols = GRID_COLS, rng = Math.random) {
  const middleRow = Math.floor(rows / 2);
  const middleCol = Math.floor(cols / 2);

  const snake = [
    { row: middleRow, col: middleCol },
    { row: middleRow, col: middleCol - 1 },
    { row: middleRow, col: middleCol - 2 },
  ];

  return {
    rows,
    cols,
    snake,
    direction: 'right',
    nextDirection: 'right',
    food: randomFoodCell(rows, cols, snake, rng),
    score: 0,
    isAlive: true,
  };
}

export function setDirection(state, requestedDirection) {
  if (!state.isAlive) return state;
  if (!DIRECTION[requestedDirection]) return state;
  if (requestedDirection === OPPOSITE[state.direction]) return state;

  return {
    ...state,
    nextDirection: requestedDirection,
  };
}

export function advanceState(state, rng = Math.random) {
  if (!state.isAlive) return state;

  const direction = state.nextDirection;
  const vector = DIRECTION[direction];
  const head = state.snake[0];
  const nextHead = {
    row: head.row + vector.row,
    col: head.col + vector.col,
  };

  const hitsWall =
    nextHead.row < 0 ||
    nextHead.row >= state.rows ||
    nextHead.col < 0 ||
    nextHead.col >= state.cols;

  if (hitsWall) {
    return {
      ...state,
      direction,
      isAlive: false,
    };
  }

  const willGrow = state.food && sameCell(nextHead, state.food);
  const collisionBody = willGrow ? state.snake : state.snake.slice(0, -1);
  const hitsSnake = collisionBody.some((segment) => sameCell(segment, nextHead));

  if (hitsSnake) {
    return {
      ...state,
      direction,
      isAlive: false,
    };
  }

  const movedSnake = [nextHead, ...state.snake];
  if (!willGrow) movedSnake.pop();

  return {
    ...state,
    snake: movedSnake,
    direction,
    nextDirection: direction,
    food: willGrow ? randomFoodCell(state.rows, state.cols, movedSnake, rng) : state.food,
    score: willGrow ? state.score + 1 : state.score,
    isAlive: true,
  };
}
