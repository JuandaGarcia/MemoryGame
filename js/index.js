class juego {
	constructor() {
		this.NumerosAPI = new Array()
		this.tarjetas = new Array()
		this.NivelActual
		this.CuadrosNivel = [10]
		this.SeleccionadaUNO
		this.SeleccionadaDOS
		this.NTarjetasSeleccionadas = 0
		this.ContadorVictoria = 0
		this.movimientos = 0
		this.containerCargando = document.getElementById('cargando')
		this.containerMovimientos = document.getElementById('movimientos')
		this.container = document.getElementById('game')
		this.time = true
		this.dataAPI = {
			loading: true,
			error: null,
			data: {
				info: {},
				results: []
			}
		}
		//Cronometro
		this.primermovimiento = false
		this.hora = 0
		this.minutos = 0
		this.segundos = 0
		this.decimales = 0
		this.tiempo = ''
		this.stop = true
	}

	fetchCharacters = async () => {
		this.dataAPI = { loading: true, error: null }

		try {
			const response = await fetch(`https://rickandmortyapi.com/api/character/`)
			const data = await response.json()

			this.dataAPI = {
				loading: false,
				data: {
					info: data.info,
					results: data.results
				}
			}
		} catch (error) {
			this.dataAPI = { loading: false, error: error }
		}
	}

	async iniciarJuego() {
		this.NivelActual = 0
		this.elegirtarjeta = this.elegirtarjeta.bind(this)
		await this.fetchCharacters()

		for (let i = 0; i < this.dataAPI.data.info.count; i++) {
			this.NumerosAPI.push(i + 1)
		}

		this.NumerosAPI = this.NumerosAPI.sort(function() {
			return Math.random() - 0.5
		})

		this.NumerosAPI.length = 10

		const LengthStatic = this.NumerosAPI.length

		for (let i = 0; i < LengthStatic; i++) {
			this.NumerosAPI.push(this.NumerosAPI[i])
		}

		this.tarjetas.length = this.NumerosAPI.length

		this.NumerosAPI = this.NumerosAPI.sort(function() {
			return Math.random() - 0.5
		})
		for (let i = 0; i < this.tarjetas.length; i++) {
			this.PersonajeTemporal = {}

			try {
				const response = await fetch(
					`https://rickandmortyapi.com/api/character/${this.NumerosAPI[i]}`
				)
				const data = await response.json()

				this.PersonajeTemporal = data
			} catch (error) {
				this.PersonajeTemporal = { error: error }
			}

			this.tarjetas[i] = document.createElement('div')
			this.tarjetas[i].classList.add('tarjeta')
			this.tarjetas[i].innerText = this.NumerosAPI[i]
			this.tarjetas[i].setAttribute('data-position', i)
			this.tarjetas[i].addEventListener('click', this.elegirtarjeta)
			this.tarjetas[i].innerHTML =
				'<div class="front vueltaFront" data-position="' +
				i +
				'"></div><div class="back vueltaBack" data-position="' +
				i +
				'" style="background-image: url(' +
				this.PersonajeTemporal.image +
				');">' +
				'' +
				'</div>'
			this.container.appendChild(this.tarjetas[i])
		}
		this.containerCargando.style.display = 'none'
		this.container.style.display = 'flex'
	}

	agregarEventos(n) {
		this.tarjetas[n].addEventListener('click', this.elegirtarjeta)
	}

	eliminarEventos(n) {
		this.tarjetas[n].removeEventListener('click', this.elegirtarjeta)
	}

	elegirtarjeta(e) {
		if (this.time === true) {
			switch (this.NTarjetasSeleccionadas) {
				case 0:
					if (!this.primermovimiento) {
						this.IniciarCronometro()
					}
					this.primermovimiento = true
					this.SeleccionadaUNO = e.target.dataset.position
					this.tarjetas[this.SeleccionadaUNO].classList.add('rotar')
					this.eliminarEventos(this.SeleccionadaUNO)
					this.NTarjetasSeleccionadas++
					this.movimientos++
					this.containerMovimientos.innerText = `Movimientos: ${this.movimientos}`
					break
				case 1:
					this.movimientos++
					this.containerMovimientos.innerText = `Movimientos: ${this.movimientos}`
					this.SeleccionadaDOS = e.target.dataset.position
					this.tarjetas[this.SeleccionadaDOS].classList.add('rotar')
					if (
						this.NumerosAPI[this.SeleccionadaUNO] ===
						this.NumerosAPI[this.SeleccionadaDOS]
					) {
						console.log('correcto')
						this.eliminarEventos(this.SeleccionadaDOS)
						this.ContadorVictoria++
						if (this.ContadorVictoria === this.CuadrosNivel[this.NivelActual]) {
							setTimeout(() => {
								this.victoria()
							}, 1000)
						}
					} else {
						console.log('incorrecto')
						this.time = false
						setTimeout(() => {
							this.tarjetas[this.SeleccionadaUNO].classList.remove('rotar')
							this.tarjetas[this.SeleccionadaDOS].classList.remove('rotar')
							this.time = true
						}, 1000)
						this.agregarEventos(this.SeleccionadaUNO)
					}
					this.NTarjetasSeleccionadas = 0
					break
			}
		}
	}

	victoria() {
		this.PausarTiempo()
		swal(
			'Ganaste!',
			`Movimientos: ${this.movimientos} \n\n Tiempo: ${this.tiempo}`,
			'success'
		).then(() => {
			console.log('hola')
		})
	}

	juegoNuevo() {
		location.reload()
	}

	getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	//Cronometro
	IniciarCronometro() {
		if (this.stop == true) {
			this.stop = false
			this.cronometro()
		}
	}

	cronometro() {
		if (this.stop == false) {
			this.decimales++
			if (this.decimales > 9) {
				this.decimales = 0
				this.segundos++
			}
			if (this.segundos > 59) {
				this.segundos = 0
				this.minutos++
			}
			if (this.minutos > 59) {
				this.minutos = 0
				this.hora++
			}
			this.verCronometro()
			setTimeout('iniciar.cronometro()', 100)
		}
	}
	verCronometro() {
		if (this.hora < 10) this.tiempo = ''
		else this.tiempo = this.hora
		if (this.minutos < 10) this.tiempo = this.tiempo + '0'
		this.tiempo = this.tiempo + this.minutos + ':'
		if (this.segundos < 10) this.tiempo = this.tiempo + '0'
		this.tiempo = this.tiempo + this.segundos
		document.getElementById('tiempo').innerHTML = this.tiempo
	}
	PausarTiempo() {
		this.stop = true
	}
	ReiniciarTiempo() {
		if (this.stop == false) {
			this.stop = true
		}
		this.hora = this.minutos = this.segundos = this.decimales = 0
		this.tiempo = ''
		this.verCronometro()
	}
}

const iniciar = new juego()
iniciar.iniciarJuego()
