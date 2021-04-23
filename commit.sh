YorN=('Y' 'N')

# yesOrNo () { 
#     target=$1
    
#     for color in "${YorN[@]}"
#     do
#         if [ $color == $1 ]
#         then
#             echo false
#             break
#         else 
#             echo true
#         fi
#     done
# }

# of= yesOrNo 'Y'

echo "git commit -m "
read -p '> ' commitMessage
echo $commitMessage

# echo $of
# push='1'
# while [$push -z] || [yesOrNo $push]
# do 
# echo "would you like to push? (Y/N)"
# read -p '> ' push
# done

echo "\nwould you like to push? (Y/N)"
read -p '> ' push

git add .
git commit -m "$commitMessage"

if [[ "$push" == "Y" ]]
then
    echo "\npush to github"
    git push
else 
    echo "not push to github"
fi

# git push
