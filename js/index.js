class juego {
    constructor() {
        this.element = new Array();
        this.tablero = new Array();
        this.tarjetas = new Array();
        this.NivelActual;
        this.CuadrosNivel = [10];
        this.SeleccionadaUNO;
        this.SeleccionadaDOS;
        this.NTarjetasSeleccionadas = 0;
        this.ContadorVictoria = 0;
        this.container = document.getElementById("game");
        this.time = true;
        this.dataAPI = {
            loading: true,
            error: null,
            data: {
                info: {},
                results: []
            }
        };
    }

    fetchCharacters = async () => {
        this.dataAPI = { loading: true, error: null };

        try {
            const response = await fetch(
                `https://rickandmortyapi.com/api/character/`
            );
            const data = await response.json();

            this.dataAPI = {
                loading: false,
                data: {
                    info: data.info,
                    results: data.results
                }
            };
        } catch (error) {
            this.dataAPI = { loading: false, error: error };
        }
    };

    async iniciarJuego() {
        this.NivelActual = 0;
        this.elegirtarjeta = this.elegirtarjeta.bind(this);
        await this.fetchCharacters();
        console.log(this.dataAPI.data.info.count);
        console.log(this.dataAPI.data.results[1]);

        this.ramdom = this.getRndInteger(1, this.dataAPI.data.info.count);
        console.log(this.ramdom);

        for (let i = 0; i < this.CuadrosNivel[this.NivelActual]; i++) {
            this.element.push(i + 1);
        }

        this.tablero.length = this.CuadrosNivel[this.NivelActual] * 2;
        this.tarjetas.length = this.tablero.length;

        var contador = 1;

        for (let i = 0; i < this.tablero.length; i++) {
            if (i >= this.CuadrosNivel[this.NivelActual]) {
                this.tablero[i] = contador;
                contador++;
            } else {
                this.tablero[i] = i + 1;
            }
        }

        this.tablero = this.tablero.sort(function() {
            return Math.random() - 0.5;
        });

        for (let i = 0; i < this.tarjetas.length; i++) {
            this.tarjetas[i] = document.createElement("div");
            this.tarjetas[i].classList.add("tarjeta");
            this.tarjetas[i].innerText = this.tablero[i];
            this.tarjetas[i].setAttribute("data-position", i);
            this.tarjetas[i].addEventListener("click", this.elegirtarjeta);
            this.tarjetas[i].innerHTML =
                '<div class="front vueltaFront" data-position="' +
                i +
                '"></div><div class="back vueltaBack" data-position="' +
                i +
                '">' +
                this.tablero[i] +
                "</div>";
            this.container.appendChild(this.tarjetas[i]);
        }
    }

    agregarEventos(n) {
        this.tarjetas[n].addEventListener("click", this.elegirtarjeta);
    }

    eliminarEventos(n) {
        this.tarjetas[n].removeEventListener("click", this.elegirtarjeta);
    }

    elegirtarjeta(e) {
        if (this.time === true) {
            switch (this.NTarjetasSeleccionadas) {
                case 0:
                    this.SeleccionadaUNO = e.target.dataset.position;
                    this.tarjetas[this.SeleccionadaUNO].classList.add("rotar");
                    this.eliminarEventos(this.SeleccionadaUNO);
                    this.NTarjetasSeleccionadas++;
                    break;
                case 1:
                    this.SeleccionadaDOS = e.target.dataset.position;
                    this.tarjetas[this.SeleccionadaDOS].classList.add("rotar");
                    if (
                        this.tablero[this.SeleccionadaUNO] ===
                        this.tablero[this.SeleccionadaDOS]
                    ) {
                        console.log("correcto");
                        this.eliminarEventos(this.SeleccionadaDOS);
                        this.ContadorVictoria++;
                        if (
                            this.ContadorVictoria ===
                            this.CuadrosNivel[this.NivelActual]
                        ) {
                            setTimeout(() => {
                                alert("Ganaste!!");
                            }, 1000);
                        }
                    } else {
                        console.log("incorrecto");
                        this.time = false;
                        setTimeout(() => {
                            this.tarjetas[
                                this.SeleccionadaUNO
                            ].classList.remove("rotar");
                            this.tarjetas[
                                this.SeleccionadaDOS
                            ].classList.remove("rotar");
                            this.time = true;
                        }, 1000);
                        this.agregarEventos(this.SeleccionadaUNO);
                    }
                    this.NTarjetasSeleccionadas = 0;
                    break;
            }
        }
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

const iniciar = new juego();
iniciar.iniciarJuego();
