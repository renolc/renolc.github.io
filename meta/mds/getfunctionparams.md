# get-function-params
## Mon Jul 24 2017

Continuing my (pseudo) series on [`chalk-blog`](https://renolc.github.io/posts/introducing-chalkblog) related projects, here's a quick overview of [`get-function-params`](https://github.com/renolc/get-function-params).

As the name implies, `get-function-params` is a utility used to obtain a list of parameters given a function. This was necessary for my `ezcli` package, because I didn't want to require users to declare parameters twice (once in the function itself, and once as command metadata). Instead, I just wanted to use the defined function parameters directly.

And thus I dived into the world of parameter parsing in JavaScript. Turns out, it's a hard problem to solve.

JavaScript doesn't have any sort of _real_ reflection, but I quickly discovered you can convert any function directly into a string which will reveal the complete implementation:

```js
const sayHello = (name) => `Hello, ${name}!`

// prints '(name) => `Hello, ${name}!`'
console.log(sayHello.toString())
```

I first tried to be clever with my parsing and just tried to do a series of `split`s and `reduce`s, but that didn't last very long. There were just too many different ways to define functions (vanilla, with default arguments, arrow functions, generators, implicit return single line arrow functions, etc). Things got _especially_ hairy when you considered the possibility of default arguments being complete functions _themselves_:

```js
const executeFn = (fn = () => 'nop') => fn()

// or without arrow functions
var executeFn = function (fn = function () { return 'nop' }) {
  return fn()
}
```

As you can see, naive string splitting might be a bit too optimistic and exclude too many edge cases. So instead, I had to turn to the much more powerful (and complicated) regex.

Now, I'm not particularly _good_ at regex. Thankfully, sites like [regex101.com](https://regex101.com/) exist to let me experiment and give me real-time feedback. But even with the power of regex, it was a very difficult thing for me to figure out. Perhaps someone more familiar with complex expressions could solve it, but my code was becoming very hard for me to parse and fix and I kept finding more and more edge cases I had to address.

It occurred to me that if I could just remove the parts of the function that I knew I didn't care about, I could reduce the function string into something more manageable. With this approach, instead of writing a complex, monolithic expression that had to work in all cases, I could chain together a series of much smaller and simpler ones -- each pass reducing the overall complexity of the remaining string for the following expression. By the end of the chain, I should have something much easier to deal with.

To me, this felt a lot like "encoding." I'm not sure if that term is technically correct, but I rolled with it. The idea is actually quite simple when you think about it. Lets start with this function:

```js
// NOTE: all the code in the remainder of this post will be more pseudo-code
// rather than completely elaborated examples. This is for high level demo
// purposes. If you want a more specific example, look at the code on github.

function getThing (a = {}, b = 'key') {
  return a[b]
}
```

So first thing's first, we convert it into a string:

```js
var fnString = getThing.toString()
// "function getThing(a = {}, b = 'key') {\n  return a[b]\n}"
```

Now we can start pruning away chunks of this that we don't care about (at least right now). For example, all the strings. This is a much simpler regex, and doing a `replace` will result in:

```js
var match = /'.*?'/.exec(fnString)

var cache = []

fnString = fnString.replace(match, `:~:${cache.push(match)}:~:`)
// results in "function getThing(a = {}, b = :~:1:~:) {\n  return a[b]\n}"
```

We find a match that gives us the string portion of the function. We then do a replace on that match, and replace it with a fancy looking string along with an array index. The index can be used later to retrieve the replaced content from a cache array (if need be).

Similarly, we find and replace all blocks of arrays, then braces.

```js
fnString = fnString.replace(arrayMatch, `:~:${cache.push(arrayMatch)}:~:`)
// "function getThing(a = {}, b = :~:1:~:) {\n  return a:~:2:~:\n}"

fnString = fnString.replace(braceMatch, `:~:${cache.push(braceMatch)}:~:`)
// "function getThing(a = :~:3:~:, b = :~:1:~:) :~:4:~:"
```

After all of that, we now have a very simple string where we just have to detect the parentheses and bam, we have the parameter list:

```js
var params = fnString.match(parenExpression)
// params = "a = :~:3:~:, b = :~:1:~:"
```

The final step is to then split up the array list and decode as needed:

```js
params = params.split(',')
  .map((i) => {
    var id
    while ((id = i.match(encodedExpression)) !== null) {
      i = i.replace(`:~:${id}:~:`, cache[id-1])
    }
    return i
  })

// params = ["a = {}", "b = 'key'"]
```

And there you have it! Please note the actual code is more complicated than indicated above, and there are more expressions I didn't address here (namely around detecting/parsing arrow functions), as well as a _ton_ of edge cases that I have been correcting as I discover them. There are probably lots I still haven't seen yet.

As mentioned before, I'm not sure if this is the _best_ approach, but it has been working for my purposes so far.