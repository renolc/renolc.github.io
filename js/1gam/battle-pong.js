class Rectangle {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  draw(ctx) {
    ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height)
  }

  get left() { return this.x - this.width/2 }
  get right() { return this.x + this.width/2 }
  get top() { return this.y - this.height/2 }
  get bottom() { return this.y + this.height/2 }

  intersects(other) {
    return !(
      this.left > other.right ||
      this.right < other.left ||
      this.top > other.bottom ||
      this.bottom < other.top
    )
  }
}

class Ball extends Rectangle {
  constructor() {
    super(canvas.width/2, canvas.height/2, 20, 20)

    this.startSpeed = this.speed = 0
    this.reset()
  }

  get size() { return this.width }
  set size(val) { this.width = this.height = val }

  step(diff) {
    this.x += this.speed * this.vector.x * diff
    this.y += this.speed * this.vector.y * diff

    if (this.y <= (this.height/2)) this.vector.y = 1
    if (this.y >= canvas.height - (this.height/2)) this.vector.y = -1
    if (this.x >= canvas.width - (this.width/2)) {
      state.score.player++
      this.reset()
    }
    if (this.x <= (this.width/2)) {
      state.score.ai++
      this.reset()
    }
  }

  hit() {
    this.speed += this.speed ? 0.02 : 0.1
    if (Math.random() > 0.5) this.vector.y *= -1
  }

  reset() {
    this.speed = this.startSpeed
    this.x = canvas.width / 2
    this.y = canvas.height / 2
    this.vector = {
      x: 0,
      y: 1
    }
  }
}

class Paddle extends Rectangle {
  constructor(x, dir) {
    super(x, canvas.height/2, 15, 75)

    this.dir = dir
    this.cooldown = 0
  }

  step(diff, target) {
    this.y = lerp(this.y, target, diff/(100/6) * 0.1)
    if (this.cooldown > 5) this.fire()
    else this.cooldown++
  }

  fire() {
    state.bullets.push(new Bullet(this.x, this.y, this.dir))
    this.cooldown = 0
  }
}

class Bullet extends Rectangle {
  constructor(x, y, dir) {
    super(x, y, 10, 10)

    this.dir = dir
    this.speed = 1
  }

  step(diff) {
    this.x += this.speed * this.dir * diff

    if (this.x >= canvas.width) this.remove()
  }

  remove() {
    state.bullets.splice(state.bullets.indexOf(this), 1)
    delete this
  }
}

////////////////////////////////////////////////////////////////////////////////////

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

canvas.style.border = '5px solid black'
ctx.fillStyle = 'black'

// set canvas size
canvas.width = 800
canvas.height = 600

// init game state
const state = {
  paused: true,
  last: null,
  bullets: [],
  ai: 'easy',
  score: {
    player: 0,
    ai: 0
  }
}

const paddleOffset = 30
const ball = new Ball()
const left = new Paddle(paddleOffset, 1)
const right = new Paddle(canvas.width - paddleOffset, -1)

// main loop
const step = (time) => {
  // clear screen
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // get time since last step
  const diff = state.last ? time - state.last : 0
  state.last = time


  ctx.font = '10px sans-serif'
  ctx.fillText(state.ai, 5, 10)
  ctx.fillText(`player:  ${state.score.player}`, 5, 22)
  ctx.fillText(`ai:         ${state.score.ai}`, 5, 34)

  // check if paused
  if (state.paused) {
    ctx.font = '48px sans-serif'
    ctx.fillText('click to play', 275, 200)
  } else {

    // update game state
    state.bullets.forEach(i => i.step(diff))
    ball.step(diff)
    left.step(diff, mouse.y)
    const lead = state.ai === 'easy' ? 0 : state.ai === 'normal' ? (right.height/2) : right.height
    right.step(diff, (ball.vector.x > 0) ? (ball.y + (ball.vector.y * lead)) : (canvas.height/2) + (ball.y/2 - canvas.height/4))

    state.bullets.forEach(i => {
      if (i.intersects(ball)) {
        ball.vector.x = i.dir
        ball.hit()
        i.remove()
      } else {
        state.bullets.forEach(j => {
          if (i !== j && i.intersects(j)) {
            i.remove()
            j.remove()
          }
        })
      }
    })

    if (ball.intersects(left)) {
      ball.vector.x = 1
    } else if (ball.intersects(right)) {
      ball.vector.x = -1
    }
  }

  // draw game state
  state.bullets.forEach(i => i.draw(ctx))
  ball.draw(ctx)
  left.draw(ctx)
  right.draw(ctx)

  // schedule next step
  requestAnimationFrame(step)
}

// track mouse position
const mouse = {
  y: canvas.height / 2
}
canvas.onmousemove = ({ offsetY }) => {
  mouse.y = offsetY
}
canvas.onclick = () => {
  state.paused = false
}

document.onkeypress = ({ code }) => {
  switch (code) {
    case 'KeyP':
      state.paused = !state.paused
      break

    case 'KeyR':
      ball.reset()
      state.bullets = []
      state.paused = true
      left.y = right.y = canvas.height/2
      state.score = {
        player: 0,
        ai: 0
      }
      break

    case 'KeyE':
      state.ai = 'easy'
      break

    case 'KeyN':
      state.ai = 'normal'
      break

    case 'KeyH':
      state.ai = 'hard'
      break
  }
}

const lerp = (current, target, rate = 0.1) => current + ((target - current) * rate)

// start
requestAnimationFrame(step)