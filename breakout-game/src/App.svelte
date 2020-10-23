<script>
  import { onMount } from 'svelte';
  let show = false;
  let canvas;
  let score = 0;
  const brickRowCount = 9;
  const brickColumnCount = 5;
  const delay = 500;
  const bricks = [];

  const handleShowRules = () => {
    show = !show;
  };

  onMount(() => {
    const ctx = canvas.getContext('2d');

    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: 10,
      speed: 4,
      dx: 4,
      dy: -4,
      visible: true,
    };

    const paddle = {
      x: canvas.width / 2 - 40,
      y: canvas.height - 20,
      w: 80,
      h: 10,
      speed: 8,
      dx: 0,
      visible: true,
    };

    const brickInfo = {
      w: 70,
      h: 20,
      padding: 10,
      offsetX: 45,
      offsetY: 60,
      visible: true,
    };

    for (let i = 0; i < brickRowCount; i++) {
      bricks[i] = [];
      for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo };
      }
    }

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
      ctx.fillStyle = ball.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
      ctx.fillStyle = paddle.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    };

    const drawScore = () => {
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
    };

    const drawBricks = () => {
      bricks.forEach((column) => {
        column.forEach((brick) => {
          ctx.beginPath();
          ctx.rect(brick.x, brick.y, brick.w, brick.h);
          ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
          ctx.fill();
          ctx.closePath();
        });
      });
    };

    const movePaddle = () => {
      paddle.x += paddle.dx;

      if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
      }

      if (paddle.x < 0) {
        paddle.x = 0;
      }
    };

    const moveBall = () => {
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
      }

      if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
      }

      if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
      ) {
        ball.dy = -ball.speed;
      }

      bricks.forEach((column) => {
        column.forEach((brick) => {
          if (brick.visible) {
            if (
              ball.x - ball.size > brick.x &&
              ball.x + ball.size < brick.x + brick.w &&
              ball.y + ball.size > brick.y &&
              ball.y - ball.size < brick.y + brick.h
            ) {
              ball.dy *= -1;
              brick.visible = false;

              increaseScore();
            }
          }
        });
      });

      if (ball.y + ball.size > canvas.height) {
        showAllBricks();
        score = 0;
      }
    };

    const increaseScore = () => {
      score++;

      if (score % (brickRowCount * brickColumnCount) === 0) {
        ball.visible = false;
        paddle.visible = false;

        setTimeout(function () {
          showAllBricks();
          score = 0;
          paddle.x = canvas.width / 2 - 40;
          paddle.y = canvas.height - 20;
          ball.x = canvas.width / 2;
          ball.y = canvas.height / 2;
          ball.visible = true;
          paddle.visible = true;
        }, delay);
      }
    };

    const showAllBricks = () => {
      bricks.forEach((column) => {
        column.forEach((brick) => (brick.visible = true));
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBall();
      drawPaddle();
      drawScore();
      drawBricks();
    };

    const update = () => {
      movePaddle();
      moveBall();

      draw();

      requestAnimationFrame(update);
    };

    update();

    const keyDown = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
      }
    };

    const keyUp = (e) => {
      if (
        e.key === 'Right' ||
        e.key === 'ArrowRight' ||
        e.key === 'Left' ||
        e.key === 'ArrowLeft'
      ) {
        paddle.dx = 0;
      }
    };

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
  });
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
  }

  h1 {
    font-size: 45px;
    color: #fff;
  }

  canvas {
    background: #f0f0f0;
    display: block;
    border-radius: 5px;
  }

  .btn {
    cursor: pointer;
    border: 0;
    padding: 10px 20px;
    background: #000;
    color: #fff;
    border-radius: 5px;
  }

  .btn:focus {
    outline: 0;
  }

  .btn:hover {
    background: #222;
  }

  .btn:active {
    transform: scale(0.98);
  }

  .rules-btn {
    position: absolute;
    top: 30px;
    left: 30px;
  }

  .rules {
    position: absolute;
    top: 0;
    left: 0;
    background: #333;
    color: #fff;
    min-height: 100vh;
    width: 400px;
    padding: 20px;
    line-height: 1.5;
    transform: translateX(-400px);
    transition: transform 1s ease-in-out;
  }

  .show {
    transform: translateX(0);
  }
</style>

<main>
  <h1>Breakout!</h1>
  <button id="rules-btn" class="btn rules-btn" on:click={handleShowRules}>Show
    Rules</button>
  <div id="rules" class="rules" class:show>
    <h2>How To Play:</h2>
    <p>
      Use your right and left keys to move the paddle to bounce the ball up and
      break the blocks.
    </p>
    <p>If you miss the ball, your score and the blocks will reset.</p>
    <button id="close-btn" class="btn" on:click={handleShowRules}>Close</button>
  </div>

  <canvas id="canvas" width="800" height="600" bind:this={canvas} />
</main>
