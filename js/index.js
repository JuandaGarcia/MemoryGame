class game {
	constructor() {
		this.cardsNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		this.cards = new Array()
		this.firstCardSelected
		this.secondCardSelected
		this.numberCardsSelected = 0
		this.ContadorVictoria = 0
		this.moves = 0
		this.containerMovimientos = document.getElementById('moves')
		this.container = document.getElementById('game')
		this.time = true

		//Timer
		this.firstMove = false
		this.hour = 0
		this.minutes = 0
		this.seconds = 0
		this.decimals = 0
		this.timeText = ''
		this.stop = true
	}

	startGame() {
		this.selectCard = this.selectCard.bind(this)

		const LengthStatic = this.cardsNumbers.length

		for (let i = 0; i < LengthStatic; i++) {
			this.cardsNumbers.push(this.cardsNumbers[i])
		}

		this.cards.length = this.cardsNumbers.length

		this.cardsNumbers = this.cardsNumbers.sort(function () {
			return Math.random() - 0.5
		})

		for (let i = 0; i < this.cards.length; i++) {
			this.cards[i] = document.createElement('div')
			this.cards[i].classList.add('card')
			this.cards[i].addEventListener('click', this.selectCard)
			this.cards[
				i
			].innerHTML = `<div class="front vueltaFront" data-position="${i}"></div>
										<div class="back vueltaBack" data-position="${i}" style="background-image: url('../img/cards/${this.cardsNumbers[i]}.png');"></div>`
			this.container.appendChild(this.cards[i])
		}
		this.container.style.display = 'flex'
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
					if (!this.firstMove) {
						this.startTimer()
					}
					this.firstMove = true
					this.firstCardSelected = e.target.dataset.position
					this.cards[this.firstCardSelected].classList.add('rotar')
					this.removeEvents(this.firstCardSelected)
					this.numberCardsSelected++
					this.moves++
					this.containerMovimientos.innerText = `Movimientos: ${this.moves}`
					break
				case 1:
					this.moves++
					this.containerMovimientos.innerText = `Movimientos: ${this.moves}`
					this.secondCardSelected = e.target.dataset.position
					this.cards[this.secondCardSelected].classList.add('rotar')
					if (
						this.cardsNumbers[this.firstCardSelected] ===
						this.cardsNumbers[this.secondCardSelected]
					) {
						this.removeEvents(this.secondCardSelected)
						this.ContadorVictoria++
						if (this.ContadorVictoria === this.cardsNumbers.length / 2) {
							setTimeout(() => {
								this.victory()
							}, 1000)
						}
					} else {
						this.time = false
						setTimeout(() => {
							this.cards[this.firstCardSelected].classList.remove('rotar')
							this.cards[this.secondCardSelected].classList.remove('rotar')
							this.time = true
						}, 1000)
						this.addEvents(this.firstCardSelected)
					}
					this.numberCardsSelected = 0
					break
			}
		}
	}

	victory() {
		this.PauseTime()
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
		if (this.stop == false) {
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
