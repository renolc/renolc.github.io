export default () => ({
  draw(ctx) {
    ctx.strokeStyle = 'lime'
    ctx.lineWidth = 2
    ctx.strokeRect(this.x, this.y, this.w, this.l)
  }
})