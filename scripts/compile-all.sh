find raw -type f -name "*.md" | while read file; do
  file_name=$(basename $file '.md')
  base_path=$(dirname $file)
  bash scripts/compile-page.sh $base_path $file_name
done
