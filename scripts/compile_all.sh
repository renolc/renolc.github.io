find raw -type f -name "*.md" | while read file; do
  file_name=$(basename $file '.md')
  path=$(dirname $file)
  pandoc $file --template templates/html.template -f gfm+hard_line_breaks -s -o docs${path:3}/$file_name.html
done