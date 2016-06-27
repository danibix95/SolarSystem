# Solar System 

A Scientific Visualization Project

## The Project
The Solar System visualization project came out from what I learnt at Scientific Visualization course took at University of Trento. I use ray tracing concepts (for scene, camera and lights) and data sharing (to gather planetary data).

I choose to develop a 3D model of the Solar System because I'm amazed from what space can show to us and I think building one is a way to combine my interest with scientific visualization. Moreover a Solar System 3D model is a good example since it describe and visualize the place where we live (at an high level).

## Why ThreeJs
During the course we were exposed to [Processing][0] language, a very powerful tool that can be used to build every kind of visualization. But, since I worked a lot with web technologies, I decided to switch to a different approach. Working with web technologies also helped me to develop a cross platform application that can be execute through a simple browser on every device. At first I started to look at Javascript porting of Processing, but I was not so much happy with it. Hence I search something different around the web technology and I found [ThreeJs][1]. It is a light and powerful Javascript 3D library used to simplify the work with WebGL (the counter part of OpenGL for local application). With this library I develop this project.

## Data and Textures
All planets data were found on a NASA Planetary Fact Sheet [website][3], while textures were found on Solar System Scope [website][4].

## How to run the project
To run the project you need to start a local web server and serve files from it. This is an issue due to browsers' [**same origin policy** ][2] security restrictions, that doesn't let a local running file to load textures and JSON data that are not under the same place (*URL* and *port*).

If you have installed python package on your PC you can follow this procedure:

- Download the project folder
- Open a terminal and change the current working directory to the project directory

        cd <project_directory>
- Run the following command in the terminal. This will start the local web server:
        
        python3 -m http.server 8090
- Go to the following link in your browser: http://localhost:8090/index.html

## Contacts
Daniele Bissoli - 170889  
DISI - University of Trento

 [0]: https://www.processing.org/
 [1]: http://threejs.org
 [2]: https://en.wikipedia.org/wiki/Same-origin_policy
 [3]: http://nssdc.gsfc.nasa.gov/planetary/factsheet/
 [4]: http://www.solarsystemscope.com/textures/
