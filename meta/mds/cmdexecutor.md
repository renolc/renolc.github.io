# cmd-executor
## Sat Apr 08 2017

Yet another [`chalk-blog`](/posts/introducing-chalkblog) spin-off, this time I want to talk about [`cmd-executor`](https://github.com/renolc/cmd-executor), which may be my favorite package I've written so far.

So while working on `chalk-blog`, a decent chunk of the work was interfacing with `git`. I looked into using a package, but many were older or just way too complex for my simple needs. So instead I made a simple `Promise` wrapper around `child_process.exec` (which you can view [here](https://github.com/renolc/simple-exec-promise)).

This solution worked well, because it allowed me to execute arbitrary commands, which means I would never have to worry about "supporting" certain git features or going out of date. Instead, I could just `await exec('git init')` and it would work as expected.

However, writing all my commands as strings didn't seem ideal. I'm sure it's all psychological, but for some reason it feels more "right" to do something like `git.init()` rather than `exec('git init')`, even if they are doing the same thing under the hood. And so, I set off on my ultimately unnecessary quest to enhance my `exec` wrapper.

My first solution was naive, but workable. Something similar to:

```js
const git = {
  init: () => exec('git init'),
  add: (path) => exec(`git add ${path}`),
  // etc
}
```

It was clean, and to the point. However, it kind required me to re-declare _every_ git command I wanted to support. For my own needs, this probably would have been ok, since I only was planning on using something like 2-3 basic commands anyway. However, I wanted to see if I could generalize this somewhat.

Looking at the code above, it was becoming clear that my desired method of execution would be something like `git.command()` which converts directly into `git command`. I wanted this to be arbitrarily nested though, meaning `git.remote.add('origin', url)` would also be valid, even though it is multiple layers deep. Also, I didn't want to have to manually declare any of this. Luckily, I had already done some initial research into [`Proxy` objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) for a previous side project.

`Proxy` objects are neat. Basically, you wrap another object and can intercept all incoming interactions. This seemed perfect for my needs, so I dug a little deeper into the docs. Before too long, I had my solution, and it was a whopping... [10 lines of code](https://github.com/renolc/cmd-executor/blob/master/index.js).

After playing around with my solution, I realized how arbitrary I could really make this. Why limit myself to just `git` commands? Why not the whole CLI? So I renamed the package and republished with some more examples, and voila, `cmd-executor` was born.

The tl;dr of the code is that it will accept _any_ property request and return a function. That function would likewise accept any property request (returning _another_ function... ad infinitum), _or_ you could _execute_ the function which will concatenate together the accessed properties into a string and pass them along to my original `Promise`ified, `exec` function.

It's easier shown than explained:

```js
const cmd = require('cmd-executor')

cmd.git.init() // runs "git init"
cmd.echo('hi') // runs "echo hi"
cmd.mkdir('bork') // runs "mkdir bork"
```

And if you really only care about certain commands:

```js
const { git, echo, touch } = require('cmd-executor')

git.remote.add('origin', url)
echo('hi')
touch('a.txt')
```

As mentioned before, all commands eventually run via a `Promise`ified `exec`, meaning you can use `await` or `.then` to sequence:

```js
const { git } = require('cmd-executor')

const run = async () => {
  await git.init()
  await git.remote.add('origin', url)
  await git.add('.')
  await git.commit('-m "Initial commit"')
  await git.push()
}

run()
```

Overall, I think it's pretty darn neat. Especially for just a few lines of code. If you want to learn more, there are some additional advanced examples on the [README](https://github.com/renolc/cmd-executor/blob/master/README.md), or you can check out how I'm using it in some of my [`chalk-blog` code](https://github.com/renolc/chalk/blob/master/commands/publish.js).