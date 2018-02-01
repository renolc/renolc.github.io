# 1GAM February: Obligatory Zombie Game
## Thu Feb 01 2018

Oh no, it's that darned zombie apocalypse... _again_. Good thing I have my trusty sidearm on me -- this thing packs quite a punch! Unfortunately, the trigger is jammed so I can't stop shooting. Perhaps some of these zambos will have some parts on them so I can at least increase the fire rate. Here's to the end of the world.

<canvas id="game"></canvas>
<script type="module" src="../js/1gam/zambos.js"></script>

- Mouse - aim
- W/A/S/D - move
- R - reset
- P - pause/resume
- [source](https://github.com/renolc/renolc.github.io/blob/master/js/1gam/zambos.js)

For this game, I'm experimenting with `type="module"` scripts. This should essentially allow me to write my code like I would for Node, but on the Browser without having to bundle. I'm certain there are some browsers where this won't work, but as I mentioned last month, I'm only testing on latest Chrome and it works there. :P

Since I can use modules now, it allowed me to split out some code into separate files. I took some of my boilerplate from last month, cleaned it up a bit, and slapped it into an [npm module](https://www.npmjs.com/package/rengen). Then, using [unpkg](https://unpkg.com/) I can import my "engine" code from a cdn and just focus on the game specific code itself. Pretty neat.

My "engine" is still fairly barebones. I can foresee me updating it as I continue building different types of games each month, so I didn't bother documenting it yet. Maybe it'll turn into something useful though.

I have a lot more game ideas and experiments that I plan to flesh out into small prototypes, so I'll see you again next month!