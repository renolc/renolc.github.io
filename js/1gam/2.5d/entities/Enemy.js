import mix from '../engine/mix.js'

import box from '../components/box.js'
import drawBoundingBox from '../components/drawBoundingBox.js'
import knockback from '../components/knockback.js'
import collision from '../components/collision.js'

export default mix(
  () => ({
    type: 'enemy'
  }),
  box,
  collision,
  knockback,
  () => ({
    step({ player }) {
      if (player.x < this.x) this.mx--
      if (player.x > this.x) this.mx++
      if (player.y < this.y) this.my--
      if (player.y > this.y) this.my++
    }
  })
  // drawBoundingBox,
)