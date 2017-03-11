# Unraveling Promises
## Sat Mar 11 2017

A common issue I've seen some developers struggle with is correctly utilizing the  Promise chain. Promises give us the ability to reduce [callback hell](http://callbackhell.com) in our code, but without proper understanding, they could create additional complexity instead. This easily leads into spaghetti code that is hard to follow and hard to maintain. Below, I will explain the nuances of the Promise chain using examples of complex code and how we can simplify.

```js
// wrong
const doThing = () => new Promise((resolve, reject) => {
  firstStep()
    .then((results) => {
      secondStep(results)
        .then((data) => resolve(data))
        .catch((err) => reject(err))
    })
    .catch((err) => reject(err))
})
```

This is a fairly classic example of several things gone wrong with Promises. We'll tackle it one issue at a time, starting with...

## `then` and `catch`

Promises are essentially a container object that will eventually resolve with a value or reject with an error. You provide callback functions (via `then` and `catch`) in order to handle each case, and the respective function will be called with either the results or the error.

The functions you pass to `then` and `catch` expect exactly one parameter each. It's a common practice to define these as inline anonymous functions like so: `.then((data) => { /* do something with data */ })`. However, if you ever see something like this then a red flag should go off: `.then((data) => resolve(data))`.

The error is a bit subtle, so I will try to explain as clearly as I can. You have the `resolve` function provided to you through the containing `new Promise`. It is a function handler that is expecting exactly one parameter. As stated before, `then` is expecting a function handler that is also expecting one parameter. So... we don't have to wrap `resolve` in another function. Instead, we can just pass it straight into the `then` like so: `.then(resolve)`. This is exactly the same functionally as before, but without the unnecessary wrapping. This same pattern applies to `catch` and `reject`, so now our code looks like this:

```js
// slightly less wrong
const doThing = () => new Promise((resolve, reject) => {
  firstStep()
    .then((results) => {
      secondStep(results)
        .then(resolve) // <--
        .catch(reject) // <--
    })
    .catch(reject) // <--
})
```

## Chaining

One of the best features of Promises is the Promise chain. Basically, within a `then` or `catch`, you can `return` data which will be passed along into another `then`. If what you return is another Promise, it will wait for _that_ Promise to resolve or reject before continuing. This means that if you have two Promises and you want them to occur in sequence, all you have to do is return the 2nd Promise from the `then` handler of the first. From that you can append another `then` which will handle the results of that 2nd Promise. Likewise, a `catch` at the end of the chain will handle errors from either Promise (and skip any `then`s that haven't executed yet).

So if we update our code to return `secondStep` from the `firstStep.then`, we have:

```js
// getting there, but still wrong
const doThing = () => new Promise((resolve, reject) => {
  firstStep()
    .then((results) => secondStep(results)) // <--
    .then(resolve) // <--
    .catch(reject) // <--
})
```

This is already looking a lot better since we aren't nesting nearly as much, but did you spot the error above? Just like before, we now have a function (`secondStep`) that accepts a single parameter and we are wrapping it in _another_ function that _also_ accepts a single parameter. So like earlier, we can pass `secondStep` _direclty_ into the `then` instead.

```js
// much easier to follow, but still slightly wrong
const doThing = () => new Promise((resolve, reject) => {
  firstStep()
    .then(secondStep) // <--
    .then(resolve)
    .catch(reject)
})
```

## Unwrap

Let's think about what `doThing` is actually _doing_:

1. when you call it, it returns a Promise (which you can call `then` on)
2. that Promise executes `firstStep`, which is _also_ returning a Promise
3. when `firstStep` resolves, it passes the results to `secondStep`
4. when `secondStep` resolves, it resolves the outer Promise with the results
5. if any errors occur during `firstStep` or `secondStep`, it rejects the outer Promise with the error
6. any defined `then` or `catch` on `doThing()` will handle the resolve/reject of the outer Promise

Looking at that breakdown, does anything seem unnecessary? Well... why are we creating a Promise in the first place? `firstStep` is _already_ returning a Promise, so why not just return it directly? If we do that, we no longer need the `.then(resolve)` or `.catch(reject)` lines. Instead, the chain we are creating is _already_ `then`able, so there is no benefit in handling the results (or errors) just to resolve them again.

```js
// right!
const doThing = () => firstStep()
  .then(secondStep)
```

Now let's think about the flow, just to make sure it is functionally equivalent:

1. when you call `doThing`, it executes `firstStep` which returns a Promise
2. when `firstStep` resolves, it passes the results to `secondStep`
3. when `secondStep` resolves, it will call any defined `then` functions with the results
4. if `firstStep` or `secondStep` error, they will call any defined `catch` functions

Thinking through it, we can conclude that this code works the same as our original, only it is significantly reduced in size and complexity. Hopefully this example was helpful to you and now you understand Promises a little better than before.