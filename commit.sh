echo "git commit -m "
read -p '> ' commitMessage
echo $commitMessage

git add .
git commit -m "$commitMessage"
git push