## How I Made This Blog

First, I will say that everything about how this blog is built and works is on [GitHub](https://github.com/renolc/renolc.github.io). If you want to poke around and figure it out yourself, be my guest.

### Collection

I intend for this to be a multi-part blog series, where I will take one part of the system and explain it as thoroughly as I can. Below is a general outline of what I plan to write, but it is subject to change. As I complete each part, I will update this section to link to the posts.

[Part 0 - High Level Overview and Inspirations (you are here)](/posts/how-i-made-this-blog)
Part 1 - GitHub Pages
Part 2 - Compiling HTML from MD with Pandoc
Part 3 - Markdown Styling
Part 4 - GitHub Workflows
Part 5 - Custom Scripts

### Overview

Let's start with a high level overview.

1. a markdown file is written into a `raw` folder
2. on a git push, a GitHub workflow takes over
3. the workflow compiles any markdown changes and places the generated html files into a `docs` folder at the same relative path
4. if the compiled markdown was with a `raw/posts` folder, it is also prepended to the index table of posts, as well as the RSS xml

Each of those has multiple sub-steps and nuances, but that's the gist of it.

### Inspiration

- https://xeiaso.net/blog - for the markdown styling
- https://blot.im/ - for the "drop md here, receive html there" feature
- https://prose.sh/ - similar md -> html as blot, but also for the super clean output
- [MacDown](https://macdown.uranusjr.com/) - for the Tomorrow+ css theme
