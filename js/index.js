class juego {
    constructor() {
        this.element = new Array();
        this.tablero = new Array();
        this.tarjetas = new Array();
        this.NivelActual;
        this.CuadrosNivel = [6];
        this.SeleccionadaUNO;
        this.SeleccionadaDOS;
        this.NTarjetasSeleccionadas = 0;
        this.ContadorVictoria = 0;
        this.container = document.getElementById("game");
    }

    iniciarJuego() {
        this.NivelActual = 0;
        this.elegirtarjeta = this.elegirtarjeta.bind(this);

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

        this.tablero = this.shuffle(this.tablero);

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
                    setTimeout(() => {
                        this.tarjetas[this.SeleccionadaUNO].classList.remove(
                            "rotar"
                        );
                        this.tarjetas[this.SeleccionadaDOS].classList.remove(
                            "rotar"
                        );
                    }, 1000);
                    this.agregarEventos(this.SeleccionadaUNO);
                }
                this.NTarjetasSeleccionadas = 0;
                break;
        }
    }

    shuffle(arra1) {
        var ctr = arra1.length,
            temp,
            index;

        while (ctr > 0) {
            index = Math.floor(Math.random() * ctr);
            ctr--;
            temp = arra1[ctr];
            arra1[ctr] = arra1[index];
            arra1[index] = temp;
        }
        return arra1;
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

const iniciar = new juego();
iniciar.iniciarJuego();
