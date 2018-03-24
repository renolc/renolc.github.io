export default (canvas) => {
  canvas.width = 800
  canvas.height = 600

  const _stepTime = 1000/60,
    _ctx = canvas.getContext('2d'),
    game = {
      canvas,
      entities: [],
      key: {
        pressed: {},
        held: {}
      },
      add(e) { this.entities.push(e) }
    }

  const _initKeys = () => {
    window.onkeydown = ({ code }) => {
      if (!game.key.held[code]) {
        game.key.pressed[code] = game.key.held[code] = true
      }
    }
    window.onkeyup = ({ code }) => {
      game.key.held[code] = false
    }
  }

  let _prevTime = 0,
    _aggregator = 0
  const _frame = (now) => {
    _aggregator += now - _prevTime
    _prevTime = now

    if (_aggregator >= _stepTime) {
      while (_aggregator >= _stepTime) {
        _aggregator -= _stepTime
        _step()
      }

      _draw()
    }

    requestAnimationFrame(_frame)
  }

  const _step = () => {
    game.entities.forEach(i => i.step(game))
    game.key.pressed = {}
  }

  const _draw = () => {
    _ctx.fillStyle = 'cornflowerblue'
    _ctx.fillRect(0, 0, canvas.width, canvas.height)
    game.entities.sort((a, b) => a.back() - b.back())
    game.entities.forEach(i => i.draw(_ctx))
  }

  _initKeys()
  requestAnimationFrame(_frame)

  return game
}