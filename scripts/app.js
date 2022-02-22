console.log('working');

const grid = document.querySelector('.grid');

const length = 8;

let counter = 1;
let player = counter % 2 === 0 ? 'w' : 'b';

let cells = [];
// let playableSquares = [18, 19, 20, 21, 26, 29, 34, 37, 42, 43, 44, 45];

const createBoard = () => {
  for (let i = 0; i < 64; i++) {
    const element = document.createElement('div');
    element.dataset.id = i;
    element.innerText = i;

    if (i < 8) {
      element.dataset.row = 0;
      element.dataset.column = i;
    } else if (i > 7 && i < 16) {
      element.dataset.row = 1;
      element.dataset.column = i - 8;
    } else if (i > 15 && i < 24) {
      element.dataset.row = 2;
      element.dataset.column = i - 16;
    } else if (i > 23 && i < 32) {
      element.dataset.row = 3;
      element.dataset.column = i - 24;
    } else if (i > 31 && i < 40) {
      element.dataset.row = 4;
      element.dataset.column = i - 32;
    } else if (i > 39 && i < 48) {
      element.dataset.row = 5;
      element.dataset.column = i - 40;
    } else if (i > 47 && i < 56) {
      element.dataset.row = 6;
      element.dataset.column = i - 48;
    } else if (i > 55) {
      element.dataset.row = 7;
      element.dataset.column = i - 56;
    }
    grid.appendChild(element);

    cells.push(element);
  }

  cells[27].classList.add('black-disc');
  cells[28].classList.add('white-disc');
  cells[35].classList.add('white-disc');
  cells[36].classList.add('black-disc');

  cells.forEach((cell) => {
    cell.addEventListener('click', handleClick);
  });
};

function handleClick(event) {
  // if (playableSquares.includes(parseInt(event.target.dataset.id))) {
  //   event.target.classList.add(player === 'w' ? 'white-disc' : 'black-disc');

  //   const playableSurroundingSquares = getPlayableSurroundingSquares(
  //     parseInt(event.target.dataset.id)
  //   );
  //   const playableSquaresWithDuplicates = [
  //     ...playableSurroundingSquares,
  //     ...playableSquares.filter(
  //       (index) => index !== parseInt(event.target.dataset.id)
  //     ),
  //   ];
  //   playableSquares = playableSquaresWithDuplicates.filter(
  //     (num, pos) => playableSquaresWithDuplicates.indexOf(num) === pos
  //   );

  //   // checkHorizontal(event.target.dataset.row);

  // }

  event.target.classList.add(player === 'w' ? 'white-disc' : 'black-disc');

  checkLeft(event);
  checkRight(event);

  counter++;
  console.log('counter', counter);
  player = counter % 2 === 0 ? 'w' : 'b';
  console.log('next player', player);
}

function checkLeft(event) {
  const discsToFlip = [];

  const clickedCell = event.target.dataset.id;
  console.log('clicked cell', clickedCell);

  const opponentsDisc = player === 'b' ? 'white-disc' : 'black-disc';
  const ownDisc = player === 'w' ? 'white-disc' : 'black-disc';

  if (cells[clickedCell].dataset.column < 2) {
    console.log('not enough room to check left!');
    return false;
  } else {
    let nextCellId = event.target.dataset.id - 1;

    while (
      cells[nextCellId].classList.contains(opponentsDisc) &&
      cells[nextCellId].dataset.column > 0
    ) {
      discsToFlip.push(cells[nextCellId]);
      nextCellId--;
      console.log('next cell id', nextCellId);
    }

    console.log('discs to flip', discsToFlip);

    if (
      discsToFlip.length > 0 &&
      cells[nextCellId].classList.contains(ownDisc)
    ) {
      discsToFlip.forEach((cell) => {
        cell.classList.remove(opponentsDisc);
        cell.classList.add(ownDisc);
      });
    }
  }
}

function checkRight(event) {
  const discsToFlip = [];

  const clickedCell = event.target.dataset.id;
  console.log('clicked cell', clickedCell);

  const opponentsDisc = player === 'b' ? 'white-disc' : 'black-disc';
  const ownDisc = player === 'w' ? 'white-disc' : 'black-disc';

  if (cells[clickedCell].dataset.column > 5) {
    console.log('not enough room to check right!');
    return false;
  } else {
    let nextCellId = parseInt(event.target.dataset.id) + 1;
    console.log(nextCellId);

    while (
      cells[nextCellId].classList.contains(opponentsDisc) &&
      cells[nextCellId].dataset.column < 7
    ) {
      discsToFlip.push(cells[nextCellId]);
      nextCellId++;
      console.log('next cell id', nextCellId);
    }

    console.log('discs to flip', discsToFlip);

    if (
      discsToFlip.length > 0 &&
      cells[nextCellId].classList.contains(ownDisc)
    ) {
      discsToFlip.forEach((cell) => {
        cell.classList.remove(opponentsDisc);
        cell.classList.add(ownDisc);
      });
    }
  }
}
// function checkHorizontal(row) {
//   // from cells get all elements with same row (filter)
//   const cellsInRow = cells.filter((cell) => cell.dataset.row === row);

//   // find positions with black-disc
//   const cellsWithBlackDiscs = cellsInRow
//     .filter((cell) => cell.classList.contains('black-disc'))
//     .map((cell) => cell.dataset.column);

//   console.log('black disks are in', cellsWithBlackDiscs);

//   const startSplice = parseInt(cellsWithBlackDiscs[0]) + 1;
//   console.log('startSplice', startSplice);
//   const toTake = cellsWithBlackDiscs[1] - startSplice;
//   const gapBetweenDiscs = cellsInRow.splice(startSplice, toTake);

//   if (
//     gapBetweenDiscs.every((cell) =>
//       cell.classList.contains(player === 'w' ? 'black-disc' : 'white-disc')
//     )
//   ) {
//     gapBetweenDiscs.forEach((cell) => {
//       cell.classList.remove(player === 'w' ? 'black-disc' : 'white-disc');
//       cell.classList.add(player === 'b' ? 'black-disc' : 'white-disc');
//     });
//   }

//   // find positions with white-discs
//   // const cellsWithWhiteDiscs = cellsInRow.filter((cell) =>
//   //   cell.classList.contains('white-disc')
//   // );
//   // console.log('cells with white discs', cellsWithWhiteDiscs);

//   // find unplayed spaces
//   const emptyCells = cellsInRow.filter(
//     (cell) =>
//       !cell.classList.contains('black-disc') &&
//       !cell.classList.contains('white-disc')
//   );
//   console.log('empty cells', emptyCells);

//   // if no unplayed spaces between two of the players discs

//   // change all discs to players discs
// }

function getPlayableSurroundingSquares(index) {
  const surroundingSquares = [
    index - 8,
    index - 7,
    index + 1,
    index + 9,
    index + 8,
    index + 7,
    index - 1,
    index - 9,
  ];
  const playableSurroundingSquares = surroundingSquares.filter(
    (number) =>
      !cells[number].classList.contains('black-disc') &&
      !cells[number].classList.contains('white-disc')
  );
  return playableSurroundingSquares;
}

createBoard();

// go over each element in the cells array and add an event listener
// returns position clicked on

// find available squares
// allow player to click in one of these sqaures
// add 'b' or 'w' players disc class to the square

// check for discs to flip in all directions
