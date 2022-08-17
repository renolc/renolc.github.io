file_name=$(basename $1 '.md')
base_path=$(dirname $1)
rm public${base_path:3}/$file_name.html