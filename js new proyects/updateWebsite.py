import re
from os import listdir, system
from os.path import isdir, join

dont_add = ['default_proyect', 'Click_math']

with open('./Click_math/sketch.js', "r") as f:
    data = f.read()

data = data.split('\n')
proys = data[0].split("'") + dont_add
data[0] = data[0][:-2]
data[1] = data[1][:-2]

for d in listdir():
    if isdir(d) and d not in proys:
        data[0] = data[0] + ", '" + d + "'"
        d = d.split('-')[1]
        d = re.sub('_', ' ', d)
        d = d[0].capitalize() + d[1:]
        data[1] = data[1] + ", '" + d + "'"

data[0] = data[0] + '];'
data[1] = data[1] + '];'

data = '\n'.join(data)

print(data)
with open('./Click_math/sketch.js', "w") as f:
    f.write(data)

system("commit_website.sh")

print('Press enter to continue')
input()
