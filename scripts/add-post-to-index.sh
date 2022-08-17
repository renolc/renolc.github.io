title=$(echo $1 | sed -e 's/-\([a-z]\)/ \U\1/g' -e 's/^\([a-z]\)/\U\1/')

if [ -z ${2+x} ]; then
  l=3
else
  l=$2
fi

if [ -z ${3+x} ]; then
  d=$(date +"%a %b %d %Y")
else
  d=$3
fi

sed -i "${l}i \| $d \| \[$title\](/posts/$1) \|" raw/index.md
