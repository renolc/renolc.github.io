import Enemy from '../entities/Enemy.js'

export default () => ({
  speed: 2,

  step(game) {
    const { key, entities } = game

    if (key.pressed.KeyD) this.punch('right')
    if (key.pressed.KeyA) this.punch('left')
    if (key.pressed.KeyW) this.punch('up')
    if (key.pressed.KeyS) this.punch('down')

    if (key.held.ArrowRight) this.mx += this.speed
    if (key.held.ArrowLeft) this.mx -= this.speed
    if (key.held.ArrowDown) this.my += this.speed
    if (key.held.ArrowUp) this.my -= this.speed

    if (key.pressed.KeyP) game.add(Enemy({
      w: 20, l: 15, h: 30,
      x: Math.random() * game.canvas.width, y: Math.random() * game.canvas.height,
      color: [200, 200, 200]
    }))

    if (key.pressed.KeyR) {
      const newEntities = [this]
      delete game.entities
      game.entities = newEntities
    }
  }
})