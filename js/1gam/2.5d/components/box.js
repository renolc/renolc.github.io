export default () => ({
  x: 0, y: 0,
  l: 0, w: 0, h: 0,
  color: [240, 0, 0],

  intersects(other) {
    return !(
      this.left() > other.right() ||
      this.right() < other.left() ||
      this.front() < other.back() ||
      this.back() > other.front()
    )
  },

  left() { return this.x },
  right() { return this.x + this.w },
  back() { return this.y },
  front() { return this.y + this.l },

  draw(ctx) {
    const sideColor = this.color.map(i => i -= 40)
    ctx.fillStyle = `rgb(${sideColor.join(',')})`
    ctx.fillRect(this.x, this.y-this.h, this.w, this.l+this.h)

    ctx.fillStyle = `rgb(${this.color.join(',')})`
    ctx.fillRect(this.x, this.y-this.h, this.w, this.l)
  }
})