import os
import webloc
import urllib

def getOtherFiles(path):
  linkList = []
  for f in os.listdir(path):    
    linkList.append(f)
  return linkList

path = '/home/aninda/Development/career-center/content/modules/mod1/outils'

file_list = getOtherFiles(path)
print('-------Outils--------')
for name in file_list:
  print(name)

path = '/home/aninda/Development/career-center/content/modules/mod1/noter'
file_list = getOtherFiles(path)
print('\n-------Noter--------')
for name in file_list:
  print(name)