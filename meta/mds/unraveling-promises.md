# Unraveling Promises
## Fri Mar 10 2017

A common issue I've seen some developers struggle with is the Promise chain. Promises give us the ability to reduce [callback hell](http://callbackhell.com) in our code, but without proper understanding, they could create additional complexity instead. This easily leads into spaghetti code that is hard to follow and hard to maintain. Below, I will explain the nuances of the Promise chain using examples of bad code and how we can rewrite them for the better.

```js
// wrong
const doThing = () => new Promise((resolve, reject) => {
  otherThing()
    .then((data) => resolve(data))
    .catch((err) => reject(err))
})

// right
const doThing = () => otherThing()
```

```js
// wrong
const doThing = () => new Promise((resolve, reject) => {
  firstStep()
    .then((data) => nextStep(data))
    .then((results) => resolve(results))
    .catch((err) => reject(err))
})

// right
const doThing = () => firstStep()
  .then(nextStep)
```

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

// right
const doThing = () => firstStep()
  .then(secondStep)
```

```js
// wrong
return new Promise((resolve, reject) => {
  resolve({ /* some inline object or value */ })
})

// right
return Promise.resolve({ /* the thing */ })
```