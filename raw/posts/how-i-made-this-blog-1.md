## How I Made This Blog - Part 1

### Collection

[Part 0 - High Level Overview and Inspirations](/posts/how-i-made-this-blog)
Part 1 - GitHub Pages (you are here)
Part 2 - Compiling HTML from MD with Pandoc
Part 3 - Markdown Styling
Part 4 - GitHub Workflows
Part 5 - Custom Scripts

### GitHub Pages

I decided to host my blog on [GitHub Pages](https://pages.github.com/). It's easy, free, and has [Workflows](https://docs.github.com/en/actions/using-workflows) so I can automate tasks.

#### Enabling GitHub Pages

Getting started is super quick. Just pick what branch and folder the root of the site's contents should be and click save.

<video controls src="/media/how-to-enable-github-pages.webm"></video>

Unfortunately, the folder options are hardcoded to either `/ (root)` or `/docs`. I had originally planned to go with `/public`, but alas. I went with `/docs` because I didn't think the raw md files and scripts should be included on the hosted page.

#### Adding a Custom Domain

After enabling the Page was done, I went about adding my custom domain. Again, this is very easy.

<video controls src="/media/github-pages-custom-domain.webm"></video>

Ok, it wasn't _quite_ that easy.

You have to add [various records](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) to your domain. My registrar of choice has been [Google Domains](https://domains.google/) for a while, and their interface for adding said records was pretty straight forward.

#### Enabling SSL

After about 24 hours for the domain record changes to be picked up by GitHub, it was time for my last challenge: enabling SSL. To be frank, I wasn't sure I was up to the task, but I persevered.

<video controls src="/media/github-pages-ssl.webm"></video>

Phew. After that ordeal, my page was all setup and ready to go. Except for all of the content and whatnot. That part comes later.
