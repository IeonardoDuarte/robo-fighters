window.onload = function () {
    let canvas = document.querySelector('.palco');
    let ctx = canvas.getContext("2d");
    let vidaJogador1 = document.querySelector('.barra-vida-jogador1');
    let vidaJogador2 = document.querySelector('.barra-vida-jogador2');
    let placarImpactos = document.querySelector('.impactos');
    let resultado = document.querySelector('.resultado');

    class ObjRetangular {
        constructor(x, y, largura, altura, cor) {
            this.x = x;
            this.y = y;
            this.largura = largura;
            this.altura = altura;
            this.cor = cor;
            // Um array de vertices contendo as coordenas no plano cartesiano de cada uma delas
            this.vertices = [{
                x: this.x,
                y: this.y
            }, {
                x: this.x + this.largura,
                y: this.y
            }, {
                x: this.x + this.largura,
                y: this.y + this.altura
            }, {
                x: this.x,
                y: this.y + this.altura
            }]
        }

        atualizaVertices() {
            this.vertices = [{
                x: this.x,
                y: this.y
            }, {
                x: this.x + this.largura,
                y: this.y
            }, {
                x: this.x + this.largura,
                y: this.y + this.altura
            }, {
                x: this.x,
                y: this.y + this.altura
            }]
        }

        desenhar() {
            ctx.fillStyle = this.cor;
            ctx.fillRect(this.x, this.y, this.altura, this.largura);
        }

        // A função colisão verifica se algum dos vertices do objeto externo está dentro da área desse objeto.
        colisao(vertices) {
            let colidiu = false;
            vertices.forEach(v => {
                if (v.x >= this.x && v.x <= this.x + this.largura && v.y >= this.y && v.y <= this.y + this.altura) {
                    colidiu = true;
                }
            });
            return colidiu;
        }
    }

    class Jogador extends ObjRetangular {
        constructor(x, y, largura, altura, cor) {
            super(x, y, largura, altura, cor);
            this.xInicial = x;
            this.yInicial = y;
            this.vida = 100;
        }

        andar(direcao) {
            this.atualizaVertices();
            let vel = 1;
            switch (direcao) {
                case 'esquerda':
                    if (this.x >= 0)
                        this.x -= vel;
                    break;
                case 'baixo':
                    if (this.y + this.altura <= canvas.height)
                        this.y += vel;
                    break;
                case 'direita':
                    if (this.x + this.largura <= canvas.width)
                        this.x += vel;
                    break;
                case 'cima':
                    if (this.y >= 0)
                        this.y -= vel;
                    break;
            }
        }

        reposicionar() {
            this.x = this.xInicial;
            this.y = this.yInicial;
            this.atualizaVertices();
        }
    }

    function animar() {
        atualizaHud();
        if (jogador1.colisao(jogador2.vertices) || jogador2.colisao(jogador1.vertices)) {
            // TODO - Colocar animação de impcto

            impactos++;

            jogador1.vida -= intRandom(0, 20);
            jogador2.vida -= intRandom(0, 20);


            atualizaHud();
            if (impactos >= 5) {
                if (jogador1.vida > jogador2.vida)
                    resultado.innerHTML = "Jogador 1 ganhou!";
                else if (jogador2.vida > jogador1.vida)
                    resultado.innerHTML = "Jogador 2 ganhou!";
                else
                    resultado.innerHTML = "Empate!";
                impactos = 0;
            } else {
                jogador1.reposicionar();
                jogador2.reposicionar();

                // Depois de atualizar a rodada, chama a função para animar a tela denovo
                requestAnimationFrame(animar)
            }

        } else {
            requestAnimationFrame(animar)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            teclas.forEach(tecla => {
                jogador1.andar(movimento(tecla, 1));
                jogador2.andar(movimento(tecla, 2));
            });

            jogador1.desenhar();
            jogador2.desenhar();
        }
    }

    // Função movimento recebe a tecla que indica a direção e o controle que indica qual dos jogadores está se mexendo.
    function movimento(tecla, controle) {

        switch (controle) {
            case 1:
                switch (tecla) {
                    case 'a':
                        return 'esquerda';
                    case 's':
                        return 'baixo';
                    case 'd':
                        return 'direita';
                    case 'w':
                        return 'cima';
                }
                break;
            case 2:
                switch (tecla) {
                    case 'ArrowLeft':
                        return 'esquerda';
                    case 'ArrowDown':
                        return 'baixo';
                    case 'ArrowRight':
                        return 'direita';
                    case 'ArrowUp':
                        return 'cima';
                }
                break;
        }
    }

    function intRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function atualizaHud() {
        vidaJogador1.style = `width: ${jogador1.vida}%`
        vidaJogador1.innerHTML = `${jogador1.vida}%`
        vidaJogador2.style = `width: ${jogador2.vida}%`
        vidaJogador2.innerHTML = `${jogador2.vida}%`
        placarImpactos.innerHTML = `Impactos ${impactos}`;
    }

    let tamanhoJogadores = 20;

    let posIniJog1 = {
        x: 10,
        y: canvas.height / 2 - tamanhoJogadores / 2,
    };

    let posIniJog2 = {
        x: canvas.width - 10 - tamanhoJogadores,
        y: canvas.height / 2 - tamanhoJogadores / 2
    }

    const jogador1 = new Jogador(posIniJog1.x, posIniJog1.y, tamanhoJogadores, tamanhoJogadores, 'blue');
    const jogador2 = new Jogador(posIniJog2.x, posIniJog2.y, tamanhoJogadores, tamanhoJogadores, 'orange');

    let teclas = [];
    addEventListener('keydown', evento => {
        if (!teclas.includes(evento.key))
            teclas.push(evento.key);
    });

    addEventListener('keyup', evento => {
        teclas.splice(teclas.indexOf(evento.key), 1);
    });

    let impactos = 0;
    animar();

}