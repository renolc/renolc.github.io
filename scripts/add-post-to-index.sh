title=$(echo $1 | sed -e 's/-\([a-z]\)/ \U\1/g' -e 's/^\([a-z]\)/\U\1/')
$l="$2"
$d="$3"
sed -i "${l=3}i \| ${d=$(date +"%a %b %d %Y")} \| \[$title\](/posts/$1) \|" raw/index.md
