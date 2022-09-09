## How I Made This Blog - Part 2

### Collection

[Part 0 - High Level Overview and Inspirations](/posts/how-i-made-this-blog)
[Part 1 - GitHub Pages](/posts/how-i-made-this-blog-1)
Part 2 - Compiling HTML from MD with Pandoc (you are here)
Part 3 - Markdown Styling
Part 4 - GitHub Workflows
Part 5 - Custom Scripts

### MD -> HTML with Pandoc

[Pandoc](https://pandoc.org/) is an excellent tool for converting one markup document type to another. Specifically in this case, I wanted to type in Markdown and get static HTML output.

At its most basic level, this is quite easy:

```
pandoc path/to/file.md \
  -f markdown \
  -t html \
  -o output/file.html
```

I am more familiar and used to [GitHub Flavor Markdown](https://github.github.com/gfm/), plus hard line breaks. Thankfully those are built-in options in pandoc as well.

```
pandoc path/to/file.md \
  -f gfm+hard_line_breaks \ # <--
  -t html \
  -o output/file.html
```

This is great, but it only generates a subset of an HTML page. With the [-s](https://pandoc.org/MANUAL.html#option--standalone) flag, we can tell pandoc we want full HTML output, including all headers and footers.

```
pandoc path/to/file.md \
  -f gfm+hard_line_breaks \
  -t html \
  -s \ # <--
  -o output/file.html
```

Now we're talking.

Next I wanted to customize the exact styling and template, which again, [pandoc has an answer to](https://pandoc.org/MANUAL.html#templates).

I quickly threw together a [template file](https://github.com/renolc/renolc.github.io/blob/main/templates/html.template) with my desired common header, put in a `$body$` tag for the dynamic content, and voila.

```
pandoc path/to/file.md \
  --template templates/html.template \ # <--
  -f gfm+hard_line_breaks \
  -t html \
  -s \
  -o output/file.html
```

Instead of embedding styling as the default templates do, I opted for linking to an external css file. This allowed me to update styles as needed without having to update each individual page.

I'll talk more about the styling in the next installment.
