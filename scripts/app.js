const grid = document.querySelector('.grid');
const blackScore = document.querySelector('.black-score');
const whiteScore = document.querySelector('.white-score');
const gameMessage = document.querySelector('.game-message');
const blackCircle = document.querySelector('.black-score-circle');
const whiteCircle = document.querySelector('.white-score-circle');
const instructionsButton = document.querySelector('.instructions');
const resetButton = document.querySelector('.reset');

const length = 8;

let counter = 1;
let player = counter % 2 === 0 ? 'w' : 'b';

let cells = [];

const coordsToIndex = (x, y) => {
  if (x >= 0 && x < 8 && y >= 0 && y < 8) {
    return x + y * length;
  } else {
    console.log('invalid coords', x, y);
  }
};

const getSquareForCoords = (x, y) => {
  let index = coordsToIndex(x, y);
  return cells[index];
};

const isOnBoard = (x, y) => {
  return x >= 0 && y >= 0 && x < 8 && y < 8;
};

const checkIsValidMove = (currentPlayer, x, y) => {
  const clickedSquare = getSquareForCoords(x, y);
  if (clickedSquare.disc !== null) {
    return false;
  }

  const directions = [
    { x: -1, y: 0 }, // left
    { x: 1, y: 0 }, // right
    { x: 0, y: -1 }, // up
    { x: 0, y: 1 }, // down
    { x: -1, y: -1 }, // up-left
    { x: 1, y: -1 }, // up-right
    { x: -1, y: 1 }, // down-left
    { x: 1, y: 1 }, // down-right
  ];

  const validDirections = directions.filter((direction) => {
    let hasFoundOpponentDisc = false;

    let currentX = x + direction.x;
    let currentY = y + direction.y;

    while (isOnBoard(currentX, currentY)) {
      const square = getSquareForCoords(currentX, currentY);

      // no disc
      if (square.disc === null) {
        return false;
      }

      // players disc
      if (square.disc === currentPlayer) {
        // valid move if player has trapped an opponent's disc
        return hasFoundOpponentDisc;
      }

      // opponent's disc
      if (square.disc !== currentPlayer) {
        hasFoundOpponentDisc = true;
      }

      currentX = currentX + direction.x;
      currentY = currentY + direction.y;
    }

    return false;
  });

  // the move is valid if there is at least one direction that captures a disc!
  return validDirections.length > 0;
};

const flipDiscs = (currentPlayer, x, y) => {
  const directions = [
    { x: -1, y: 0 }, // left
    { x: 1, y: 0 }, // right
    { x: 0, y: -1 }, // up
    { x: 0, y: 1 }, // down
    { x: -1, y: -1 }, // up-left
    { x: 1, y: -1 }, // up-right
    { x: -1, y: 1 }, // down-left
    { x: 1, y: 1 }, // down-right
  ];

  const validDirections = directions.filter((direction) => {
    let hasFoundOpponentDisc = false;

    let currentX = x + direction.x;
    let currentY = y + direction.y;

    while (isOnBoard(currentX, currentY)) {
      const square = getSquareForCoords(currentX, currentY);

      if (square.disc === null) {
        return false;
      }

      if (square.disc === currentPlayer) {
        return hasFoundOpponentDisc;
      }

      if (square.disc !== currentPlayer) {
        hasFoundOpponentDisc = true;
      }

      currentX = currentX + direction.x;
      currentY = currentY + direction.y;
    }

    return false;
  });

  validDirections.forEach((item) => {
    let targetX = x + item.x;
    let targetY = y + item.y;
    while (isOnBoard(targetX, targetY)) {
      const square = getSquareForCoords(targetX, targetY);

      if (square.disc !== currentPlayer && square.disc !== null) {
        if (currentPlayer === 'b') {
          square.disc = 'b';
          square.discElement.classList.remove('white-disc');
          square.discElement.classList.add('black-disc');
        } else {
          square.disc = 'w';
          square.discElement.classList.remove('black-disc');
          square.discElement.classList.add('white-disc');
        }
      } else {
        return;
      }

      targetX = targetX + item.x;
      targetY = targetY + item.y;
    }
  });
};

const onClick = (x, y) => {
  console.log('you clicked', x, y);
  const index = coordsToIndex(x, y);

  if (checkIsValidMove(player, x, y)) {
    createDisc(player, index);

    flipDiscs(player, x, y);

    player = counter % 2 === 0 ? 'w' : 'b';

    if (player === 'b') {
      gameMessage.innerText = "Player 1's turn";
      whiteCircle.classList.remove('pulsing-white-circle');
      blackCircle.classList.add('pulsing-black-circle');
    }

    if (player === 'w') {
      gameMessage.innerText = "Player 2's turn";
      blackCircle.classList.remove('pulsing-black-circle');
      whiteCircle.classList.add('pulsing-white-circle');
    }

    updateScores();

    updateValidCells();
  }
};

