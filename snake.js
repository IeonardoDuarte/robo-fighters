window.onload = function () {
    var stage = document.getElementById('stage');
    var ctx = stage.getContext("2d");

    setInterval(game, 80);

    const vel = 1;

    var vx = vy = 0;
    var px = 10;
    var py = 15;
    var tp = 20;
    var qp = 20;
    var ax = ay = 15;

    function resetVariaveis() {
        vx = vy = 0;
        px = 10;
        py = 15;
        tp = 20;
        qp = 20;
        ax = ay = 15;
    }

    var trail = [];
    tail = 5;

    function game() {
        document.addEventListener("keydown", keyPush);
        px += vx;
        py += vy;

        if (px < 0) resetVariaveis();
        if (px > qp - 1) resetVariaveis();
        if (py < 0) resetVariaveis();
        if (py > qp - 1) resetVariaveis();

        // Pintando o tabuleiro
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, stage.width, stage.height);

        // Pintando a maçã
        ctx.fillStyle = 'red';
        ctx.fillRect(ax * tp, ay * tp, tp, tp);

        // Pintando a cobra
        ctx.fillStyle = 'gray';
        for (var i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * tp, trail[i].y * tp, tp - 1, tp - 1);

            // Game over
            if (trail[i].x == px && trail[i].y == py) {
                vx = vy = 0;
                tail = 5;
            }
        }

        trail.push({
            x: px,
            y: py
        })
        while (trail.length > tail) trail.shift();

        if (ax == px && ay == py) {
            tail++;
            ax = Math.floor(Math.random() * qp);
            ay = Math.floor(Math.random() * qp);
        }

        function keyPush(event) {
            switch (event.keyCode) {
                case 37: // Left
                    vx = -vel;
                    vy = 0;
                    break;
                case 38: // Up
                    vx = 0;
                    vy = -vel;
                    break;
                case 39: // Right
                    vx = vel;
                    vy = 0;
                    break;
                case 40: // Down
                    vx = 0;
                    vy = vel;
                    break;
                default:
                    break;

            }
        }
    }
}