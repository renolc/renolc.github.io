export default () => ({
  dx: 0, dy: 0,
  drag: .9,

  step() {
    this.mx += this.dx
    this.my += this.dy

    this.dx *= this.drag
    this.dy *= this.drag
  }
})