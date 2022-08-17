title=$(echo $1 | sed -e 's/-\([a-z]\)/ \U\1/g' -e 's/^\([a-z]\)/\U\1/')
sed -i "${2=3}i \| date \| \[$title\](/posts/$1) \|" raw/index.md
