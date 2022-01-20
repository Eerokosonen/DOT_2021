# Sleep Tracker - Project work for DOT_2021

Project work for the course State-of-art technologies in Digital Learning Environments

## Description
The app works as a tool for a sleep-tracking related course assignment. The assignment is a subtask in University’s online course (Introductory Course in Public Health). The assignment includes a sleep diary for a week (observing student’s own sleep and its effect on mood and alertness). Based on the student’s observations, the student will produce an essay in which he reflects his observations on theoretical knowledge about sleep. 

The sleep tracking tool is designed for course students. The student can keep a sleep diary and write down the most important (guided) aspects for the assignment (eg. perceived quality and quantity of sleep, as well as observations of the effect on the day's alertness and coping). In addition, the student can use the tool to produce a compilation of data that visualizes the amount of sleep from the data. 

The sleep tracking tool collects data about the slept hours, an assessment of the quality of sleep based on the student's own experience, and possibly additional daily notes. The data helps the student to observe the relationship between the amount of sleep and the perceived quality, as well as their own recorded observations of (for example) the day's state of alertness.  

The sleep tracking tool could be logged in with user IDs (the uni e-mail), which could be used to collect data on usage activity. 

## How the app was made:
The app was built using React and standard CSS styling. The login functionality was just for demonstration with no backend. 
All of the user input data was stored in a JSON-file, and read and wrote using a Node.js REST API.
The source code can be reviewed in the src folder.

## Demo video of the app found at:
https://youtu.be/0QT9dppCfd8


_______________________________________________

# Using the app

json-server startup (in the project directory):
json-server --watch obs.json

Starting the react app (in the project directory):
npm start




