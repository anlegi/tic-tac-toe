const playerX = "x"
const playerO = "circle"
const winningCombi = [ // possible combis on the grid
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const cellElements = document.querySelectorAll("[data-cell]")
const boardElement = document.querySelector(".board")
const winningMessageElement = document.getElementById("winningMessage")
const restartButton = document.getElementById("restartButton")
const winningMessageTextElement = document.getElementById("winningMessageText")
let isPlayer_O_Turn = false

startGame()

restartButton.addEventListener('click', startGame)


// restarts the game
function startGame() {
	isPlayer_O_Turn = false // player x starts
	cellElements.forEach(cell => {
	  cell.classList.remove(playerX) // removes the classes to clear previous game marks
		cell.classList.remove(playerO)
    cell.classList.remove("winner")
		cell.removeEventListener("click", handleCellClick) // removes existing click event listener
		cell.addEventListener("click", handleCellClick, { once: true }) // adds a new click event listener that will only trigger once per cell
	})
	setBoardHoverClass() // sets board hover class based on the current player
	winningMessageTextElement.classList.remove("show") // hides winning message
}

// when win or draw
function endGame(draw) {
  if (draw) { // setting message based on win or draw
    winningMessageTextElement.innerText = "It's a draw!"
  } else {
    winningMessageTextElement.innerHTML = `Player ${isPlayer_O_Turn ? '<i class="fa-regular fa-moon"></i>' : '<i class="fa-regular fa-star"></i>'} wins!`
  }
  winningMessageTextElement.classList.add("show"); // displays the winning message by adding the "show" class to the winning message element

  boardElement.classList.remove(playerX); // Remove player classes from the board to stop the hover effect
  boardElement.classList.remove(playerO);

  cellElements.forEach(cell => { // Remove click event listeners from all cells after win/draw
    cell.removeEventListener('click', handleCellClick);
});
}

function isDraw() {
	return [...cellElements].every(cell => {
		return cell.classList.contains(playerX) || cell.classList.contains(playerO)
	})
}

function placeMark(cell, currentClass) {
  console.log(`Placing mark: ${currentClass}`, cell)
	cell.classList.add(currentClass)
}

function swapTurns() { // toggles the isPlayer_O_Turn flag to switch turns between players
	isPlayer_O_Turn = !isPlayer_O_Turn
}


// checkWin uses .some() to go through all possible winning combinations, and for each combination, it uses .every() to check whether all cells in that combination are marked by the current player
// if any combination fully belongs to one player, the game acknowledges a win, highlights those cells, and the function returns true
function checkWin(currentClass) { // currentClass either x or circle
  return winningCombi.some(combination => { // .some method tests whether at least 1 element in the array passes the test(at least 1 winning combi)
      if (combination.every(index => { // .every method tests whether all elements in the array pass the test implemented by the provided function
          return cellElements[index].classList.contains(currentClass); // checks whether the cell at this particular index has the class corresponding to the current player's move
      })) {
          highlightWinningCells(combination); // Highlight the winning cells
          return true; // if all cells in the current combination contain currentClass, the .every() method returns true
      }
      return false;
  });
}

// adjust the hover effects on the game board based on whose turn it is
function setBoardHoverClass() {
	boardElement.classList.remove(playerX) // removes the class associated with player X from the board
	boardElement.classList.remove(playerO) // this is necessary to ensure that we don't stack classes for different players on the board, which would result in incorrect hover effects
	if (isPlayer_O_Turn) { // removes hover effect classes from the board and adds the class corresponding to the current player
		boardElement.classList.add(playerO)
	} else {
		boardElement.classList.add(playerX)
	}
}


function handleCellClick(e) {
	const cell = e.target // Handles a click event on a cell
	const currentClass = isPlayer_O_Turn ? playerO : playerX // determines which class to add to the cell based on whose turn it is

  if (cell.classList.contains(playerX) || cell.classList.contains(playerO)) {
    return; // check if cell is already marked
  }

	placeMark(cell, currentClass)
	if (checkWin(currentClass)) {
		endGame(false) // after marking the cell, this line checks if the current move has resulted in a win
	} else if (isDraw()) {
		endGame(true)
	} else {
		swapTurns() // if the game hasn't ended, this code runs. swapTurns() toggles isPlayer_O_Turn to change the turn to the other player
		setBoardHoverClass() // updates the board to reflect whose turn it is next
	}
}

function highlightWinningCells(winningCombination) { // adds a 'winner' class to all cells part of the winning combination to visually distinguish them
  winningCombination.forEach(index => {
      cellElements[index].classList.add('winner');
  });
}
