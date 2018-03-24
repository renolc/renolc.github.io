import Game from './engine/Game.js'

import Player from './entities/Player.js'
import Wall from './entities/Wall.js'
import Enemy from './entities/Enemy.js'

const game = Game(document.getElementById('game'))

game.player = Player({
  w: 20, l: 15, h: 30,
  x: 170, y: 200,
})

game.add(game.player)