const createBoard = () => {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const index = coordsToIndex(x, y);
      const element = document.createElement('div');
      grid.appendChild(element);

      element.onclick = () => {
        onClick(x, y);
      };

      const square = {
        x: x,
        y: y,
        disc: null,
        element: element,
        discElement: null,
      };

      cells[index] = square;
    }
  }

  createDisc('b', 27);
  createDisc('b', 36);
  createDisc('w', 28);
  createDisc('w', 35);
};

const createDisc = (color, index) => {
  const discElement = document.createElement('div');
  discElement.classList.add('disc');
  cells[index].disc = color;
  if (color === 'b') {
    discElement.classList.add('black-disc');
  } else {
    discElement.classList.add('white-disc');
  }
  cells[index].element.appendChild(discElement);
  cells[index].discElement = discElement;

  counter++;
};

createBoard();

const updateValidCells = () => {
  for (const cell of cells) {
    const isValid = checkIsValidMove(player, cell.x, cell.y);

    if (isValid) {
      cell.element.classList.add('valid-cell');
    } else {
      cell.element.classList.remove('valid-cell');
    }
  }

  const validCells = cells.filter((cell) => {
    if (checkIsValidMove(player, cell.x, cell.y)) {
      return true;
    }
  });

  if (validCells.length > 0) {
    return true;
  } else if (isGameOver()) {
    whiteCircle.classList.remove('pulsing-white-circle');
    blackCircle.classList.remove('pulsing-black-circle');
    const winner = findWinner();
    if (winner === null) {
      gameMessage.innerText = "Game over! It's a tie!";
    } else if (winner === 'b') {
      gameMessage.innerText = 'Game over! Player 1 wins!';
    } else {
      gameMessage.innerText = 'Game over! Player 2 wins!';
    }
  } else {
    counter++;

    player = counter % 2 === 0 ? 'w' : 'b';

    if (player === 'b') {
      gameMessage.innerText = "Player 1's turn";
    }

    if (player === 'w') {
      gameMessage.innerText = "Player 2's turn";
    }
    updateValidCells();
  }
};

updateValidCells();

const isGameOver = () => {
  const validCells = cells.filter((cell) => {
    if (checkIsValidMove('b', cell.x, cell.y)) {
      return true;
    }

    if (checkIsValidMove('w', cell.x, cell.y)) {
      return true;
    }

    return false;
  });

  if (validCells.length > 0) {
    return false;
  }
  return true;
};

const updateScores = () => {
  const blackDiscs = cells.filter((cell) => {
    return cell.disc === 'b';
  });

  const numberOfBlackDiscs = blackDiscs.length;
  blackScore.innerText = numberOfBlackDiscs;

  const whiteDiscs = cells.filter((cell) => {
    return cell.disc === 'w';
  });

  const numberOfWhiteDiscs = whiteDiscs.length;
  whiteScore.innerText = numberOfWhiteDiscs;
};

const findWinner = () => {
  const blackDiscs = cells.filter((cell) => {
    return cell.disc === 'b';
  });
  const numberOfBlackDiscs = blackDiscs.length;

  const whiteDiscs = cells.filter((cell) => {
    return cell.disc === 'w';
  });
  const numberOfWhiteDiscs = whiteDiscs.length;

  if (numberOfBlackDiscs > numberOfWhiteDiscs) {
    return 'b';
  }

  if (numberOfWhiteDiscs > numberOfBlackDiscs) {
    return 'w';
  }

  return null;
};

const toggleInstructions = () => {
  const howToPlay = document.querySelector('.how-to-play');
  if (howToPlay.style.display === 'none') {
    howToPlay.style.display = 'block';
  } else {
    howToPlay.style.display = 'none';
  }
};

instructionsButton.addEventListener('click', toggleInstructions);

const reset = () => {
  console.log('reset');
  for (const cell of cells) {
    cell.disc = null;
    cell.element.classList.remove('valid-cell');

    if (cell.discElement) {
      cell.element.removeChild(cell.discElement);
      cell.discElement = null;
    }
  }
  counter = 1;
  player = counter % 2 === 0 ? 'w' : 'b';

  gameMessage.innerText = "Player 1's turn";

  whiteCircle.classList.remove('pulsing-white-circle');
  blackCircle.classList.add('pulsing-black-circle');

  createDisc('b', 27);
  createDisc('b', 36);
  createDisc('w', 28);
  createDisc('w', 35);

  updateScores();
};

resetButton.addEventListener('click', reset);
