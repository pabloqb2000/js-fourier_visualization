import re
from os import listdir
from os.path import isdir, join

print("Making changes to all files, you want to proceed? [y/n]")
if(input() != 'y'):
    exit()

for d in listdir():
    if isdir(d):
        fileName = r'UI/options_box.js'
        with open(join(d, fileName), "r") as f:
            data = f.read()

        # Make changes in file
        data = re.sub(r'textSize.this.height.0.8.;',
          '',
          data)
        
        print(data)

        with open(join(d, fileName), "w") as f:
            f.write(data)
print('Press enter to continue')
input()

