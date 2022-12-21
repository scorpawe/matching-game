// first, grab all of the DOM elements
const DOMElements = {
	boardContainer: document.getElementById("board-container"),
	board: document.getElementById("board"),
	moves: document.getElementById("moves"),
	timer: document.getElementById("timer"),
	startButton: document.getElementById("start-btn"),
	win: document.getElementById("win"),
};
// create some values to keep track of certain things
const defaultValues = {
	gameStarted: false,
	allCardsCurrentlyFlipped: 0,
	totalFlips: 0,
	timeElapsed: 0,
	loop: null,
};
// create a new array from the array of emojis that is shuffled
const shuffleCards = (array) => {
	const clonedArray = [...array];

	for (i = clonedArray.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		const original = clonedArray[i];

		clonedArray[i] = clonedArray[randomIndex];
		clonedArray[randomIndex] = original;
	}
	return clonedArray;
};
// pick the correct amount of emojis randomly
const pickRandomCards = (array, items) => {
	const clonedArray = [...array];
	const randomPicks = [];

	for (i = 0; i < items; i++) {
		const randomIndex = Math.floor(Math.random() * clonedArray.length);

		randomPicks.push(clonedArray[randomIndex]);
		clonedArray.splice(randomIndex, 1);
	}
	return randomPicks;
};
// generate and overwrite html into the DOM, which, in turn, generates the board
const generateGameBoard = () => {
	const dimensions = DOMElements.board.getAttribute("data-dimension");
	if (dimensions % 2 !== 0) {
		throw new Error(
			"The dimension of the board MUST be an even whole number.",
		);
	}
	const emojis = [
		"🍎",
		"🍊",
		"🍉",
		"🍌",
		"🍇",
		"🍓",
		"🍒",
		"🍑",
		"🥭",
		"🍍",
		"🍅",
		"🥑",
		"🌶️",
		"🥕",
		"🌽",
		"🥦",
		"🥔",
		"🥝",
	];
	const itemsPicked = pickRandomCards(emojis, (dimensions * dimensions) / 2);
	const items = shuffleCards([...itemsPicked, ...itemsPicked]);
	const generateCards = `
   <div id="board" style="grid-template-columns: repeat(${dimensions}, auto)">
   ${items
		.map(
			(item) =>
				`
            <div class="card">
               <div class="card-front"></div>
               <div class="card-back">${item}</div>
            </div>
            `,
		)
		.join("")}
      </div>
   `;
	const parser = new DOMParser().parseFromString(generateCards, "text/html");
	DOMElements.board.replaceWith(parser.getElementById("board"));
};

const startGame = () => {
	defaultValues.gameStarted = true;
	DOMElements.startButton.classList.add("btn-disabled");

	defaultValues.loop = setInterval(() => {
		defaultValues.timeElapsed++;

		DOMElements.moves.innerText = `MOVES MADE: ${defaultValues.totalFlips}`;
		DOMElements.timer.innerText = `TIME ELAPSED: ${defaultValues.timeElapsed} SECONDS`;
	}, 1000);
};

// some logic to flip back cards that failed to match
const flipBackCards = () => {
	document.querySelectorAll(".card:not(.matched)").forEach((card) => {
		card.classList.remove("flipped");
	});
	defaultValues.allCardsCurrentlyFlipped = 0;
};
// function that runs everytime a card is flipped and executes various things
const flipCard = (card) => {
	defaultValues.allCardsCurrentlyFlipped++;
	defaultValues.totalFlips++;

	if (!defaultValues.gameStarted) {
		startGame();
	}

	if (defaultValues.allCardsCurrentlyFlipped <= 2) {
		card.classList.add("flipped");
	}

	if (defaultValues.allCardsCurrentlyFlipped === 2) {
		const allCardsCurrentlyFlipped = document.querySelectorAll(
			".flipped:not(.matched)",
		);
		if (
			allCardsCurrentlyFlipped[0].innerText ===
			allCardsCurrentlyFlipped[1].innerText
		) {
			allCardsCurrentlyFlipped[0].classList.add("matched");
			allCardsCurrentlyFlipped[1].classList.add("matched");
		}

		setTimeout(() => {
			flipBackCards();
		}, 1000);
	}

	// checks if all the cards have been matched, and if so, then the user has won
	if (!document.querySelectorAll(".card:not(.flipped)").length) {
		setTimeout(() => {
			DOMElements.boardContainer.classList.add("flipped");
			DOMElements.win.innerHTML = `
         <span class="win-text">
            YOU'VE WON!<br /><br />
            MOVES:<span class="highlight"> ${defaultValues.totalFlips}</span><br /><br />
            TIME:<span class="highlight"> ${defaultValues.timeElapsed}s</span>
         </span>
         `;
			clearInterval(defaultValues.loop);
		}, 1000);
	}
};

const addEventListeners = () => {
	document.addEventListener("click", (e) => {
		const target = e.target;
		const parent = target.parentElement;
		if (
			target.className.includes("card") &&
			!target.className.includes("flipped")
		) {
			flipCard(parent);
		} else if (
			target.nodeName === "BUTTON" &&
			!target.className.includes("disabled")
		) {
			startGame();
		} else if (target.nodeName === "INPUT") {
			location.reload();
		}
	});
};

generateGameBoard();
addEventListeners();
