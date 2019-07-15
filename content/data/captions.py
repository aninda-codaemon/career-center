import os

import webvtt
import time
import datetime

#function to scrape directories
def get_immediate_subdirectories(a_dir):
    return [name for name in os.listdir(a_dir) if os.path.isdir(os.path.join(a_dir, name))]

#function for caption conversion into list to be fed by javascript
def convert_time(old_time):
    t = time.strptime(old_time,'%H:%M:%S.%f') #or ,%f for srt
    return datetime.timedelta(hours=t.tm_hour,minutes=t.tm_min,seconds=t.tm_sec).total_seconds()

#function to return json captions
def return_JSON_captions(captionPath):
    singleCaption = {}
    for file in os.listdir(captionPath):
        if file.endswith(".vtt"):
            capFile = os.path.join(captionPath, file)
            cap_count=1
            for caption in webvtt.read(capFile):
               singleCaption[cap_count] = [convert_time(caption.start), convert_time(caption.end), caption.text]
               cap_count+=1
    return singleCaption

#init final captions object outside loop
captions={}

#first directly open landing and load in landing video captions
landingPath = os.path.dirname(os.getcwd())+"/landing/captions"
captions["landing"] = return_JSON_captions(landingPath)

#next iterate over module directories and load in related captions
modulesPath = os.path.dirname(os.getcwd())+"/modules"
modulesDirectories = get_immediate_subdirectories(modulesPath)
for m in modulesDirectories:
    chaptersPath = modulesPath +"/"+m+"/chapters"
    moduleChaptersDirectories = get_immediate_subdirectories(chaptersPath)

    captions[m] = {}
    for c in moduleChaptersDirectories:
        captionPath = chaptersPath+"/captions/"
        captions[m][c] = return_JSON_captions(captionPath)

#finally dump captions into js file as json structure
import json
with open("captions.js", 'w+') as file:
    file.write("let captions = " + json.dumps(captions))

