console.log('working');

const grid = document.querySelector('.grid');

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

      // No disc
      if (square.disc === null) {
        return false;
      }

      // Our disc
      if (square.disc === currentPlayer) {
        // Valid move if we have trapped another player's disc
        return hasFoundOpponentDisc;
      }

      // Their disc
      if (square.disc !== currentPlayer) {
        hasFoundOpponentDisc = true;
      }

      currentX = currentX + direction.x;
      currentY = currentY + direction.y;
    }

    return false;
  });

  // The move is valid if there is at least one direction that captures a disc!
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

      // No disc
      if (square.disc === null) {
        return false;
      }

      // Our disc
      if (square.disc === currentPlayer) {
        // Valid move if we have trapped another player's disc
        return hasFoundOpponentDisc;
      }

      // Their disc
      if (square.disc !== currentPlayer) {
        hasFoundOpponentDisc = true;
      }

      currentX = currentX + direction.x;
      currentY = currentY + direction.y;
    }

    return false;
  });

  console.log(validDirections);

  validDirections.forEach((item) => {
    let targetX = x + item.x;
    let targetY = y + item.y;
    while (isOnBoard(targetX, targetY)) {
      const square = getSquareForCoords(targetX, targetY);

      if (square.disc !== currentPlayer && square.disc !== null) {
        if (currentPlayer === 'b') {
          square.disc = 'b';
          square.discElement.innerText = 'b';
          square.discElement.classList.remove('white-disc');
          square.discElement.classList.add('black-disc');
        } else {
          square.disc = 'w';
          square.discElement.innerText = 'w';
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
  let square = getSquareForCoords(x, y);
  let index = coordsToIndex(x, y);
  console.log('you clicked', square);

  if (checkIsValidMove(player, x, y)) {
    createDisc(player, index);

    flipDiscs(player, x, y);

    console.log('counter', counter);
    player = counter % 2 === 0 ? 'w' : 'b';
    console.log('next player', player);

    updateValidCells();
  }
};

const createBoard = () => {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const index = coordsToIndex(x, y);
      const element = document.createElement('div');
      element.innerText = index;
      grid.appendChild(element);

      element.onclick = () => {
        onClick(x, y);
      };

      const square = {
        x: x,
        y: y,
        disc: null,
        element: element,
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
  discElement.innerText = color;
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
