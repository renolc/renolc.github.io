file_name=$(basename $1 '.md')
base_path=$(dirname $1)
pandoc $1 --template ./templates/html.template -f gfm+hard_line_breaks -s -o ./public${base_path:3}/$file_name.html
