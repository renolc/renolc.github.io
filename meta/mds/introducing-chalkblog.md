# Introducing: chalk-blog

For the past few months I've started having ideas for blog articles I wanted to write. Not having an actual blog made that somewhat difficult, so naturally, that led into how I could develop my own blogging system...

I knew I wanted to be able to host the blog statically, and I only have a few requirements, so it should be easy, right? Well, the go-to solution for that would probably be [jekyll](https://jekyllrb.com). Jekyll is amazing, but honestly, way too much for my needs. I'm sure I could have found something else that would have worked well, but I like making things so, here I am.

My requirements were fairly simple:
- it had to allow me to write my posts in markdown
- it had to support syntax highlighting for code snippets
- it had to be hostable on GitHub Pages (because freeeee)

With those in mind, I began working on [chalk-blog](https://github.com/renolc/chalk).

I decided to go with a CLI app written in Node. Mostly, because I like Node, and I have been wanting to learn the basics of making CLI apps in it and this seemed like the perfect excuse. That eventually led me down a rabbit hole of interesting side projects which I will probably blog about later, but for now, lets talk about `chalk-blog`:

```bash
# install the `chalk` binary
npm i chalk-blog -g

mkdir my-blog
cd my-blog

# create a skeleton blog and setup git
chalk init git@my.repo.url/.git

# create and open a new md file
chalk new First Post

# build and publish local changes
chalk publish
```

And that's about it. Simplicity is what I was going for, since I didn't have too many features to worry about. Heck, in my first version, the HTML was even hardcoded into the code itself.

Thankfully, I decided to iterate until it slightly more flexible. Now, after a `chalk init`, it will copy over some template files which are completely customizable. After altering the HTML and CSS, a simple `chalk publish` will update all your posts and push to your remote repo.

I will probably keep iterating over this project as I find I have a need for specific features in the future, but for now it works and I can start thinking about the blog content a little more, and the blog tooling a little less... at least, theoretically. I kind of like thinking about/working on the tooling, so I'm sure I'll find some excuse in the future to ignore my blog for the sake of building out better blogging apps instead.