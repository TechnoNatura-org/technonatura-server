read -p 'commit message: ' uservar
echo $uservar

git add .
git commit -m "$uservar"
git push