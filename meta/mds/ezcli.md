# ezcli
## Fri Mar 31 2017

As mentioned in [Introducing: chalk-blog](/posts/introducing-chalkblog), while working on my blogging system I pulled out various useful pieces into their own packages. These were parts of the system I thought could be useful outside the scope of `chalk-blog` and thus deserved their own dedicated distributions. `ezcli` was the first of those packages.

The long and short of it is, `chalk-blog` was meant to be a CLI app. I originally started with [`commander.js`](https://www.npmjs.com/package/commander), which is an excellent system. However, I quickly discovered that I didn't care about 90% of the features offered to me, and the other 10% required a bit more boilerplate than I would have liked. And so, I scrapped it all and started doing it all manually.

After a few iterations, I started to genuinely like how it worked. So like a good little developer, I pulled out that code and slapped it into its own package.

The API is highly based off of `commander.js`:

```js
const cli = require('ezcli')

cli('myApp')
  .command('task', () => console.log('in task'))
  .command('hi', (name) => console.log('hello', name))
  .command('bye', (name = 'Phil') => console.log('goodbyte', name))
  .process()
```

And that's it. That's the whole API.

There is a decent amount of magic behind the scenes, but in true sense of the "convention over configuration" mindset, if your use case falls within the realm of `ezcli`, it keeps much of the complexity out of sight and out of mind.

The big features are:

1. **automatic usage messages**

   ```
   $ myApp

     v1.0.0

     Usage: myApp <command>

     Commands:
       task
       hi <name>
       bye [name = 'Phil']


   $ myApp hi

     Usage: myApp hi <name>

   ```

2. **automatic command signatures**

   You may have noticed in the usage messages above that `hi` had the argument `<name>` generated. Likewise, `bye` had the optional argument, `[name = 'Phil']`, generated. Where did these come from? From the provided functions, of course!

   Since you are already providing function handlers for each command, and those functions already will have expected arguments defined on them, why should you have to define them again? `ezcli` will automatically parse out argument names as well as default values and automatically include them in your subcommand signatures. This info is then used to generate your usage messages and to inform the user if they are missing any required parameters.

Some potential drawbacks you may want to consider:

1. **no default function**

   `ezcli` was definitely made with my own use cases in mind, first and foremost. Because of that, it doesn't include any sort of "default" function handler. So running `myApp` from above will not do anything in itself. Instead, it will just display a usage message. Similar to how `git` works, since `git` doesn't do anything by itself. Instead, you are required to use `git <something>`. This is the model I wanted to emulate for my blogging platform, and thus, I haven't currently had a need for any default functions

2. **argument parsing is imperfect**

   It turns out not having real reflection built in to JavaScript makes argument parsing difficult. This is another piece of code that I pulled out into its own package, so I plan to improve it as I can, but it's not that difficult to confuse. Such as if you have a parameter with a default value of another function. It works for primitives for now, which is all I currently need.

3. **probably missing things you might find essential**

   As mentioned before, this was made with my own needs in mind. So things you may absolutely need just may not be there. Off the top of my head, these may include:  flags or flag arguments, custom usage messages, command descriptions, and probably much more. These are simply features I haven't needed, so they aren't there. I may or may not add some of them in the future.

   If you really need something more robust, I would highly recommend `commander.js`.

And that's about it. If you would like to check out `ezcli`, you can install it through [`npm`](https://www.npmjs.com/package/ezcli) or check out the code on [`github`](https://github.com/renolc/ezcli).