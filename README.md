## GithubVisualizer

This repository is based on (http://sourabhbajaj.com/GithubVisualizer/ to visualized the information of a repository:
 - Commits (Number of commits)
 - Users (Contribution to each repository)

CS 7450: Visualization of a Github organization.

### Dependencies

- D3.js
- Bootstrap
- Jquery
- Colorbrewer
- Moment.js
- Colorbox

### Original Repo
[http://sourabhbajaj.com/GithubVisualizer/](http://sourabhbajaj.com/GithubVisualizer/)

### How to used:

First Step:

git clone the current repository

Second step: 

Modify the script in the folder data_reading:
   ReadData.py
you need to update the variables with the corresponding values: 

```
GITHUB_CLIENTID = ''
GITHUB_CLIENTSECRET = ''
```

Then you can run 
   python ReadData.py

In the folder of the project run the npm server: 

http-server -c-1





