read -p 'commit message: ' commitMessage
echo $commitMessage

git add .
git commit -m "$commitMessage"
git push