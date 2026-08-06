LOOK AT THE VIDEO AGAIN AND AGAIN AND AGAIN 


=> In our local environment, we have frontend and backend. we need to run both in locally. 
=> how does docker helps here, it will package the application in a container with all its dependencies and run it in a isolated environment. 

=> generally 
    - frontend(vite 5173)
    - backend (express 3000)

=> Docker compose runs two containers. the first container is frontend on post 5173 , another container is backend on port 3000. during the time of local development, docker compose run two containers parallelly.  


at first , in the backend lets create a server.js file


-----------------
backend>server.js
-----------------

import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // Log HTTP requests

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK!',
  });
});

app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];
  res.status(200).json(users);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


//======================================================

now , in the frontend , let's install axios to make api calls.

------------------------
frontend>src>app>App.jsx
------------------------
import React from 'react'
import "./App.css"
import axios from 'axios'
import { useState , useEffect } from 'react'
const App = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('api/users')
      .then(res => {
        console.log(res.data);
        setUsers(res.data);
      })
  }, [])

  return (
    <div>
      
      {users.map((user) => {
        return (
          <div key={user.id}>
            <li>{user.name}</li>
          </div>
        )
      })}
    </div>
  )
}

export default App


we've also made changes in vs.config.js file::

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});


now, once we run frontend and backend , we can see that users are displayed on the screen.

//==============================================================

now, docker is used to manage the local environment of multiple developers.


Inside the backend , there are two files


-----------------------
backend > .dockerignore
-----------------------

.env 
node_modules




--------------------
backend > dockerfile
--------------------

FROM node:20-alpine

WORKDIR /app

# COPY package.json /app
# COPY package-lock.json /app
# we can write the above two lines in oneline

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000 
# this just shows that the container will be running on port 3000
# this doesn't actually publish the port to the host machine.

CMD ["node", "server.js"]



//======================================

in frontend too, there will be one .docker-ignore file and a dockerfile.


------------------------
frontend > .dockerignore
------------------------

.env
node_modules

----------------------
frontend > dockerfile
----------------------


FROM node:20-alpine

WORKDIR /app
 
COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]


//=======================================================

- so, in the backend folder, we have a dockerfile, with the help of this dockerfile , we'll create an image of backend
- similarly, we have a frontend folder too, and that has a docker file, with the help of this dockerfile, we'll create an image of frontend.
- so, during the development , we'll have two image, but during the production, there will be only one image and in that image, we'll have both frontend and backend running in a single container. 
- so, here we have two different docker file, and both the dockerfile will create two different image.
- so, we'll create containers with the two different image, one container for backend and one container for frontend.
- we can run multiple containers at the same time but that's not efficient. 

Eg: docker build . -t backend
docker run -p 8080:3000 -d backend

docker build . -t frontend
docker run -p 5173:5173 frontend

- we can follow the above process but that's not efficient, during the development, we create one image for backend and then run it, and the similar is done for frontend too.
- docker-compose solve this problem that we dont have to create an image again and again and run that image. docker compose does it for us::


------------------
docker-compose.yml
------------------

services:
  # since we need to run two container, we need two things, backend and frontend
  
  # backend service
  backend:
    build: ./backend
    # backend ki jo image banegi , uski dockerfile humko ./backend folder me hai
    ports:
      - '3000:3000'
      # we'll map the portnumber 3000 to 3000
    volumes:
      - ./backend:/app
      # in volumes ,we define ki backend folder k andar agar code main koi changes ho, toh usko hum turant container me reflect karna hai. for that we perform bind mounting inside app folder in container.
      # bind-mount ignores the .dockerignore file
      # bind mount maps a specific host file/directory to a container path. Useful for mounting source code for live devlopment, wwhere code changes on the host immediately reflect in the container.
      
      # jo image hoga ,wo container banayegi, uss container k andar hoga node:20-alpine, iske alawa rahega package.json and package-lock.json. Jab hum image k andar ak command run karenge "npm run install" toh mere pass aayega node_modules aur jab last main hum COPY . . karenge, toh uska matlab hai ki backend folder k andar jitni bhi  cheezain hai , wo container me aa jayegi. BTW, jitni bhi package.json, package-lock.json, node_modules, and other .dockerignore, dockerfile, server.js sab ja raha hai inside app folder because in dockerfile we have set WORKDIR /app

      # in the volumes, with the code ./backend:/app we are telling all the content inside the backend folder must be copied inside the app folder in the container. Jitni bhi package.json, package-lock.json, node_modules, .dockerignore, dockerfile, server.js hai, sab app folder k andar aah jayegi. Pehle jo app folder k ander content tha , wo naya content se override ho jata hai. iska ak problem hai, ab jo container banta hai, uska jo base rehta hai, wo rehta hai linux, but jo node_modules folder hai,that is inside the app folder, wo gaya hai mera windows machine se hai, toh wo node_modules ak error de sakta hai, aur isi cheez se bachne k liye hum ak volume create karte hain::
      - backend_node_modules: /app/node_modules
      # iss line ka matlab hai, ki jo node_modules aaye hain unko replace karo image k andar k node_modules se.
      # image k andar 4 cheez rehti hain,  OS, Nodejs runtime environment, dependencies(node_modules), codebase
      # with this line - backend_node_modules: /app/node_modules, jo node_modules container main hain unko replace kar deta hai image k node_modules se. kyunki container main jo node_modules tha wo window ka node_modules tha , lekin container linux based hoti hai , toh windows ka node_modules linux main error kar sakte hain
      # bind-mount ignores the .dockerignore file, 

    command: npx nodemon -L server.js

  # frontend service
  frontend:
    build: ./frontend
    ports:
      - '5173:5173'
    volumes:
      - ./frontend:/app
      - frontend_node_modules: /app/node_modules
    command: npm run dev

  volumes:
    backend_node_modules:
    frontend_node_modules:


now, just run "docker compose up" in day-160


//========================================================

LOOK AT THE VIDEO AGAIN AND AGAIN AND AGAIN