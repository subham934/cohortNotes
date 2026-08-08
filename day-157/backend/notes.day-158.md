Today, we'll see docker.

here , is a story::

=> in our developer team, there are three guys, A, B , C.
=> A uses windows node:18
=> B uses mac node:20
=> C uses linux node:22
=> they are in the same developer team but their local development environment are different.
=> now, let's say C creates a function X() in the codebase.
=> he test it on his local machine (linux node:22) and it works.
=> then he push his code to the github.
=> but the Testing environment uses Node:18
=> so it will not work for the Testing team and also for A and B.
=> now there will be a new problem that who has to resolve this issue?
=> A will say that C has to resolve this issue because he created the function X().
=> B will say that A has to resolve this issue because he is the senior developer.
=> C will say that he has tested the function X() on his local machine and it works.
=> so there will be a blame game.
=> in this scenario, we cannot deploy the code to production.
=> also , if the production server code is on node:20 , and we try to deploy the same code to production server with node:22 , it will not work.
=> now , to resolve this issue we can use Docker.

=> what is Docker? why we need docker?
=> docker make sure that the local environment and production environment are same for all the developers.

Docker has

1. Images
2. Container

Image: it is the collection of 4 things:

1. Codebase
2. Node:18 (runtime environment)
3. OS (Operating System)
4. Dependencies

Container:
Container is the running instance of an Image.

Docker has two concept , Images and container

=> Image and container are different from each other.
=> Image cannot run on its own, but container can run on its own.

what is dockerfile
=> Dockerfile is a text file that contains the instructions to create an image.
=> we write stages inside dockerfile to create image.
=> Stages is nothing but a sequence of instructions.



Dockerfile command

01. FROM: it is the base image for our application.
02. COPY: it is used to copy the codebase from the host machine to the container.
03. WORKDIR: it is used to set the working directory for our application.
04. EXPOSE: it is used to expose the port for our application.
05. RUN: it is used to run the commands inside the container.
06. CMD: it is used to run the commands inside the container.
07. ENTRYPOINT: it is used to run the commands inside the container.
08. ENV: it is used to set the environment variables for our application.
09. LABEL: it is used to set the labels for our application.
10. STOPSIGNAL: it is used to set the stop signal for our application.
11. USER: it is used to set the user for our application.
12. VOLUME: it is used to set the volume for our application.
13. SHELL: it is used to set the shell for our application.
14. HEALTHCHECK: it is used to set the health check for our application.
15. ONBUILD: it is used to set the onbuild for our application.

//===================================================================

-> let's see how it works::

=> we'll install express and create the app.js and server.js file, inside it, we'll write the code to start the server.

----------
src>app.js
----------

import express from "express";

const app = express();

app.use(express.json())

app.get("/", (req, res)=>{
    res.send("Hello, World!!")
})


app.get("/api/data", (req, res)=>{
    const data = {
        message: "This is some sample data from the API.",
        timestamp: new Date()
    }
    res.json(data)
})


export default app;






----------
server.js
----------

import app from "./src/app.js"


app.listen(3000, ()=>{
    console.log(`Server is running on port 3000`)
})

=> we can run the server.js file with npx nodemon server.js


=> now, let's create the dockerfile, and with this dockerfile we'll create an image.
=> this dockerfile will have codebase, dependencies, nodejs, and OS.

---

## dockerfile

FROM node:20-alpine

# this has nodejs and OS

COPY package.json .

# copy the package.json to the docker image

COPY package-lock.json .

# copy the package-lock.json to the docker image

RUN npm install

# install the dependencies inside the package.json and package-lock.json

COPY . .

# copy the entire current directory to the docker image (since dockerfile is inside backend directory, so it will copy the entire backend directory),

# now we have a question what is the need of copying package.json and package-lock.json separately

# the answer is , if we copy package.json and package-lock.json separately, then , when we change the codebase, we don't have to install the dependencies again.

# also, if we copy package.json and package-lock.json separately, then , when we change the codebase, we don't have to install the dependencies again.

# also, when we write FROM node:20-alpine, we dont make further changes in node-20 version nor linux, so that part will remain constant, so the outcome of step-1 will remain same, so it be cache'd by docker.

# if we change codebase, then the outcome of step-1, step-2, step-3 & step-4 will remain same and step-4 will provide same output.

# but the code inside our codebase can change, so the cahnges we see on the server will only be from step-5 and it will bring changes from step-5 to end. so it will save time and resources.

# we use the RUN keyword when we create an image.

# CMD is used when we start the image. 

CMD ["node", "server.js"]

# here "node" and "server.js" are the two command line arguments, and since it is in array format, we call it as exec format.

//============================

to create an image we use:: 
docker build . -t <imagename>

to run this image, we write as::
docker run <imagename>

now, image is transformed into container.

there is a catch, our server started on port 3000 inside the container , but we cannot access it from outside the container.

to access it from outside the container, we use the -p flag.

docker run -p <hostport>:<containerport> <imagename>

docker run -p 8000:3000 express_server




//============================
To check which version of node is running inside container::
at first, we'll hve to get the containerId, for that we write as :
docker ps

then , check which version of node is running inside container using exec command::
docker exec -it <containerid> node --version

to stop a container::
docker stop <containerid>


to delete a container::
docker rm <containerid>

//=============================================================



now, inside app.js we have cerated one more api::

