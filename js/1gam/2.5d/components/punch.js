import filterItem from '../engine/filterItem.js'

export default () => ({
  showPunch: 0,
  punchDir: 'right',
  punchY: 0,
  punchX: 0,
  punchDX: 0,
  punchDY: 0,

  punch(dir) {
    this.showPunch = 5
    this.punchDir = dir
  },

  punches(other) {
    return !(
      this.punchX > other.right() ||
      this.punchX+20 < other.left() ||
      this.punchY > other.y+other.l ||
      this.punchY+20 < other.y-other.h
    )
  },

  step({ entities }) {
    switch(this.punchDir) {
      case 'right':
        this.punchY = this.y-this.h/1.5
        this.punchX = this.x+this.w
        this.punchDX = 1
        this.punchDY = 0
        break

      case 'left':
        this.punchY = this.y-this.h/1.5
        this.punchX = this.x-20
        this.punchDX = -1
        this.punchDY = 0
        break

      case 'up':
        this.punchY = this.y-this.h-15
        this.punchX = this.x
        this.punchDX = 0
        this.punchDY = -1
        break

      case 'down':
        this.punchY = this.y-this.h+20
        this.punchX = this.x
        this.punchDX = 0
        this.punchDY = 1
        break
    }

    if (this.showPunch) {
      this.showPunch--

      const hit = entities.filter(i => filterItem(this, i, 'enemy') && this.punches(i))
      if (!hit.length) return

      hit.forEach(i => {
        i.dx += this.punchDX * 10
        i.dy += this.punchDY * 5
      })
    }

  },

  draw(ctx) {
    if (this.showPunch) {
      ctx.fillStyle = `rgb(${this.color.join(',')})`
      ctx.fillRect(this.punchX, this.punchY, 20, 20)
    }
  }
})