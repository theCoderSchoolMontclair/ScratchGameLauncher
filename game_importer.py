import subprocess
import os
import shutil
import json

output=subprocess.check_output(['node','./Games/scratch_html_converter.js'])

"""game_location=output.splitlines()[0].decode('UTF-8')
game_name=output.splitlines()[1].decode('UTF-8')"""


#gets location of games and places the path in the games_dir variable
with open('./Games/config.json','r') as f:
    paths = json.load(f)
games_dir=paths.get('output_path','')
f.close()
game_name=''
#gets first file that ends in '.html' in games director
for file in os.listdir(games_dir):
    if file.endswith(".html"):
        game_name=file#[:file.index('.')]
        break
print(game_name)

old_game_thumbnail=''

for file in os.listdir(games_dir):
    if file.endswith(".png") or file.endswith(".jpg") or file.endswith(".svg"):
        old_game_thumbnail=file
        break
print(old_game_thumbnail)
#print(game_name+game_thumbnail[game_thumbnail.index('.'):])

new_thumbnail=game_name[:game_name.index('.')] + old_game_thumbnail[old_game_thumbnail.index('.'):]

os.rename(games_dir + old_game_thumbnail , games_dir + new_thumbnail)
shutil.move(games_dir+new_thumbnail,"./Games/GameThumbnails/")
shutil.move(games_dir+game_name,"./Games/GameFiles/")
category = "Scratch"

with open("games.js",'r') as f:
    gamelist=f.read()

game_to_be_added=""
game_to_be_added+='        {\n'
game_to_be_added+='            "name": "'+game_name[:game_name.index('.')]+'",\n'
game_to_be_added+='            "path": "Games/GameFiles/'+game_name+'",\n'
game_to_be_added+='	        "thumbnailpath":"Games/GameThumbnails/'+new_thumbnail+'",\n'
game_to_be_added+='          category: "{category}",\n'
game_to_be_added+='        },\n'
game_to_be_added+=']'

gamelist=gamelist.replace("]",game_to_be_added)

with open("games.js",'w') as f:
    f.write(gamelist)
f.close()
gamebasename=game_name[:game_name.index('.')]
if os.path.exists(games_dir+gamebasename+".sb3"):
  os.remove(games_dir+gamebasename+".sb3")
else:
  print("The file does not exist") 