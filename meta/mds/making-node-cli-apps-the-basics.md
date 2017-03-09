# Making Node CLI Apps: The Basics

Node is actually a pretty good choice when you want to make a command line application. On my journey to create [`chalk-blog`](https://renolc.github.io/posts/introducing-chalkblog), I had to research some of these basics and figured I would consolidate them into a single blog for posterity.

## Why make CLI apps?

First, why would you consider making a CLI app? A few scenarios where this might make sense:

- your job requires you to occasionally do some repetitious work on irregular intervals
- you have some scripts you occasionally run and might want to share them with others
- just because

## Why node?

Why should you consider node for your runtime?

- JavaScript is incredibly flexible
- there are [hundreds of thousands of packages](http://www.modulecounts.com) to help bootstrap your code
- `npm` has made it easy on us with some useful commands
- likewise, `npm` is great for distributing and updating your app
- just because

## How to do the thing?

Ok, lets do this.

### 1. `package.json`

The first step is to update your `package.json` file to let `npm` know you will want to include an executable file in your package.

```js
// package.json
{
  "name": "my-app",
  "bin": "./index.js"
}
```

By simply including the `"bin"` property and pointing it to a `.js` file, `npm` will automatically install that file where necessary upon install. So you don't have to worry about ensuring the file ends up in some folder available in the `PATH`. You can just tell people to `npm i my-app -g` as normal and, ta-da, it's available to them!

The binary name will default to the name of your package, so in this case, it would install a `my-app` command. For this reason, you should take caution when naming your package. If you give it a name of a command already available, the `npm i` might fail.

If you want to name the installed command something other than your package name, or if you want to install more than one command within the same package, there is an alternative setup available:

```js
// package.json
{
  "name": "my-app",
  "bin": {
    "my-command": "./command.js",
    "my-other-command": "./other.js"
  }
}
```

This version will create multiple commands that are named whatever key you give them. So in this case, you will create a `my-command` and `my-other-command` executable. This can be very useful if you have multiple scripts that may be different enough to warrant placing them in their own commands, but related enough that they should be package together. Now anyone can install or update them all with just one `npm i` command!

### 2. `#!/usr/bin/env node`

Sadly, you can't really just put JavaScript code in your `.js` file, point at it with `"bin"` and expect everything to work out dandy. First you need to include the `#!/usr/bin/env node` header at the top of your script to ensure it runs under the correct context.

If you've ever written a bash script, you may be familiar with the `#!/usr/bin/bash` header. This is the same thing, only it points to whatever node version the user currently has on their system.

If you're not familiar with headers like this, the long and short of it is, you are essentially just making an alias command that points directly to your `.js` file. This means, running your command isn't really any different than just trying to execute the `.js` file directly. If you try this without the correct header, it will default to assuming your file is a bash script and then complain upon the first instance of unfamiliar syntax (which will probably be fairly quickly since JavaScript and bash are pretty different). By declaring the header, it will tell the OS that this is a node script specifically and that it should be executed with that runtime.

### 3. `process.argv`

You'll probably want your command to handle some sort of input. This is most commonly done through command line arguments. In node, you access the command line arguments through the `process.argv` property.

Something to consider is the first two values of `process.argv` will always point to the path of the node binary and the path of the executing script, respectively. So if your script does something like this: 

```js
#!/usr/bin/env node
console.log('process.argv:', process.argv)
```

you could expect the output to look like this:

```bash
$ my-app hello world
process.argv: [ '/usr/local/bin/node',
  '/path/to/your/index.js',
  'hello',
  'world' ]
```

You probably don't care about those paths, so you can easily `.slice` them off the front of the array:

```js
const args = process.argv.slice(2)
```

### 4. `npm link`

How should you test your app? If you're as naive as me, you might originally think:

1. code code code
2. `npm publish` a version of your app
3. `npm i -g` your app
4. test test test
5. goto step 1

This is, of course, slow, tedious, and overall not a very good time. Anyone who bothers reading the docs (or blog posts) will tell you to just `npm link` while inside your project directory.

The `link` command will have `npm` symlink your app into your `PATH`, just like if you installed it. The major difference (besides not having to publish) is it links directly to the version of your code you are developing on. This is incredibly convenient, because now any changes you make to your code will be instantly available to your linked command. Your dev cycle now becomes:

1. code code code
2. `npm link`
3. test test test
4. update your code as necessary
5. go to step 3

Once you are done, you can `npm unlink` to clean up the symlink.

### 5. Other random tidbits

- `__dirname` will point to the path of the script file currently executing. If you want the path the user is currently in, use `process.env.PWD`.

- `child_process` will have a lot of good options for executing commands outside of node itself. `exec` is probably the easiest to get started with. Check out the [docs](https://nodejs.org/api/child_process.html) for help.

- There are a lot of packages out there to help you with the tedious parts of setting up CLI apps (mostly around argument or flag parsing). A few I would recommend: [`commander.js`](https://www.npmjs.com/package/commander), [`yargs`](https://www.npmjs.com/package/yargs), and [`ezcli`](https://www.npmjs.com/package/ezcli) (full disclosure, I created `ezcli`).

## Summary

It turns out node is quite capable at making CLI apps. `npm` has made this super easy with various conveniences, the community has provided us with a plethora of packages we could utilize, and JavaScript itself is a rapidly advancing language with many modern features. If you find yourself writing any scripts to do some rote tasks over and over again, I would highly recommend considering formalizing your code into a reusable command line application. This is what I have started doing for my own projects, both personal and professional, and let me tell you, it's a lot better than having those scripts just laying around my computer somewhere.