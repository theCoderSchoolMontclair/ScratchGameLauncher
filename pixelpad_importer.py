import json
import os
import shutil

#gets location of games and places the path in the games_dir variable
try:
    with open('./Games/config.json','r') as f:
        paths = json.load(f)
    games_dir=paths.get('output_path','')
    f.close()
except:
        print("Couldn't load config")
        input()
        exit()


#gets first file that ends in '.txt' in games director
txt_file=""
for file in os.listdir(games_dir):
    if file.endswith(".txt"):
        txt_file=file
        break
game_name=""
game_link=""
if txt_file!="":
    with open(games_dir+txt_file,"r") as f:
        try:
            game_name=f.readline().strip()
            game_link=f.readline().strip()
        except:
            print("missing game name or link in textfile")
            input()
            exit()
    f.close()
    if game_name=="":
        print("missing game name")
        input()
        exit()
    if game_link=="":
        print("missing game link")
        input()
        exit()
    print(game_name)
    print(game_link)
else:
    print("missing text file")
    input()
    exit()


old_game_thumbnail=''
for file in os.listdir(games_dir):
    if file.endswith(".png") or file.endswith(".jpg") or file.endswith(".svg"):
        old_game_thumbnail=file
        break
if old_game_thumbnail=="":
    print("no thumbnail image detected")
    input()
    exit()
print("old game thumbnail",old_game_thumbnail)
new_thumbnail=game_name + old_game_thumbnail[-4:]
print("new game thumbnail",new_thumbnail)

category = "PixelPad"
try:
    with open("games.js",'r') as f:
        gamelist=f.read()
except:
    print("missing games.js")
    input()
    exit()
game_to_be_added=""
game_to_be_added+='        {\n'
game_to_be_added+='            "name": "'+game_name+'",\n'
game_to_be_added+='            "path": "'+game_link+'",\n'
game_to_be_added+='	        "thumbnailpath":"Games/GameThumbnails/'+new_thumbnail+'",\n'
game_to_be_added+='            "category":"'+category+'",\n'
game_to_be_added+='        },\n'
game_to_be_added+=']'


try:
    os.rename(games_dir + old_game_thumbnail , games_dir + new_thumbnail)
except:
    print("couldn't rename image")
    input()
    exit()
try:
    shutil.move(games_dir+new_thumbnail,"./Games/GameThumbnails/")
except:
    print("couldn't move thumbnail image from input directory to GameThumbnails folder")
    input()
    exit()

try:
    os.remove(games_dir+txt_file)
except:
    print("could not remove txt file")

try:
    gamelist=gamelist.replace("]",game_to_be_added)
except:
    print("missing ] in games.js")
    input()
    exit()
with open("games.js",'w') as f:
    f.write(gamelist)
f.close()