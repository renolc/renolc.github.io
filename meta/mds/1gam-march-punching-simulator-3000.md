# 1GAM March: Punching Simulator 3000
## Fri Mar 23 2018

So this month I spent way too much time playing around with engine structures and basic prototypes. So I don't have a full game, but instead here is one of the little demos I was playing around with trying to make something fun.

<canvas id="game"></canvas>
<script type="module" src="../js/1gam/march/2.5d.js"></script>

- Up/Down/Left/Right - move
- W/A/S/D - punch up/left/down/right
- P - spawn enemy box thing
- R - remove all enemy box things
- [source](https://github.com/renolc/renolc.github.io/blob/master/js/1gam/2.5d/)

Not much to this "game", as it was more of a test rather than a real game. There's no goal, or points, or anything. You "win" by punching things and having fun. You lose if you get stuck or bored? Idk, whatever. Do what you want.

So structure wise, this was built with a test in entity composition. There are components which are basic building structures of functionality, like rendering a box shape, or collisions, or keyboard input. Entities are aggregations of components that are instantiated into real objects the game engine will manage.

Components can have arbitrary properties and functions. Entities will mix all of its defining components into a single object, so you do need to be considerate of what properties and functions you define, as collisions are entirely possible.

There are two special functions though, `step`, and `draw`. These are handled differently, as any component can define them and they will all be called by the engine at defined intervals (`step` every simulation step and `draw` every frame). These functions are aggregated into a master collection per entity and all of them are called. So you can have multiple components with steps and draws. The idea being you can then define things in relatively small, discrete simulation/draw steps that only care about themselves, but when combined with other components creates something more interesting.

Also, this was an experiment in pseudo 3d rendering (more accurately, 2.5d). It's subtle since it's really just two slightly different colored boxes drawn over each other, but when viewed with the right mindset, it appears kind of 3d. The collisions were also made so they appear to have some depth.

In this specific prototype there isn't much to it, but I did also have something vastly more complicated working:

<img src="../img/3dish.gif">

I was very proud of that test. I even added fancy shadowing, so that you could more accurately tell where you were in relation to other boxes. However, I kept having z-ordering issues, and it occurred to me that I was just recreating a crappier version of webgl, so I probably won't do much with it anymore. Maybe I'll try a game in _actual_ webgl though, so that I could do some real 3ding.