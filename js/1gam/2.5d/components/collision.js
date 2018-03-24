import filterItem from '../engine/filterItem.js'

export default () => ({
  mx: 0, my: 0,

  step({ entities }) {
    // move x
    this.x += this.mx

    // check for collisions
    let other = entities.find(i => filterItem(this, i) && this.intersects(i))
    if (other) {
      let mmx = -Math.sign(this.mx)
      while(this.intersects(other)) {
        if (!mmx) break
        this.x += mmx
      }
      if (this.dx != null && other.dx != null) {
        other.dx += this.dx
        this.dx = 0
      }
      if (other.type === 'player') {
        other.dx = this.mx
      }
    }

    // move y
    this.y += this.my

    // check for collisions
    other = entities.find(i => filterItem(this, i) && this.intersects(i))
    if (other) {
      let mmy = -Math.sign(this.my)
      while(this.intersects(other)) {
        if (!mmy) break
        this.y += mmy
      }
      if (this.dy != null && other.dy != null) {
        other.dy += this.dy
        this.dy = 0
      }
      if (other.type === 'player') {
        other.dy = this.my
      }
    }

    this.mx = this.my = 0
  }
})