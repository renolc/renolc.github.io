import Game from 'https://unpkg.com/rengen@0.0.1/game.js'

const draw = function (ctx) {
  ctx.fillStyle = this.color || 'black'
  ctx.fillRect(this.x, this.y, this.width, this.height)
}

const intersects = function (other) {
  return !(
    this.x > (other.x + other.width) ||
    (this.x + this.width) < other.x ||
    this.y > (other.y + other.height) ||
    (this.y + this.height) < other.y
  )
}

const game = Game({
  props: {
    paused: true
  },
  
  step() {
    if (key.pressed.KeyP) this.paused = !this.paused
    if (key.pressed.KeyR) restart()
    if (mouse.clicked && this.paused) {
      this.paused = false
      mouse.clicked = false
    }
    
    return !this.paused
  },
  
  draw(ctx) {
    if(this.paused) {
      ctx.fillStyle = 'black'
      ctx.font = '48px sans-serif'
      ctx.fillText('click to play', 275, 200)
    }
  }
})

const { key, mouse } = game

const player = game.createEntity({
  x: game.width/2,
  y: game.height/2,
  
  width: 15,
  height: 30,
  
  speed: 2,
  color: 'blue',
  counter: 0,
  fireRate: 20,
  
  killCounter: 0,
  
  step() {
    if (key.held.KeyA) this.x -= this.speed
    if (key.held.KeyD) this.x += this.speed
    if (key.held.KeyW) this.y -= this.speed
    if (key.held.KeyS) this.y += this.speed
    if (this.counter % this.fireRate === 0) gun.shoot()
    
    if (key.held.KeyA ||
        key.held.KeyD ||
        key.held.KeyW ||
        key.held.KeyS) this.y += Math.sin(this.counter / 2)
    
    if (++this.counter >= 60) {
      this.counter = 0
      score.value++
    }
    
    for (let i of game.entities) {
      if (i.type === 'enemy' && !i.rising && this.intersects(i)) {
        game.remove(this)
        game.remove(gun)
      } else if (i.type === 'upgrade' && this.intersects(i)) {
        game.remove(i)
        this.fireRate = Math.max(this.fireRate-1, 2)
        explode(this.x, this.y, -1.56, 'purple', 100)
      }
    }
  },
  
  draw(ctx) {
    draw.call(this, ctx)
  },
  
  intersects(other) {
    return intersects.call(this, other)
  }
})

const bullet = {
  width: 10,
  height: 10,
  
  speed: 15,
  
  step() {
    this.x += this.speed * Math.cos(this.dir)
    this.y += this.speed * Math.sin(this.dir)
  
    if (this.x > game.width ||
        this.x < 0 ||
        this.y < 0 ||
        this.y > game.height) game.remove(this)
    
    for (let i of game.entities) {
      if (i.type === 'enemy' && this.intersects(i)) {
        game.remove(i)
        game.remove(this)
        score.value += 5
        explode(this.x, this.y, this.dir, 'orange')
        if (++player.killCounter % 5 === 0) {
          game.createEntity({
            ...upgrade,
            x: i.x,
            y: i.y
          })
        }
        break
      }
    }
  },
  
  draw(ctx) {
    draw.call(this, ctx)
  },
  
  intersects(other) {
    return intersects.call(this, other)
  }
}

const enemy = {
  type: 'enemy',
  
  width: 15,
  height: 0,
  
  speed: 1,
  color: 'green',
  targetHeight: 30,
  riseSpeed: 0.4,
  rising: true,
  counter: 0,
  
  step() {
    // rise
    if (this.rising) {
      this.height += this.riseSpeed
      this.y -= this.riseSpeed
      if (this.height > this.targetHeight) {
        this.height = this.targetHeight
        this.rising = false
      }
      return
    }
    
    // follow player
    const dir = Math.atan2(player.y - this.y, player.x - this.x)
    this.x += this.speed * Math.cos(dir)
    this.y += this.speed * Math.sin(dir)
    this.counter++
    this.y += Math.sin(this.counter / 3)
  },
  
  draw(ctx) {
    draw.call(this, ctx)
  }
}

const enemySpanwer = game.createEntity({
  frequency: 120,
  
  counter: 0,
  
  step() {
    this.counter++
    if (this.counter >= this.frequency) {
      this.counter = 0
      game.createEntity({
        ...enemy,
        x: Math.random() * game.width,
        y: Math.random() * game.height
      })
      this.frequency = Math.max(this.frequency-1, 10)
    }
  }
})

const score = game.createEntity({
  value: 0,
  
  draw(ctx) {
    ctx.font = '10px sans-serif'
    ctx.fillStyle = 'black'
    ctx.fillText(`score: ${this.value}`, 5, 10)
  }
})

const gun = game.createEntity({
  width: 10,
  length: 25,
  x: player.x + player.width/2,
  y: player.y + player.height/3,
  followRate: 0.4,
  angle: 0,
  muzzle: {
    x: player.x + player.width/2 + 25,
    y: player.y + player.height/3
  },
  
  step() {
    this.x += (player.x + player.width/2 - this.x) * this.followRate
    this.y += (player.y + player.height/3 - this.y) * this.followRate
    this.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x)
    this.muzzle.x = this.x + this.length * Math.cos(this.angle)
    this.muzzle.y = this.y + this.length * Math.sin(this.angle)
  },
  
  draw(ctx) {
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.strokeStyle = 'black'
    ctx.lineWidth = this.width
    ctx.lineTo(this.muzzle.x, this.muzzle.y)
    ctx.stroke()
  },
  
  shoot() {
    game.createEntity({
      ...bullet,
      x: this.muzzle.x - bullet.width/2,
      y: this.muzzle.y - bullet.height/2,
      dir: Math.atan2(mouse.y - this.y, mouse.x - this.x)
    })
    const dx = this.muzzle.x - this.x
    const dy = this.muzzle.y - this.y
    this.x -= dx
    this.y -= dy
    player.x -= dx/10
    player.y -= dy/10
  }
})

const spark = {
  x: game.width/2,
  y: game.height/2,
  angle: 45,
  size: 5,
  color: 'orange',
  speed: 2,
  alpha: 1,
  fadeRate: 0.05,
  
  step() {
    this.x += this.speed * Math.cos(this.angle)
    this.y += this.speed * Math.sin(this.angle)
    this.speed *= 0.92
    this.alpha -= this.fadeRate
    if (this.alpha < 0) game.remove(this)
  },
  
  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.size, this.size)
    ctx.restore()
  }
}

const upgrade = {
  color: 'purple',
  x: 100,
  y: 100,
  width: 20,
  height: 20,
  counter: 0,
  type: 'upgrade',
  
  step() {
    this.y += Math.sin(this.counter++ / 15) / 2
  },
  
  draw(ctx) {
    draw.call(this, ctx)
  }
}

const explode = (x, y, angle, color, num=25) => {
  for (let i = 0; i < num; i++) {
    const s = game.createEntity({
      ...spark,
      angle: angle + Math.random() - 0.5,
      speed: 3 * Math.random() + 1,
      x, y,
      fadeRate: Math.random() * 0.04 + 0.02,
      color
    })
  }
}

const restart = () => {
  game.entities = [player, gun, enemySpanwer, score]
  player.x = game.width/2
  player.y = game.height/2
  enemySpanwer.frequency = 120
  enemySpanwer.counter = 0
  game.paused = true
  score.value = 0
  gun.x = player.x + player.width/2
  gun.y = player.y + player.height/3
  gun.angle = 0
  gun.muzzle = {
    x: gun.x + gun.length,
    y: gun.y
  },
  player.fireRate = 20
  player.killCounter = 0
}