app.get("/api/users", (req, res)=>{
  const users = [
    {id: 1, name: "John Doe", email: "[EMAIL_ADDRESS]", role: "admin"},
    {id: 2, name: "Jane Doe", email: "[EMAIL_ADDRESS]", role: "user"},
    {id: 3, name: "Bob Smith", email: "[EMAIL_ADDRESS]", role: "user"},
  ]

  return res.status(200).json(users)   
})

this API is not available inside the image

now we run the image as docker run -p 8000:3000 express_server::

we can see over the browser , when we run localhost:8000/api/data it works, but localhost:8000/api/users , it dont.

what does it mean?
=> it means that when we created the image, the api localhost:8000/api/users was not available, hence fourth, the container will also not have it.
=> to add the new api to the container, we'll have to create the image again.

docker build . -t express_server

since we have created an image with same name as previous one, the previous one gets override. this new image has our new API.

now, if we run docker run -p 8000:3000 express_server , then , this time it will work.


=> all the process we did is very manual and we have to do it every time we make a change in the codebase.
=> to resolve this issue, we use docker-compose.

//=============================================================

=> most frequent changes occur only in our codebase. we will link the host machine's codebase with the container's codebase using volume. any changes we make in our host machine's codebase , it will sync with container and will reflect immediately. no need to create image again and again.

=> we will create a file called docker-compose.yml, here we'll create services which will have backend service , inside it, it will have build , this build have path to that folder which have dockerfile. here we'll also define ports and volumes.



------------------
docker-compose.yml
------------------

services:
  # backend is the name of our service
  backend:
    build: ./backend
  # build is used to build the image from the dockerfile. ./backend is the path of the folder that has the dockerfile of backend.
    ports:
      - "8000:3000"
  # ports is used to map the ports . "8000:3000" means host machine's port 8000 is mapped to container's port 3000.
    volumes:
      - ./backend:./
  # volumes is used to mount the host machine's codebase to the container's codebase. So , if we change the codebase on the host machine, it will automatically be reflected in the container.
    

=> close all the container.

to run the docker compose , write the command as "docker compose up" but before that , we need to make some small changes.

lets start our server:: docker run -p 8000:3000 express_server

=> now if we see our container, it will have files, and we can check what files are there in container, this will have our /backend files. Now, the problem is we dont want the server's file along with OS file. So, we will create an app folder and inside the files, and we will put our server's code. Let's make changes in dockerfile and docker-compose.yml files ::

-------------
dockerfile::
-------------

FROM node:20-alpine

# this is the change, add WORKDIR /app and we put the entire code inside /app directory.
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install

COPY . /app

CMD ["node", "server.js"]

//==============================


------------------
docker-compose.yml
------------------
services:
  # backend is the name of our service
  backend:
    build: ./backend
    # build is used to build the image from the dockerfile. ./backend is the path of the folder that has the dockerfile of backend.
    ports:
      - "8000:3000"
    # ports is used to map the ports . "8000:3000" means host machine's port 8000 is mapped to container's port 3000.
    volumes:
      - ./backend:/app
      - backend_node_modules:/app/node_modules
    
    # volumes is used to mount the host machine's codebase to the container's codebase. So , if we change the codebase on the host machine, it will automatically be reflected in the container.
    
    # ak cheez sure hai ki node_modules ka folder hamare container k andar nahi jaayega, but i want ki, baki jo code hai vo mere container k ander jaaye, with the line of code "- ./backend:/app" , maine bola ki backend folder k ander jitne bhi code hai , wo sync kar do mere container k ander app folder k saat. but problem hai ki backend folder main jo node_modules hai, wo chala jaayega mere container k ander bhi, toh problem ho skati hai isliye hamne 2nd line of code "backend_node_modules:/app/node_modules" bhi de di. 
    
    # iska matlab hai ki, backend folder k andar node_modules ka folder to use karega hi, par usko ignore karega container k andar as it is, usko sync na kare. The overall concept is backend folder k andar jitna bhi content hai wo le aao, but app folder k andar ka node modules khud se maintain karna.


    # The first volume mounts the backend folder from the host machine
    # into the /app folder inside the container.
    #
    # Therefore, when we change our source code on the host machine,
    # those changes are immediately reflected inside the container.
    #
    # But there is one problem:
    # ./backend also contains node_modules.
    #
    # We don't want the host machine's node_modules to be used inside
    # the container because the dependencies installed on the host
    # may be different from the dependencies/environment required
    # inside the container.
    #
    # That's why we use a second volume:
    #
    # backend_node_modules:/app/node_modules
    #
    # This creates a separate Docker volume for /app/node_modules.
    #
    # Because this volume is mounted specifically at /app/node_modules,
    # it takes precedence over the node_modules directory that would
    # otherwise come from ./backend:/app.
    #
    # So the overall idea is:
    #
    # ./backend:/app
    # → Mount the entire backend codebase into /app.
    #
    # backend_node_modules:/app/node_modules
    # → Keep /app/node_modules separate from the host's node_modules.
    #
    # In other words:
    # "Bring the backend code into /app, but maintain node_modules
    # separately inside a Docker volume."


    command: npx nodemon -L server.js

volumes:
  backend_node_modules:

//==============================

create a new image::
docker build . -t express_server

run this image::
docker run -p 8000:3000 express_server

now stop this image::
docker stop <containerid>


now , we can go to files and see a folder called "app" which has dockerfile, server.js, src etc.

now clear everything in host machine terminal and go back to the root folder that has the docker-compose.yml file. and start the server using docker-compose as::
docker compose up



-------------
.dockerignore
-------------

.env
node_modules


read: bind mounts, volumes