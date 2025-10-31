import json
import os
import shutil

#gets location of games and places the path in the games_dir variable
with open('./Games/config.json','r') as f:
    paths = json.load(f)
games_dir=paths.get('output_path','')
f.close()

#gets first file that ends in '.txt' in games director
game_file=""
for file in os.listdir(games_dir):
    if file.endswith(".txt"):
        game_file=file
        break
game_name=""
game_link=""
if game_file!="":
    with open(games_dir+game_file,"r") as f:
        game_name=f.readline().strip()
        game_link=f.readline().strip()
    f.close()
    os.remove(games_dir+game_file)
    print(game_name)
    print(game_link)


old_game_thumbnail=''
for file in os.listdir(games_dir):
    if file.endswith(".png") or file.endswith(".jpg") or file.endswith(".svg"):
        old_game_thumbnail=file
        break
if old_game_thumbnail=="":
    print("no thumbnail image detected")
    exit()
print("old game thumbnail",old_game_thumbnail)
new_thumbnail=game_name + old_game_thumbnail[-4:]
print("new game thumbnail",new_thumbnail)
os.rename(games_dir + old_game_thumbnail , games_dir + new_thumbnail)
shutil.move(games_dir+new_thumbnail,"./Games/GameThumbnails/")


category = "PixelPad"

with open("games.js",'r') as f:
    gamelist=f.read()

game_to_be_added=""
game_to_be_added+='        {\n'
game_to_be_added+='            "name": "'+game_name+'",\n'
game_to_be_added+='            "path": "'+game_link+'",\n'
game_to_be_added+='	        "thumbnailpath":"Games/GameThumbnails/'+new_thumbnail+'",\n'
game_to_be_added+='            "category":"'+category+'",\n'
game_to_be_added+='        },\n'
game_to_be_added+=']'

gamelist=gamelist.replace("]",game_to_be_added)

with open("games.js",'w') as f:
    f.write(gamelist)
f.close()

