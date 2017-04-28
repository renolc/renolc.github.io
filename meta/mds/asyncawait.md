# async/await
## Thu Apr 27 2017

Ever since node 7.6.0 dropped, I have been all over the `async`/`await` bandwagon. Pretty much all of my side projects use them now instead of raw Promises (at least, as much as I can), and I'm loving the clarity they provide to my code.

As an example, here is a chunk from [`chalk-blog`](https://github.com/renolc/chalk) before and after the conversion:

```js
// before
module.exports = (repoUrl) => {
  git.init()
    .then(() => git.remote.add('origin', repoUrl))
    .then(() => cp(`-r ${chalkPath}/docs/*`, './'))
    .then(() => git.add('.'))
    .then(() => git.commit('-m "New chalk blog created"'))
    .then(() => log('Done!'))
    .catch((e) => log(e.toString()))
}
```

```js
// after
module.exports = async (repoUrl) => {
  try {
    await git.init()
    await git.remote.add('origin', repoUrl)

    await cp(`-r ${chalkPath}/docs/*`, './')

    await git.add('.')
    await git.commit('-m "New chalk blog created"')

    log('Done!')
  } catch (e) {
    log(e.toString())
  }
}
```

I've heard from a few people who _prefer_ the look of the former, but to me, the latter is much more semantic. It removes the need for a lot of the Promise chain boilerplate, such as all of the necessary embedded anonymous functions (and their accompanying parentheses). It also just looks an awful lot like regular synchronous code, so it's easy to follow and reason about.

There are a few gotchas to consider when using `async`/`await` though. Namely, `await` is not available at the root level of a js file. `await` is _only_ available from within an `async` context. So instead of

```js
const results = await Promise.resolve('hi')
console.log(results)
```

you have to do something more like

```js
const run = async () => {
  const results = await Promise.resolve('hi')
  console.log(results)
}

run()
```

This is actually a feature. Not having `await` available at the root level means that you can never accidentally block the main event loop. Just like Promises themselves, you can only block a specific context _outside_ of the event loop.

So there you have it. Some basic examples of how `async`/`await` have simplified my own code, and maybe could help you too.