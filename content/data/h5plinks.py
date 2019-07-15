import os
import webloc
import urllib

def get_immediate_subdirectories(a_dir):
    return [name for name in os.listdir(a_dir) if os.path.isdir(os.path.join(a_dir, name))]

def getLinks(path):
    linkList = []
    for f in os.listdir(path):
        if f.endswith(".webloc"):
            url = webloc.read(path+"/"+f)
            linkList.append(url)
        elif f.endswith(".url"):
            f = open(path+"/"+f, "r")
            for l in f:
                if l.startswith("URL="):
                    url = l[4:-1]
            f.close()
            linkList.append(url)
    return linkList

data = {}

modulesPath = os.path.dirname(os.getcwd())+"/modules"
modulesDirectories = get_immediate_subdirectories(modulesPath)
for m in modulesDirectories:
    data[m] = {}
    chaptersPath = modulesPath +"/"+m+"/chapters/online"
    exercisesPath = modulesPath +"/"+m+"/exercises/online"

    data[m]["chapters"] = getLinks(chaptersPath)
    data[m]["exercises"] = getLinks(exercisesPath)

#finally dump captions into js file as json structure
import json
with open("h5plinks.js", 'w+') as file:
    file.write("let h5plinks = " + json.dumps(data))

