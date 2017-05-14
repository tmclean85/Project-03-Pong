import { SVG_NS } from '../settings';

export default class Ball {
  constructor(r, boardWidth, boardHeight) {
    this.radius = r;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    this.direction = 1;
    this.ping = new Audio('public/sounds/pong-01.wav'),
    this.pong = new Audio('public/sounds/pong-02.wav'),
    this.goalSound = new Audio('public/sounds/goal-sound.wav'),
    this.gameReset ();
    this.reset();
  }



  gameReset() {
    this.x = this.boardWidth / 2;
    this.y = this.boardHeight / 2;
  }

  reset() {
    this.x = this.boardWidth / 2;
    this.y = this.boardHeight / 2;
    // generate a random number between -5 and 5 but not 0

    this.vy = 0;

    while (this.vy === 0) {
      this.vy = Math.floor(Math.random() * 14 - 7);
    }


    //a number between -5 and 5 based on vy
    this.vx = this.direction * (8 - Math.abs(this.vy));
  }
  

  wallCollision() {
    const hitLeft = this.x - this.radius <= 0;
    const hitRight = this.x + this.radius >= this.boardWidth;
    const hitTop = this.y - this.radius <= 0;
    const hitBottom = this.y + this.radius >= this.boardHeight;
    

    if (hitLeft || hitRight) {
      this.goalSound.play();
      this.vx = -this.vx;
    } else if (hitTop || hitBottom) {
      this.pong.play();
      this.vy = -this.vy;
    }
  }

  paddleCollision(player1, player2) {
    if (this.vx > 0) {
      let paddle = player2.coordinates(player2.x, player2.y, player2.width, player2.height);
      let [leftX, rightX, topY, bottomY] = paddle

      if (
        this.x + this.radius >= leftX
        && this.x + this.radius <= rightX
        && this.y >= topY
        && this.y <= bottomY
      ) {
        this.vx = -this.vx;
        this.ping.play();
      }


    } else {
      let paddle = player1.coordinates(player1.x, player1.y, player1.width, player1.height);
      let [leftX, rightX, topY, bottomY] = paddle

      if (
        this.x - this.radius <= rightX
        && this.x - this.radius >= leftX
        && this.y >= topY
        && this.y <= bottomY
      ) {
        this.vx = -this.vx;
        this.ping.play();
      }
    }
  }

  goal(player) {
    player.score++;
    this.reset();
  }

  render(svg, player1, player2) {
    this.x += this.vx;
    this.y += this.vy;

    this.wallCollision();
    this.paddleCollision(player1, player2);

    let ball = document.createElementNS(SVG_NS, 'circle');
    ball.setAttributeNS(null, 'r', this.radius);
    ball.setAttributeNS(null, 'cx', this.x);
    ball.setAttributeNS(null, 'cy', this.y);
    ball.setAttributeNS(null, 'fill', '#000');
    svg.appendChild(ball);

    let ball2 = document.createElementNS(SVG_NS, 'circle');
    ball2.setAttributeNS(null, 'r', this.radius);
    ball2.setAttributeNS(null, 'cx', this.x);
    ball2.setAttributeNS(null, 'cy', this.y);
    ball2.setAttributeNS(null, 'fill', '#000');
    svg.appendChild(ball2);

    

    // Detect goal
    const rightGoal = this.x + this.radius >= this.boardWidth;
    const leftGoal = this.x - this.radius <= 0;

    if (rightGoal) {
      this.goal(player1)
      this.direction = -1;
    } else if (leftGoal) {
      this.direction = 1;
      this.goal(player2);
    }

  }
}
