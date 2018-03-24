import Enemy from '../entities/Enemy.js'

export default () => ({
  speed: 2,

  step(game) {
    const { key, entities } = game

    if (key.pressed.KeyL) this.punch('right')
    if (key.pressed.KeyJ) this.punch('left')
    if (key.pressed.KeyI) this.punch('up')
    if (key.pressed.KeyK) this.punch('down')

    if (key.held.KeyD) this.mx += this.speed
    if (key.held.KeyA) this.mx -= this.speed
    if (key.held.KeyS) this.my += this.speed
    if (key.held.KeyW) this.my -= this.speed

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