console.log('working');

const grid = document.querySelector('.grid');

const length = 8;

let counter = 1;
let player = counter % 2 === 0 ? 'w' : 'b';

let gameBoard = [];

const coordsToIndex = (x, y) => {
  if (x >= 0 && x < 8 && y >= 0 && y < 8) {
    return x + y * length;
  } else {
    console.log('invalid coords', x, y);
  }
};

const getSquareForCoords = (x, y) => {
  let index = coordsToIndex(x, y);
  return gameBoard[index];
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

const flipDiscs = () => {};

// const indexToCoords = (index) => {
//   let x = index % length;
//   let y = Math.floor(index / length);
//   return [x, y];
// };

// const placeDisc = (square) => {
//   const playersDisc = currentPlayer;
//   const discElement = document.createElement('div');
//   discElement.innerText = playersDisc;
//   square.element.appendChild(discElement);
//   square.disc = playersDisc;
//   square.discElement = discElement;
//   discElement.classList.add('disc');
//   if (playersDisc === 'b') {
//     discElement.classList.add('black-disc');
//   } else {
//     discElement.classList.add('white-disc');
//   }

//   remainingDiscs--;
//   console.log('remaining discs', remainingDiscs);

//   if (currentPlayer === 'b') {
//     currentPlayer = 'w';
//   } else {
//     currentPlayer = 'b';
//   }
//   console.log('current player', currentPlayer);

//   updateValidMoves();
// };

const onClick = (x, y) => {
  console.log('you clicked', x, y);
  let square = getSquareForCoords(x, y);
  let index = coordsToIndex(x, y);
  console.log('you clicked', square);

  if (checkIsValidMove(player, x, y)) {
    createDisc(player, index);

    console.log(counter);
    player = counter % 2 === 0 ? 'w' : 'b';
    console.log(player);
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

      gameBoard[index] = square;
    }
  }
  createDisc('b', 27);
  createDisc('b', 36);
  createDisc('w', 28);
  createDisc('w', 35);
  createDisc('w', 43);
};

const createDisc = (color, index) => {
  const discElement = document.createElement('div');
  discElement.innerText = color;
  discElement.classList.add('disc');
  gameBoard[index].disc = color;
  if (color === 'b') {
    discElement.classList.add('black-disc');
  } else {
    discElement.classList.add('white-disc');
  }
  gameBoard[index].element.appendChild(discElement);
  gameBoard[index].discElement = discElement;

  counter++;
};

createBoard();

// const checkIsAdjacent = (player, x, y) => {
//   let directions = [
//     [x, y - 1], //N
//     [x + 1, y - 1], //NE
//     [x + 1, y], //E
//     [x + 1, y + 1], //SE
//     [x, y + 1], //S
//     [x - 1, y + 1], //SW
//     [x - 1, y], //W
//     [x - 1, y - 1], //NW
//   ];
//   let directionsWithDisc = directions.filter((p) => {
//     let x = p[0];
//     let y = p[1];
//     let square = getSquareForCoords(x, y);

//     if (!square) {
//       return false;
//     }

//     console.log('checking adjacent: x', x, 'y', y, 'square', square);
//     return square.disc !== null && square.disc !== player;
//   });

//   if (directionsWithDisc.length > 0) {
//     return true;
//   }
// };

// const checkR = (player, x, y) => {
//   let newx = x + 1;
//   let newy = y;
//   let square = getSquareForCoords(newx, newy);
//   if (square.disc !== null && square.disc !== player) {
//     checkR(player, newx, newy);
//     console.log('found opponents disc', newx, newy);
//   }

//   if (square.disc === player) {
//     console.log('found players disc', newx, newy);
//     return true;
//   }
// };

// checkR('b', 3, 6);
