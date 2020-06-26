for file in *; do 			# for each file in directory
	if [[ -d $file ]]; then # if file is directory
		cd $file
		echo $file
		git add .			# add commit and push
		git commit -m "Updated website name"
		git push
		echo ""
		echo ""
		cd ..
	fi
done
# read -p "Press enter to continue"
