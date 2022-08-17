p="$1/$2.md"
pandoc $p --template templates/html.template -f gfm+hard_line_breaks -s -o docs${1:3}/$2.html
