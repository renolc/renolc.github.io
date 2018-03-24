export default (...mixins) => (opts = {}) => {
  const _steps = [],
    _draws = []

  return mixins.reduce((obj, mixin) => {
    const toMix = mixin()

    let { step, draw } = toMix

    if (step) {
      _steps.push(step)
      delete toMix.step
    }

    if (draw) {
      _draws.push(draw)
      delete toMix.draw
    }

    obj = ({
      ...obj,
      ...toMix,
      ...opts,
      step(game) { _steps.forEach(i => i.call(obj, game)) },
      draw(ctx) { _draws.forEach(i => i.call(obj, ctx)) }
    })

    return obj
  }, {})
}