let canvas_height = 400;
let canvas_width = 600;

let scoreSize = 30;
let score = [0,0]

function isBetween(a, min, max) {
    return a > min && a < max;
}

class Ball {
    constructor() {
        this.r = 10;
        this.speed = 5;
        this.resetGame();
    }

    update() {
        this.x += this.xspeed;
        this.y += this.yspeed;
        if (this.x > canvas_width) {
            this.resetGame();
            score[0]++;
        }        
        if (this.x < 0) {
            this.resetGame();
            score[1]++;
        }

        if (this.y - this.r < 0 || this.y + this.r > canvas_height) {
            this.yspeed *= -1;
        }
    }

    resetGame() {
        this.x = canvas_width / 2;
        this.y = canvas_height / 2;
        let angle = (Math.random() - 0.5) * Math.PI / 2;
        this.xspeed = Math.cos(angle) * this.speed;
        this.yspeed = Math.sin(angle) * this.speed;

        this.xspeed *= Math.random() < 0.5 ? 1 : -1;
    }

    checkPaddle(paddle) {
        if (isBetween(this.x, paddle.x - this.r, paddle.x + paddle.w + this.r) && isBetween(this.y, paddle.y, paddle.y + paddle.h)) {
            let deltay = this.y - paddle.y - paddle.h / 2;
            let percent = deltay / (paddle.h / 2);
            this.xspeed *= -1;
            this.yspeed += percent * this.speed;
        }
    }

    draw() {
        fill("white")
        ellipseMode(RADIUS)
        ellipse(this.x, this.y, this.r)
    }
}

let paddle_w = 10;
let paddle_h = 50;

class Paddle {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.w = paddle_w;
        this.h = paddle_h;
    }

    update(type) {
        let up = 0;
        let down = 0;
        if (type === 0) {
            up = 87;
            down = 83;
        } else {
            up = UP_ARROW;
            down = DOWN_ARROW;
        }
        if (keyIsDown(up)) {
            this.y -= 5;
        }
        if (keyIsDown(down)) {
            this.y += 5;
        }
        this.y = Math.min(Math.max(parseInt(this.y), 0), canvas_height - this.h);
    }

    draw() {
        fill(255);
        rect(this.x, this.y, this.w, this.h);
    }


}



let ball = new Ball(10,10)
let paddles = []

function setup() {
    createCanvas(canvas_width, canvas_height);
    paddles[0] = new Paddle(10, canvas_height / 2 - paddle_h / 2);
    paddles[1] = new Paddle(canvas_width - 10 - paddle_w, canvas_height / 2 - paddle_h / 2);
}


function draw() {
    background(0);
    ball.update()
    ball.draw()

    for (var i = 0; i < paddles.length; i++) {
        let p = paddles[i];
        p.draw()
        p.update(i);
        ball.checkPaddle(p);
    }

    textAlign(CENTER);
    textSize(scoreSize);
    text(score[0], scoreSize, scoreSize);
    text(score[1], canvas_width - scoreSize, scoreSize);
}