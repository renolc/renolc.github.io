import mix from '../engine/mix.js'

import box from '../components/box.js'
import drawBoundingBox from '../components/drawBoundingBox.js'
import keyboard from '../components/keyboard.js'
import punch from '../components/punch.js'
import collision from '../components/collision.js'
import knockback from '../components/knockback.js'

export default mix(
  () => ({
    type: 'player'
  }),
  box,
  // drawBoundingBox,
  keyboard,
  punch,
  collision,
  knockback
)