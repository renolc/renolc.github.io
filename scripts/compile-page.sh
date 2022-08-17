file_name=$(basename $1 '.md')
base_path=$(dirname $1)
echo "file_name $file_name"
echo "base_path $base_path"
echo "base_path:3 ${base_path:3}"
pandoc $1 --template templates/html.template -f gfm+hard_line_breaks -s -o public${base_path:3}/$file_name.html
