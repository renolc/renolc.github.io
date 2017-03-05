# Hello, World!

This is the first post of my new blog. It's mostly for testing and style tweaking, so it's fairly sparse.

Here's some code:

```js
const fit = (n) => {
  if (n <= 0) return 0
  if (n === 1 || n === 2) return 1
  return fib(n-1) + fib(n-2)
}
```

It's not very efficient, but it works.