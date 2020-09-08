class game {
	constructor() {
		this.cardsNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		this.cards = new Array()
		this.firstCardSelected
		this.secondCardSelected
		this.numberCardsSelected = 0
		this.foundCouples = 0
		this.moves = 0
		this.movesElement = document.getElementById('moves')
		this.gameElement = document.getElementById('game')

		//Timer
		this.time = true
		this.firstMove = false
		this.hour = 0
		this.minutes = 0
		this.seconds = 0
		this.decimals = 0
		this.timeText = ''
		this.stop = true
	}

	startGame() {
		//change the "this" of the function
		this.selectCard = this.selectCard.bind(this)

		//Length = 10
		const Length = this.cardsNumbers.length

		//Add 10 more numbers to the number array to create pairs
		for (let i = 0; i < Length; i++) {
			this.cardsNumbers.push(this.cardsNumbers[i])
		}

		//Shuffle the array randomly for the game
		this.cardsNumbers = this.cardsNumbers.sort(function () {
			return Math.random() - 0.5
		})

		//this.cards.length = 20 (number of cards)
		this.cards.length = this.cardsNumbers.length

		//Create the 20 cards and add their styles, events and corresponding html
		for (let i = 0; i < this.cards.length; i++) {
			this.cards[i] = document.createElement('div')
			this.cards[i].classList.add('card')
			this.cards[i].addEventListener('click', this.selectCard)
			this.cards[
				i
			].innerHTML = `<div class="front cardFront" data-position="${i}"></div>
										<div class="back cardBack" data-position="${i}" style="background-image: url('../img/cards/${this.cardsNumbers[i]}.png');"></div>`

			//add the card to the container element
			this.gameElement.appendChild(this.cards[i])
		}
	}

	addEvents(n) {
		this.cards[n].addEventListener('click', this.selectCard)
	}

	removeEvents(n) {
		this.cards[n].removeEventListener('click', this.selectCard)
	}

	selectCard(e) {
		if (this.time === true) {
			switch (this.numberCardsSelected) {
				case 0:
					//Check if it is the first movement to initialize the timer
					if (!this.firstMove) {
						this.startTimer()
					}
					//initialize the timer
					this.firstMove = true

					//e.target.dataset.position = number assigned to the element in the startgame function
					this.firstCardSelected = e.target.dataset.position

					//add the css class "rotateCard" to rotate the card
					this.cards[this.firstCardSelected].classList.add('rotateCard')
					//removes the events from the card so that it cannot be flipped while it is already flipped
					this.removeEvents(this.firstCardSelected)

					//increments the counter of selected cards
					this.numberCardsSelected++

					//increases movements and shows them
					this.moves++
					this.movesElement.innerText = `Moves: ${this.moves}`
					break
				case 1:
					//increases movements and shows them
					this.moves++
					this.movesElement.innerText = `Moves: ${this.moves}`

					//e.target.dataset.position = number assigned to the element in the startgame function
					this.secondCardSelected = e.target.dataset.position
					//add the css class "rotateCard" to rotate the card
					this.cards[this.secondCardSelected].classList.add('rotateCard')

					//compares if the two selected cards have the same number
					if (
						this.cardsNumbers[this.firstCardSelected] ===
						this.cardsNumbers[this.secondCardSelected]
					) {
						//remove the event from the second card as they match
						this.removeEvents(this.secondCardSelected)
						//increments the counter of pairs found
						this.foundCouples++

						//if the number of pairs found is equal to the number of cards (20/2) you win the game
						if (this.foundCouples === this.cardsNumbers.length / 2) {
							setTimeout(() => {
								this.victory()
							}, 1000)
						}
					} else {
						this.time = false
						//if they are not the same, remove the rotate class so that they remain as they were
						setTimeout(() => {
							this.cards[this.firstCardSelected].classList.remove('rotateCard')
							this.cards[this.secondCardSelected].classList.remove('rotateCard')
							this.time = true
						}, 1000)
						//add the event to the first card so that it can be flipped again
						this.addEvents(this.firstCardSelected)
					}
					this.numberCardsSelected = 0
					break
			}
		}
	}

	victory() {
		this.PauseTime()
		//"swal" is from a library imported into the game.html file
		swal(
			'You won the game!',
			`Moves: ${this.moves} \n\n Time: ${this.timeText}`,
			'success'
		)
	}

	newGame() {
		location.reload()
	}

	//Timer functions

	startTimer() {
		if (this.stop == true) {
			this.stop = false
			this.timer()
		}
	}

	timer() {
		if (this.stop === false) {
			this.decimals++
			if (this.decimals > 9) {
				this.decimals = 0
				this.seconds++
			}
			if (this.seconds > 59) {
				this.seconds = 0
				this.minutes++
			}
			if (this.minutes > 59) {
				this.minutes = 0
				this.hour++
			}
			this.seeTimer()
			setTimeout('newGame.timer()', 100)
		}
	}

	seeTimer() {
		if (this.hour < 10) this.timeText = ''
		else this.timeText = this.hour
		if (this.minutes < 10) this.timeText = this.timeText + '0'
		this.timeText = this.timeText + this.minutes + ':'
		if (this.seconds < 10) this.timeText = this.timeText + '0'
		this.timeText = this.timeText + this.seconds
		document.getElementById('timeText').innerHTML = this.timeText
	}

	PauseTime() {
		this.stop = true
	}
}

const newGame = new game()
newGame.startGame()
